import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../BD/schemas/users.schema';
import { Rating } from '../BD/schemas/ratings.schema';
import { Ranking } from '../BD/schemas/rankings.schema';
import { Project } from '../BD/schemas/projects.schema';
import { Comment } from '../BD/schemas/comments.schema';
import { Badge } from '../BD/schemas/badges.schema';
import { AIReview } from '../BD/schemas/ai_review.schema';
import { PaginationDto } from '../dtos/paginate.dto';
import axios from 'axios';

@Injectable()
export class ProcesosService {
  constructor(
    @InjectModel('users') private readonly userModel: Model<User>,
    @InjectModel('ratings') private readonly ratingModel: Model<Rating>,
    @InjectModel('rankings') private readonly rankingModel: Model<Ranking>,
    @InjectModel('projects') private readonly projectModel: Model<Project>,
    @InjectModel('comments') private readonly commentModel: Model<Comment>,
    @InjectModel('badges') private readonly badgeModel: Model<Badge>,
    @InjectModel('aireviews') private readonly aiReviewModel: Model<AIReview>,
  ) {}
  async pagina_principal(paginationDto: PaginationDto) {
    try {
      const { limit, page, search } = paginationDto;
      const baseUrl =
        'https://red-networking-backend.vercel.app/api/pagina_principal';
      const totalPages = await this.projectModel.countDocuments();
      const next_page_url = `${baseUrl}?page=${page + 1}`;
      const prev = page - 1;
      const prev_page_url = `${baseUrl}?page=${prev < 1 ? null : prev}`;

      return {
        data: {
          data: await this.projectModel
            .find()
            .sort({ createAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
          total: totalPages,
          current_page: page,
          last_page: Math.ceil(totalPages / limit),
          next_page_url,
          prev_page_url,
        },
        operation: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error Interno',
        operation: false,
        data: null,
      };
    }
  }

  async crearProyecto(data: any) {
    console.log('Datos recibidos:', data); // <-- Agrega esto
    const now = new Date();
    const proyecto = new this.projectModel({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return proyecto.save();
  }

  async getUser(idUser) {
    const users = await this.userModel.findById(idUser);
    return users;
  }

  async agregarPuntuacion(idProyecto: string, puntuacion: number) {
    return this.projectModel.findByIdAndUpdate(
      idProyecto,
      { $push: { puntuacion } },
      { new: true },
    );
  }

  async obtenerPromedioPuntuacion(idProyecto: string): Promise<number | null> {
    const proyecto = await this.projectModel.findById(idProyecto);
    if (!proyecto || !proyecto.puntuacion || proyecto.puntuacion.length === 0) {
      return null;
    }
    const suma = proyecto.puntuacion.reduce((acc, val) => acc + val, 0);
    return suma / proyecto.puntuacion.length;
  }

  async agregarComentario(idProyecto: string, data: any) {
    const nuevoComentario = await this.commentModel.create({
      ...data,
      projectID: idProyecto,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: [],
    });

    await this.projectModel.findByIdAndUpdate(idProyecto, {
      $push: { comments: nuevoComentario._id },
    });
    return nuevoComentario;
  }

  async obtenerProyectosPorUsuario(userId: string) {
    return this.projectModel.find(
      { authors: userId },
      { _id: 1, title: 1, repositoryLink: 1, description: 1, tools: 1 },
    );
  }

  async ranking() {
    try {
      // Obtener todos los proyectos con sus puntuaciones
      const proyectos = await this.projectModel.find();
      // Calcular la suma de puntuaciones para cada proyecto y ordenar
      const proyectosConPuntuacion = proyectos.map((proyecto) => {
        const sumaPuntuacion =
          proyecto.puntuacion && proyecto.puntuacion.length > 0
            ? proyecto.puntuacion.reduce((acc, val) => acc + val, 0)
            : 0;

        return {
          ...proyecto.toObject(),
          sumaPuntuacion,
        };
      });

      // Ordenar de mayor a menor puntuación y tomar solo los primeros 10
      const top10Proyectos = proyectosConPuntuacion
        .sort((a, b) => b.sumaPuntuacion - a.sumaPuntuacion)
        .slice(0, 10);

      return {
        data: top10Proyectos,
        operation: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error Interno',
        operation: false,
        data: null,
      };
    }
  }

  async obtenerComentariosProyecto(idProyecto: string) {
    const proyecto = await this.projectModel
      .findById(idProyecto)
      .populate('comments');
    return proyecto ? proyecto.comments : [];
  }

  async obtenerProyecto(id: string) {
    return this.projectModel.findById(id);
  }

  async agregarLikeComentario(idComentario: string, idUsuario: string) {
    const comentario = await this.commentModel.findById(idComentario);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }
    // Verificar si el usuario ya ha dado like
    if (comentario.likes.includes(idUsuario)) {
      // Si ya ha dado like, eliminarlo
      comentario.likes = comentario.likes.filter(
        (userId) => userId !== idUsuario,
      );
    } else {
      // Si no ha dado like, agregarlo
      comentario.likes.push(idUsuario);
    }
    return comentario.save();
  }

  async contadorlikesComentario(idComentario: string) {
    const comentario = await this.commentModel.findById(idComentario);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }
    return comentario.likes.length;
  }

  async sumarVistasProyecto(idProyecto: string) {
    const proyecto = await this.projectModel.findById(idProyecto);
    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }
    // Incrementar el contador de vistas
    proyecto.vistas = (proyecto.vistas || 0) + 1;
    return proyecto.save();
  }

  async obtenerVistasProyecto(idProyecto: string) {
    const proyecto = await this.projectModel.findById(idProyecto);
    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }
    return proyecto.vistas || 0;
  }

