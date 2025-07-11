import { Injectable } from '@nestjs/common';

@Injectable()
export class CrudService {
  async pagina_principal():Promise<string> {
    return "Pagina Principal";
  }
  
}
