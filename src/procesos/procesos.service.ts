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

@Injectable()
export class ProcesosService {
  constructor(
    @InjectModel('users') private readonly userModel: Model<User>,
    @InjectModel('ratings') private readonly ratingModel: Model<Rating>,
    @InjectModel('rankings') private readonly rankingModel: Model<Ranking>,
    @InjectModel('projects') private readonly projectModel: Model<Project>,
    @InjectModel('comments') private readonly commentModel: Model<Comment>,
    @InjectModel('badges') private readonly badgeModel: Model<Badge>,
    @InjectModel('aireviews') private readonly aiReviewModel: Model<AIReview>

  ) { }
  async pagina_principal(paginationDto: PaginationDto) {
    try {
      const { limit, page, search } = paginationDto;
      const baseUrl = 'https://red-networking-backend.vercel.app/api/pagina_principal';
      const totalPages = await this.projectModel.countDocuments();
      const next_page_url = `${baseUrl}?page=${page + 1}`;
      const prev = page - 1;
      const prev_page_url = `${baseUrl}?page=${prev < 1 ? null : prev}`;

      return {
        data: {
          data: await this.projectModel.find()
            .skip((page - 1) * limit)
            .limit(limit),
          total: totalPages,
          current_page: page,
          last_page: Math.ceil(totalPages / limit),
          next_page_url,
          prev_page_url
        },
        operation: true
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error Interno',
        operation: false,
        data: null
      }
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
      { new: true }
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

    await this.projectModel.findByIdAndUpdate(
      idProyecto,
      { $push: { comments: nuevoComentario._id } }
    );
    return nuevoComentario;
  }

  async obtenerProyectosPorUsuario(userId: string) {
    return this.projectModel.find(
      { authors: userId },
      { _id: 1, title: 1, repositoryLink: 1 }
    );
  }

  async ranking() {
    try {
      // Obtener todos los proyectos con sus puntuaciones
      const proyectos = await this.projectModel.find();
      // Calcular la suma de puntuaciones para cada proyecto y ordenar
      const proyectosConPuntuacion = proyectos.map(proyecto => {
        const sumaPuntuacion = proyecto.puntuacion && proyecto.puntuacion.length > 0 
          ? proyecto.puntuacion.reduce((acc, val) => acc + val, 0) 
          : 0;
        
        return {
          ...proyecto.toObject(),
          sumaPuntuacion
        };
      });

      // Ordenar de mayor a menor puntuación y tomar solo los primeros 10
      const top10Proyectos = proyectosConPuntuacion
        .sort((a, b) => b.sumaPuntuacion - a.sumaPuntuacion)
        .slice(0, 10);

      return {
        data: top10Proyectos,
        operation: true
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error Interno',
        operation: false,
        data: null
      }
    }
  }

  async obtenerComentariosProyecto(idProyecto: string) {
    const proyecto = await this.projectModel.findById(idProyecto).populate('comments');
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
      comentario.likes = comentario.likes.filter(userId => userId !== idUsuario);
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
      { new: true }
    );
    return { message: 'agregado a favoritos' };
  }

  async eliminarProyectoDeFavoritos(userId: string, projectId: string) {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: projectId } },
      { new: true }
    );
    return { message: 'eliminado de favoritos' };
  }

  async obtenerProyectosFavoritos(userId: string) {
    const user = await this.userModel.findById(userId).populate({
      path: 'favorites',
      select: '_id title repositoryLink'
    });
    return user ? user.favorites : [];
  }

  async cambiarRolUsuario(userId: string, nuevoRol: string) {
    // Validar que el rol sea válido
    const rolesValidos = ['admin', 'estudiante', 'profesor'];
    if (!rolesValidos.includes(nuevoRol)) {
      throw new Error('Rol no válido. Los roles permitidos son: admin, estudiante, profesor');
    }

    // Buscar y actualizar el usuario
    const usuario = await this.userModel.findByIdAndUpdate(
      userId,
      { 
        role: nuevoRol,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return { message: 'Rol actualizado correctamente' };
  }

}
