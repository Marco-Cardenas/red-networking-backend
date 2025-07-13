import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Res,
  HttpStatus,
  Query,
  Param,
} from '@nestjs/common';
import { ProcesosService } from '../procesos/procesos.service';
import { PaginationDto } from '../dtos/paginate.dto';

@Controller('api')
export class CrudController {
  constructor(private readonly procesosService: ProcesosService) {}

  @Get('pagina_principal')
  async pagina_principal(
    @Res() respuesta,
    @Query() paginationDto: PaginationDto,
  ) {
    const data = await this.procesosService.pagina_principal(paginationDto);
    if (!data.operation) {
      return respuesta.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        proceso: false,
        message: data.message,
      });
    }
    return respuesta.status(HttpStatus.OK).json({
      data: data.data,
      proceso: true,
    });
  }

  @Post('subida_proyecto')
  async crearProyecto(@Body() body, @Res() res) {
    try {
      // Validar que imagen y documento estén en formato base64
      if (body.image && !body.image.startsWith('data:')) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'La imagen debe estar en formato base64 (data URI)',
          ok: false,
        });
      }
      if (body.document && !body.document.startsWith('data:')) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'El documento debe estar en formato base64 (data URI)',
          ok: false,
        });
      }
      const proyecto = await this.procesosService.crearProyecto(body);
      return res.status(HttpStatus.CREATED).json({ proyecto, ok: true });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: error.message, ok: false });
    }
  }

  @Get('usuario_projects/:userId')
  async obtenerProyectosPorUsuario(
    @Param('userId') userId: string,
    @Res() res,
  ) {
    try {
      const proyectos =
        await this.procesosService.obtenerProyectosPorUsuario(userId);
      return res.status(HttpStatus.OK).json({ ok: true, proyectos });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Post('projects/:id/agregar-puntuacion')
  async agregarPuntuacion(
    @Param('id') id: string,
    @Body('puntuacion') puntuacion: number,
    @Res() res,
  ) {
    if (typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        ok: false,
        error: 'La puntuación debe ser un número entre 1 y 5',
      });
    }
    try {
      const proyectoActualizado = await this.procesosService.agregarPuntuacion(
        id,
        puntuacion,
      );
      return res
        .status(HttpStatus.OK)
        .json({ ok: true, proyecto: proyectoActualizado });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('getUser/:id')
  async getUser(@Res() respuesta, @Param('id') idUser) {
    const user = await this.procesosService.getUser(idUser);
    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      user,
    });
  }

  @Get('projects/:id')
  async obtenerProyectoPorId(@Param('id') id: string, @Res() res) {
    try {
      const proyecto = await this.procesosService.obtenerProyecto(id);
      if (!proyecto) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ ok: false, error: 'Proyecto no encontrado' });
      }
      return res.status(HttpStatus.OK).json({ ok: true, proyecto });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('projects/:id/promedio-puntuacion')
  async promedioPuntuacion(@Param('id') id: string, @Res() res) {
    try {
      const promedio = await this.procesosService.obtenerPromedioPuntuacion(id);
      if (promedio === null) {
        return res.status(HttpStatus.NOT_FOUND).json({
          ok: false,
          message: 'No hay puntuaciones para este proyecto',
        });
      }
      return res.status(HttpStatus.OK).json({ ok: true, promedio });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Post('projects/:id/agregar-comentario')
  async agregarComentario(@Param('id') id: string, @Body() body, @Res() res) {
    try {
      const comentario = await this.procesosService.agregarComentario(id, body);
      return res.status(HttpStatus.OK).json({ ok: true, comentario });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('ranking')
  async ranking(@Res() respuesta) {
    const data = await this.procesosService.ranking();
    if (!data.operation) {
      return respuesta.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        proceso: false,
        message: data.message,
      });
    }
    return respuesta.status(HttpStatus.OK).json({
      data: data.data,
      proceso: true,
    });
  }

  @Get('projects/:id/comentarios')
  async obtenerComentariosProyecto(@Param('id') id: string, @Res() res) {
    try {
      const comentarios =
        await this.procesosService.obtenerComentariosProyecto(id);
      return res.status(HttpStatus.OK).json({ ok: true, comentarios });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Post('projects/comentarios/:commentId/like')
  async likeComentario(
    @Param('commentId') commentId: string,
    @Body('userId') userId: string,
    @Res() res,
  ) {
    try {
      const resultado = await this.procesosService.agregarLikeComentario(
        commentId,
        userId,
      );
      return res.status(HttpStatus.OK).json({ ok: true, resultado });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('projects/comentarios/:commentId/likes/count')
  async contadorLikesComentario(
    @Param('commentId') commentId: string,
    @Res() res,
  ) {
    try {
      const contador =
        await this.procesosService.contadorlikesComentario(commentId);
      return res.status(HttpStatus.OK).json({ ok: true, contador });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Post('projects/:idProyecto/sumar-vistas')
  async sumarVistasProyecto(
    @Param('idProyecto') idProyecto: string,
    @Res() res,
  ) {
    try {
      const proyectoActualizado =
        await this.procesosService.sumarVistasProyecto(idProyecto);
      return res
        .status(HttpStatus.OK)
        .json({ ok: true, proyecto: proyectoActualizado });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('projects/:idProyecto/vistas')
  async obtenerVistasProyecto(
    @Param('idProyecto') idProyecto: string,
    @Res() res,
  ) {
    try {
      const vistas =
        await this.procesosService.obtenerVistasProyecto(idProyecto);
      return res.status(HttpStatus.OK).json({ ok: true, vistas });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Post('users/:userId/favorites/:projectId')
  async agregarProyectoAFavoritos(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Res() res,
  ) {
    try {
      const user = await this.procesosService.agregarProyectoAFavoritos(
        userId,
        projectId,
      );
      return res.status(HttpStatus.OK).json({ ok: true, user });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Delete('users/:userId/favorites/:projectId')
  async eliminarProyectoDeFavoritos(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Res() res,
  ) {
    try {
      const user = await this.procesosService.eliminarProyectoDeFavoritos(
        userId,
        projectId,
      );
      return res.status(HttpStatus.OK).json({ ok: true, user });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('users/:userId/favorites')
  async obtenerProyectosFavoritos(@Param('userId') userId: string, @Res() res) {
    try {
      const favoritos =
        await this.procesosService.obtenerProyectosFavoritos(userId);
      return res.status(HttpStatus.OK).json({ ok: true, favoritos });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Post('users/:userId/cambiar-rol')
  async cambiarRolUsuario(
    @Param('userId') userId: string,
    @Body('rol') nuevoRol: string,
    @Res() res,
  ) {
    try {
      if (!nuevoRol) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          ok: false,
          error: 'El campo "rol" es requerido',
        });
      }

      const resultado = await this.procesosService.cambiarRolUsuario(
        userId,
        nuevoRol,
      );
      return res.status(HttpStatus.OK).json({
        ok: true,
        message: resultado.message + ' ' + nuevoRol,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('resumen-ia/:id')
  async generateResumen(@Param('id') id: string, @Res() res) {
    try {
      const resumen = await this.procesosService.generarResumen(id);
      return res.status(HttpStatus.OK).json({ ok: true, resumen });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('users')
  async obtenerUsuarios(@Res() res) {
    try {
      const usuarios = await this.procesosService.obtenerUsuarios();
      return res.status(HttpStatus.OK).json({ ok: true, usuarios });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Delete('user/:userId/:admin')
  async eliminarUsuario(
    @Param('userId') userId: string,
    @Param('admin') admin: string,
    @Res() res,
  ) {
    try {
      const usuario = await this.procesosService.eliminarUsuario(userId, admin);
      return res.status(HttpStatus.OK).json({ ok: true, usuario });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Delete('project/:id/:admin')
  async eliminarProyecto(
    @Param('id') id: string,
    @Param('admin') admin: string,
    @Res() res,
  ) {
    try {
      const proyecto = await this.procesosService.eliminarProyecto(id, admin);
      return res.status(HttpStatus.OK).json({ ok: true, proyecto });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Delete('comment/:id/:admin')
  async eliminarComentario(
    @Param('id') id: string,
    @Param('admin') admin: string,
    @Res() res,
  ) {
    try {
      const comentario = await this.procesosService.eliminarComentario(
        id,
        admin,
      );
      return res.status(HttpStatus.OK).json({ ok: true, comentario });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Post('projects/evaluacion')
  async evaluarProyecto(@Body() body, @Res() res) {
    try {
      const evaluacion = await this.procesosService.evaluarProyectos(body);
      return res.status(201).json({ ok: true, evaluacion });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  }

  @Get('projects/evaluacion/:teacherID')
  async obtenerEvaluacionesPorProfesor(
    @Param('teacherID') teacherID: string,
    @Res() res,
  ) {
    try {
      const evaluaciones =
        await this.procesosService.obtenerEvaluacionesPorProfesor(teacherID);
      return res.status(HttpStatus.OK).json({ ok: true, evaluaciones });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('projects/evaluacion/promedio/:projectID')
  async obtenerPromedioEvaluacionesPorProyecto(
    @Param('projectID') projectID: string,
    @Res() res,
  ) {
    try {
      const promedio =
        await this.procesosService.obtenerPromedioEvaluacionesPorProyecto(
          projectID,
        );
      return res.status(HttpStatus.OK).json({ ok: true, promedio });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Get('project/:projectID/teacher/:teacherID')
  async getRatingByProjectAndTeacher(
    @Param('projectID') projectID: string,
    @Param('teacherID') teacherID: string,
    @Res() res,
  ) {
    try {
      const rating = await this.procesosService.getRatingByProjectAndTeacher(
        projectID,
        teacherID,
      );
      return res.status(HttpStatus.OK).json({ ok: true, rating });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Delete('project-autor/:id/:userId')
  async eliminarProyectoAutor(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Res() res,
  ) {
    try {
      const proyecto = await this.procesosService.eliminarProyectoAutor(
        id,
        userId,
      );
      return res.status(HttpStatus.OK).json({ ok: true, proyecto });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }

  @Delete('comment-autor/:id/:userId')
  async eliminarComentarioAutor(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Res() res,
  ) {
    try {
      const comentario = await this.procesosService.eliminarComentarioAutor(
        id,
        userId,
      );
      return res.status(HttpStatus.OK).json({ ok: true, comentario });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ ok: false, error: error.message });
    }
  }
}
