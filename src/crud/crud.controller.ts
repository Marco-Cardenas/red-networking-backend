import { Controller, Post, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { ProcesosService } from '../procesos/procesos.service';

@Controller('api')
export class CrudController {
  constructor(private readonly procesosService: ProcesosService) {}

  @Get('pagina_principal')
  async pagina_principal(@Res() respuesta) {
    const datosJSON = await this.procesosService.pagina_principal();

    return respuesta.status(HttpStatus.OK).json({
      DatosJSON: datosJSON,
      proceso: true
    });
  }
}
