import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcesosService {
  async pagina_principal() {
    return "Hola desde procesos";
  }
}
