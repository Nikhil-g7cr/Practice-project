import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true })
  token: string;

  @Prop({ required: false })
  refreshToken: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date })
  revokedAt?: Date;

  @Prop({ required: false })
  revokeReason?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Create compound index for userId and isActive for faster queries
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ token: 1, isActive: 1 });
