import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({default:''})
  title: string;

  @Prop({default:''})
  email: string;

  @Prop({default:''})
  description: string;

  @Prop({typo: [String], default:''})
  technologies: string[];

  @Prop({default:''})
  subject: string;

  @Prop({default:''})
  type: string;

  @Prop({typo: [String], default:''})
  authors: string[];

  @Prop({typo: [String], default:''})
  files: string[];

  @Prop({typo: [String], default:''})
  tags: string[];

  @Prop({default:0})
  averageRating: number;

  @Prop({default:Date.now})
  createdAt: Date;

  @Prop({default:Date.now})
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
