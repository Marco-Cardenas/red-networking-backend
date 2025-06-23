import { Controller, Post, Get, Body, Res, HttpStatus, Query } from '@nestjs/common';
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

}
