import { Module } from '@nestjs/common';
import { ProcesosService } from './procesos.service';

@Module({
  providers: [ProcesosService],
  exports: [ProcesosService]
})
export class ProcesosModule {}
