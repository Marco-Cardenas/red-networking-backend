import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const created = await this.projectService.create(createProjectDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Proyecto creado exitosamente',
      data: created,
    };
  }
}
