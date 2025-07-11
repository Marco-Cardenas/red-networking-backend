import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BadgeDocument = HydratedDocument<Badge>;

@Schema()
export class Badge {

  @Prop({default:''})
  title: string;

  @Prop({default:''})
  description: string;

  @Prop({default:''})
  icon: string;

  @Prop({default:Date.now})
  createdAt: Date;

  @Prop({default:Date.now})
  updatedAt: Date;

}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
