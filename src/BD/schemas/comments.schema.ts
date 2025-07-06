import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {

  @Prop({default:''})
  projectID: string;

  @Prop({default:''})
  authorID: string;

  @Prop({default:''})
  content: string;

  @Prop({default:Date.now})
  createdAt: Date;

  @Prop({default:Date.now})
  updatedAt: Date;

  @Prop({ default: [] })
  likes: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
