import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true, trim: true })
  _id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({
    default: 'user',
  })
  role: string;

  @Prop({ required: false })
  image_url?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
