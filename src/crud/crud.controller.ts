import { Controller, Post, Get, Body, Res, HttpStatus, Query, Param } from '@nestjs/common';
import { ProcesosService } from '../procesos/procesos.service';
import { PaginationDto } from '../dtos/paginate.dto';

@Controller('api')
export class CrudController {
  constructor(private readonly procesosService: ProcesosService) {}

  @Get('pagina_principal')
  async pagina_principal(@Res() respuesta, @Query() paginationDto: PaginationDto) {
    const data = await this.procesosService.pagina_principal(paginationDto);
    if(!data.operation){
      return respuesta.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        proceso: false,
        message: data.message
      });
    }
    return respuesta.status(HttpStatus.OK).json({
      data: data.data,
      proceso: true
    });
  }

  @Post('subida_proyecto')
  async crearProyecto(@Body() body, @Res() res) {
    try {
      // Validar que imagen y documento estén en formato base64
      if (body.image && !body.image.startsWith('data:')) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'La imagen debe estar en formato base64 (data URI)', ok: false });
      }
      if (body.document && !body.document.startsWith('data:')) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'El documento debe estar en formato base64 (data URI)', ok: false });
      }
      const proyecto = await this.procesosService.crearProyecto(body);
      return res.status(HttpStatus.CREATED).json({ proyecto, ok: true });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message, ok: false });
    }
  }

  @Get('usuario_projects/:userId')
  async obtenerProyectosPorUsuario(
    @Param('userId') userId: string,
    @Res() res
  ) {
    try {
      const proyectos = await this.procesosService.obtenerProyectosPorUsuario(userId);
      return res.status(HttpStatus.OK).json({ ok: true, proyectos });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, error: error.message });
    }
  }

  @Post('projects/:id/agregar-puntuacion')
  async agregarPuntuacion(
    @Param('id') id: string,
    @Body('puntuacion') puntuacion: number,
    @Res() res
  ) {
    if (typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5) {
        return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, error: 'La puntuación debe ser un número entre 1 y 5' });
    }
    try {
      const proyectoActualizado = await this.procesosService.agregarPuntuacion(id, puntuacion);
      return res.status(HttpStatus.OK).json({ ok: true, proyecto: proyectoActualizado });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, error: error.message });
    }
  }

  @Get('getUser/:id')
  async getUser(@Res() respuesta, @Param('id') idUser) {
    const user = await this.procesosService.getUser(idUser);
    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      user
    });
  }

  @Get('projects/:id/promedio-puntuacion')
  async promedioPuntuacion(@Param('id') id: string, @Res() res) {
    try {
      const promedio = await this.procesosService.obtenerPromedioPuntuacion(id);
      if (promedio === null) {
        return res.status(HttpStatus.NOT_FOUND).json({ ok: false, message: 'No hay puntuaciones para este proyecto' });
      }
      return res.status(HttpStatus.OK).json({ ok: true, promedio });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, error: error.message });
    }
  }

  @Post('projects/:id/agregar-comentario')
  async agregarComentario(
    @Param('id') id: string,
    @Body() body,
    @Res() res
  ) {
    try {
      const comentario = await this.procesosService.agregarComentario(id, body);
      return res.status(HttpStatus.OK).json({ ok: true, comentario });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, error: error.message });
    }
  }

  @Get('ranking')
  async ranking(@Res() respuesta) {
    const data = await this.procesosService.ranking();
    if(!data.operation){
      return respuesta.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        proceso: false,
       message: data.message
      });
    }
    return respuesta.status(HttpStatus.OK).json({
      data: data.data,
      proceso: true
    });
  }

  @Get('projects/:id/comentarios')
  async obtenerComentariosProyecto(
    @Param('id') id: string,
    @Res() res
  ) {
    try {
      const comentarios = await this.procesosService.obtenerComentariosProyecto(id);
      return res.status(HttpStatus.OK).json({ ok: true, comentarios });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, error: error.message });
    }
  }

  async obtenerProyecto(id: string) {
    return this.projectModel.findById(id);
  }
}
