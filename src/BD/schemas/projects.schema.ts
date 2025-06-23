import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'projects' })
export class Project {
  @Prop()
  title: string;

  @Prop([String])
  authors: string[];

  @Prop()
  date: Date;

  @Prop([String])
  tags: string[];

  @Prop()
  description: string;

  @Prop()
  repositoryLink: string;

  @Prop([String])
  tools: string[];

  @Prop()
  image: string;

  @Prop()
  document: string; 
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
