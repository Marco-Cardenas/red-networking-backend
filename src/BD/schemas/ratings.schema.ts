import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RatingDocument = HydratedDocument<Rating>;

@Schema()
export class Rating {

  @Prop()
  projectID: string;

  @Prop()
  teacherID: string;

  @Prop()
  score: number;

  @Prop()
  feedback: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
