import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class User extends Document {
    declare _id: Types.ObjectId;
    
    @Prop({
        index:true
    })
    name: string;
    @Prop({
        unique: true,
        index:true
    })
    email: string;
    @Prop()
    password: string;
    @Prop({
        default: true
    })
    isActive: boolean;
    @Prop({
        default: 'user'
    })
    role: string;
    @Prop({
        unique: true,
        index:true
    })
    identification: string;
    @Prop(
        {
            default: null
        }
    )
    email_verified_at: string;
    @Prop(
        {
            type: String,
            index:true,
            default: null
        }
    )
    remember_token: string | null;
    @Prop({
        default: false
    })
    isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hook para operaciones de guardado
UserSchema.pre('save', function(next) {
    if (this.email) {
        this.email = this.email.toLowerCase().trim();
    }
    next();
});

// Hook para operaciones de actualización
UserSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate() as any;
    if (update.email) {
        update.email = update.email.toLowerCase().trim();
    }
    next();
});


