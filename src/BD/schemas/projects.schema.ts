import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'projects' })
export class Project {
  @Prop({required: true})
  title: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'User' }], default: [] })
  authors: string[];

  @Prop({default:Date.now})
  date: Date;

  @Prop({type:[String], default:[]})
  tags: string[];

  @Prop({default:''})
  description: string;

  @Prop({required:true})
  repositoryLink: string;

  @Prop({type:[String], default: []})
  tools: string[];

  @Prop({required:true})
  image: string;

  @Prop({default: ''})
  document: string; 

  @Prop({ type: [{ type: 'ObjectId', ref: 'comments' }], default: [] })
  comments: any[];

  @Prop({ type: [Number], default: [] })
  puntuacion: number[];

  @Prop({default: '' })
  vistas: number;

  @Prop({default: 0})
  favoritos: number;

  @Prop({default: Date.now})
  createAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
