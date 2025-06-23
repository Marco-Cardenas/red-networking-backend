import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  fotoPerfil: string;

  @Prop()
  bio: string;

  @Prop()
  university: string;

  @Prop()
  career: string;

  @Prop()
  role: string;

  @Prop([String])
  links: string[];

  @Prop([String])
  badges: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
