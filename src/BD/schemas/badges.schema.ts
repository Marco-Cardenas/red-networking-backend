import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BadgeDocument = HydratedDocument<Badge>;

@Schema()
export class Badge {

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  icon: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
