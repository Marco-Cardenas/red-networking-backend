import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'projects' })
export class Project {
  @Prop()
  title: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'User' }], default: [] })
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

  @Prop({ type: [{ type: 'ObjectId', ref: 'Comment' }], default: [] })
  comments: any[];

  @Prop({ type: [Number], default: [] })
  puntuacion: number[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