  async agregarProyectoAFavoritos(userId: string, projectId: string) {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: projectId } },
      { new: true },
    );
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $inc: { favoritos: 1 } },
      { new: true },
    );
    return { message: 'agregado a favoritos' };
  }

  async eliminarProyectoDeFavoritos(userId: string, projectId: string) {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: projectId } },
      { new: true },
    );
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $inc: { favoritos: -1 } },
      { new: true },
    );

    // Verificar que el número de favoritos no sea menor a 0
    const proyecto = await this.projectModel.findById(projectId);
    if (proyecto && proyecto.favoritos < 0) {
      await this.projectModel.findByIdAndUpdate(
        projectId,
        { favoritos: 0 },
        { new: true },
      );
    }

    return { message: 'eliminado de favoritos' };
  }

  async obtenerProyectosFavoritos(userId: string) {
    const user = await this.userModel.findById(userId).populate({
      path: 'favorites',
      select: '_id title repositoryLink',
    });
    return user ? user.favorites : [];
  }

  async cambiarRolUsuario(userId: string, nuevoRol: string) {
    // Validar que el rol sea válido
    const rolesValidos = ['admin', 'estudiante', 'profesor'];
    if (!rolesValidos.includes(nuevoRol)) {
      throw new Error(
        'Rol no válido. Los roles permitidos son: admin, estudiante, profesor',
      );
    }

    // Buscar y actualizar el usuario
    const usuario = await this.userModel.findByIdAndUpdate(
      userId,
      {
        role: nuevoRol,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return { message: 'Rol actualizado correctamente' };
  }

  async generarResumen(id: string) {
    const proyecto = await this.obtenerProyecto(id);
    const comentarios = await this.obtenerComentariosProyecto(id);
    const contenidoComentarios = comentarios.map(
      (comentario) => comentario.content,
    );
    let mjs = '';
    if (proyecto) {
      mjs =
        'Elabora un analis sobre el siguiente proyecto: ' +
        proyecto.title +
        ' cuya descripcion es la siguiente: ' +
        proyecto.description;

      if (proyecto.tools.length > 0) {
        mjs +=
          ' Este proyecto esta realizado con las siguientes tegnologias: ' +
          proyecto.tools.join(', ');
      }

      if (contenidoComentarios.length > 0) {
        mjs +=
          ' Ademas el proyecto cuenta con las siguientes reseñas: ' +
          contenidoComentarios.join(', ');
      }

      if (proyecto.puntuacion.length > 0) {
        mjs +=
          ' Y tiene las siguientes calificaciones: ' +
          proyecto.puntuacion.join(', ');
      }
      console.log(mjs);
    }
    console.log('eduard');
    console.log(mjs);

    // Llamada a la API de Google Gemini (gratuita)
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  text: mjs,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyDNxTa2cYObgy65OHFlJNQAV_R4hS2Pl0c',
          },
          timeout: 30000,
        },
      );
      return {
        success: true,
        response: response.data.candidates[0].content.parts[0].text,
      };
    } catch (error) {
      console.error(
        'Error llamando a la IA:',
        error?.response?.data || error.message,
      );
      return {
        error: 'No se pudo obtener respuesta de la IA',
        detalle: error?.response?.data || error.message,
      };
    }
  }

  async obtenerUsuarios() {
    const usuarios = await this.userModel.find();
    return usuarios;
  }

  async eliminarUsuario(userId: string, admin: string) {
    const user = await this.getUser(admin);
    if (user && user.role == 'admin') {
      // Obtener el usuario antes de eliminarlo para verificar su rol
      const usuarioAEliminar = await this.userModel.findById(userId);
      if (!usuarioAEliminar) {
        throw new Error('Usuario no encontrado');
      }

      // Eliminar todos los proyectos donde el usuario sea autor
      const proyectosDelUsuario = await this.projectModel.find({
        authors: userId,
      });
      
      for (const proyecto of proyectosDelUsuario) {
        // Eliminar todos los comentarios del proyecto
        await this.commentModel.deleteMany({ projectID: proyecto._id });
        // Eliminar el proyecto
        await this.projectModel.findByIdAndDelete(proyecto._id);
      }

      // Eliminar todos los comentarios del usuario
      await this.commentModel.deleteMany({ authorID: userId });

      // Si el usuario es profesor, eliminar todas sus calificaciones
      if (usuarioAEliminar.role === 'profesor') {
        await this.ratingModel.deleteMany({ teacherID: userId });
      }

      // Finalmente eliminar el usuario
      const usuario = await this.userModel.findByIdAndDelete(userId);
      return usuario;
    }
    throw new Error('No tienes permisos para eliminar usuarios');
  }

  async eliminarProyecto(id: string, admin: string) {
    const user = await this.getUser(admin);
    if (user && user.role == 'admin') {
      const proyecto = await this.projectModel.findByIdAndDelete(id);
      return proyecto;
    }
    throw new Error('No tienes permisos para eliminar proyectos');
  }

  async eliminarComentario(id: string, admin: string) {
    const user = await this.getUser(admin);
    if (user && user.role == 'admin') {
      const comentario = await this.commentModel.findByIdAndDelete(id);
      if (comentario) {
        await this.projectModel.findByIdAndUpdate(comentario.projectID, {
          $pull: { comments: comentario._id },
        });
      }
      return comentario;
    }
    throw new Error('No tienes permisos para eliminar comentarios');
  }

  async evaluarProyectos(data: {
    projectID: string;
    teacherID: string;
    score: number;
    feedback: string;
  }) {
    // Verifica que el usuario sea profesor
    const profesor = await this.userModel.findById(data.teacherID);
    if (!profesor || profesor.role !== 'profesor') {
      throw new Error('Solo los profesores pueden evaluar proyectos');
    }
    // Crea la evaluación (rating)
    const nuevaEvaluacion = new this.ratingModel({
      projectID: data.projectID,
      teacherID: data.teacherID,
      score: data.score,
      feedback: data.feedback,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return nuevaEvaluacion.save();
  }

  async obtenerEvaluacionesPorProfesor(teacherID: string) {
    return this.ratingModel.find({ teacherID });
  }

  async obtenerPromedioEvaluacionesPorProyecto(projectID: string) {
    const evaluaciones = await this.ratingModel.find({ projectID });
    if (evaluaciones.length === 0) {
      return 0;
    }
    const suma = evaluaciones.reduce((acc, val) => acc + val.score, 0);
    return suma / evaluaciones.length;
  }
  async getRatingByProjectAndTeacher(
    projectID: string,
    teacherID: string,
  ): Promise<Rating | null> {
    if (!projectID || !teacherID) {
      throw new Error('ProjectID and TeacherID are required');
    }

    return this.ratingModel.findOne({ teacherID, projectID }).exec();
  }

  async eliminarProyectoAutor(id: string, userId: string) {
    const proyecto = await this.projectModel.findById(id);
    if (proyecto && proyecto.authors.includes(userId)) {
      await this.projectModel.findByIdAndDelete(id);
      return proyecto;
    }
    throw new Error('No tienes permisos para eliminar este proyecto');
  }

  async eliminarComentarioAutor(id: string, userId: string) {
    const comentario = await this.commentModel.findById(id);
    if (comentario && comentario.authorID == userId) {
      await this.commentModel.findByIdAndDelete(id);
      return comentario;
    }
    throw new Error('No tienes permisos para eliminar este comentario');
  }

  async actualizarPerfilUsuario(
    userId: string,
    profileData: {
      name?: string;
      email?: string;
      bio?: string;
      website?: string;
      github?: string;
    },
  ) {
    // Verificar que el usuario existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Preparar los datos de actualización
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Actualizar campos directos si están presentes
    if (profileData.name !== undefined) {
      updateData.name = profileData.name;
    }
    if (profileData.email !== undefined) {
      updateData.email = profileData.email;
    }
    if (profileData.bio !== undefined) {
      updateData.bio = profileData.bio;
    }

    // Preparar el array de links
    const links = [...(user.links || [])];
    
    // Si se proporciona website, agregarlo o actualizarlo en la posición 0
    if (profileData.website !== undefined) {
      if (links.length > 0) {
        links[0] = profileData.website;
      } else {
        links.push(profileData.website);
      }
    }
    
    // Si se proporciona github, agregarlo o actualizarlo en la posición 1
    if (profileData.github !== undefined) {
      if (links.length > 1) {
        links[1] = profileData.github;
      } else if (links.length === 1) {
        links.push(profileData.github);
      } else {
        links.push('', profileData.github); // Agregar espacio vacío en posición 0 si no hay website
      }
    }

    // Actualizar el array de links si hay cambios
    if (profileData.website !== undefined || profileData.github !== undefined) {
      updateData.links = links;
    }

    // Actualizar el usuario
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );

    return updatedUser;
  }

  async obtenerEvaluacionesPorProyecto(projectID: string) {
    try {
      const evaluaciones = await this.ratingModel.find({ projectID })
        .populate({
          path: 'teacherID',
          select: 'name',
          model: 'users'
        })
        .sort({ createdAt: -1 });
      
      return evaluaciones;
    } catch (error) {
      throw new Error('Error al obtener las evaluaciones del proyecto');
    }
  }

  async eliminarCuenta(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Eliminar todos los proyectos donde el usuario sea autor
    const proyectosDelUsuario = await this.projectModel.find({
      authors: userId,
    });
    
    for (const proyecto of proyectosDelUsuario) {
      // Eliminar todos los comentarios del proyecto
      await this.commentModel.deleteMany({ projectID: proyecto._id });
      // Eliminar el proyecto
      await this.projectModel.findByIdAndDelete(proyecto._id);
    }

    // Eliminar todos los comentarios del usuario
    await this.commentModel.deleteMany({ authorID: userId });

    // Si el usuario es profesor, eliminar todas sus evaluaciones
    if (user.role === 'profesor') {
      await this.ratingModel.deleteMany({ teacherID: userId });
    }

    // Eliminar todas las evaluaciones donde el usuario sea el profesor evaluador
    await this.ratingModel.deleteMany({ teacherID: userId });

    // Eliminar todas las puntuaciones del usuario en proyectos (si existe)
    await this.projectModel.updateMany(
      { puntuacion: { $exists: true } },
      { $pull: { puntuacion: { $in: [userId] } } }
    );

    // Eliminar likes del usuario en comentarios
    await this.commentModel.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    );

    // Eliminar el usuario de favoritos de otros usuarios
    await this.userModel.updateMany(
      { favorites: userId },
      { $pull: { favorites: userId } }
    );

    // Eliminar el usuario de la lista de autores en proyectos donde no sea el único autor
    await this.projectModel.updateMany(
      { authors: userId },
      { $pull: { authors: userId } }
    );

    // Finalmente eliminar el usuario
    await this.userModel.findByIdAndDelete(userId);
    return user;
  }
}
