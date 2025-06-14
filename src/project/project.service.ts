import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  async create(createProjectDto: CreateProjectDto): Promise<CreateProjectDto> {
    
    return createProjectDto;
  }
}
