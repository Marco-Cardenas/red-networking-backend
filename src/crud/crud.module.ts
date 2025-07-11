import { Module } from '@nestjs/common';
import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';
import { ProcesosModule } from '../procesos/procesos.module';

@Module({
  imports: [ProcesosModule],
  controllers: [CrudController],
  providers: [CrudService]
})
export class CrudModule {}
