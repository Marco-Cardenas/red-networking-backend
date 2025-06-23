import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop()
  title: string;

  @Prop()
  email: string;

  @Prop()
  description: string;

  @Prop([String])
  technologies: string[];

  @Prop()
  subject: string;

  @Prop()
  type: string;

  @Prop([String])
  authors: string[];

  @Prop([String])
  files: string[];

  @Prop([String])
  tags: string[];

  @Prop()
  averageRating: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
