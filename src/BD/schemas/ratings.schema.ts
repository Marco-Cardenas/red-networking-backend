import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RatingDocument = HydratedDocument<Rating>;

@Schema()
export class Rating {

  @Prop({default:''})
  projectID: string;

  @Prop({default:''})
  teacherID: string;

  @Prop({default:''})
  score: number;

  @Prop({default:''})
  feedback: string;

  @Prop({default:Date.now})
  createdAt: Date;

  @Prop({default:Date.now})
  updatedAt: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
