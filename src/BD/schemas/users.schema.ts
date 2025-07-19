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

  @Prop({default: 'estudiante'})
  role: string;


  @Prop({ type: [{ type: 'ObjectId', ref: 'projects' }], default: [] })
  favorites: string[];

  @Prop({type:[String], default: ''})
  links: string[];

  @Prop({type:[String], default: ''})
  badges: string[];

  @Prop({default: Date.now})
  createdAt: Date;

  @Prop({default: Date.now})
  updatedAt: Date;

  @Prop({
    type: String,
    index: true,
    default: ''})
  remember_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
