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

  async obtenerProyecto(id: string) {
    return this.projectModel.findById(id);
  }
}
