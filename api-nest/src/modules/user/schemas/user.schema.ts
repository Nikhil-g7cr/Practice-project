import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ trim: true })
  password?: string;

  @Prop({ default: 'local', enum: ['local', 'microsoft'] })
  authProvider: string;

  @Prop({ trim: true, sparse: true })
  microsoftOid?: string;

  @Prop({ trim: true })
  microsoftTenantId?: string;

  @Prop({ required: false })
  image_url?: string;

  @Prop({
    default: 'user',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index(
  { authProvider: 1, microsoftOid: 1, microsoftTenantId: 1 },
  { sparse: true },
);
