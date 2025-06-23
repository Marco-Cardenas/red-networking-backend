import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AIReviewDocument = HydratedDocument<AIReview>;

@Schema()
export class AIReview {

  @Prop()
  projectID: string;

  @Prop()
  content: string;
  
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

}

export const AIReviewSchema = SchemaFactory.createForClass(AIReview);
