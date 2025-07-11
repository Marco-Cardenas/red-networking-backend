import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({default: ''})
  name: string;

  @Prop({default: ''})
  email: string;

  @Prop({default: ''})
  password: string;

  @Prop({default: ''})
  fotoPerfil: string;

  @Prop({default: ''})
  bio: string;

  @Prop({default: ''})
  university: string;

  @Prop({default: ''})
  career: string;

  @Prop({default: ''})
  role: string;

  @Prop({type:[String], default: ''})
  links: string[];

  @Prop({type:[String], default: ''})
  badges: string[];

  @Prop({default: Date.now})
  createdAt: Date;

  @Prop({default: Date.now})
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
