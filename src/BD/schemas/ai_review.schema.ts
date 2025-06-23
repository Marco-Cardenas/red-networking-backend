import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AIReviewDocument = HydratedDocument<AIReview>;

@Schema()
export class AIReview {

  @Prop({default:''})
  projectID: string;

  @Prop({default:''})
  content: string;
  
  @Prop({default:Date.now})
  createdAt: Date;

  @Prop({default:Date.now})
  updatedAt: Date;

}

export const AIReviewSchema = SchemaFactory.createForClass(AIReview);
