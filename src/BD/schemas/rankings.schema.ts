import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RankingDocument = HydratedDocument<Ranking>;

@Schema()
export class Ranking {

  @Prop({default:''})
  userID: string;

  @Prop({default:''})
  averageScore: number;
  
  @Prop({default:Date.now})
  createdAt: Date;

  @Prop({default:Date.now})
  updatedAt: Date;

}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
