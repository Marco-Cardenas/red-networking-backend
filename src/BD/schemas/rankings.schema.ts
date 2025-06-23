import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RankingDocument = HydratedDocument<Ranking>;

@Schema()
export class Ranking {

  @Prop()
  userID: string;

  @Prop()
  averageScore: number;
  
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
