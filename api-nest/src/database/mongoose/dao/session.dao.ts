import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../schemas/session.schema';
import { Types } from 'mongoose';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: Model<Session>,
  ) {}

  async createSession(
    userId: string,
    token: string,
    refreshToken: string,
    userAgent: string,
    ipAddress: string,
    expiresAt: Date,
  ) {
    const session = new this.sessionModel({
      userId: new Types.ObjectId(userId),
      token,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
      isActive: true,
    });

    return session.save();
  }

  async findActiveSession(token: string) {
    const session = await this.sessionModel.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    return session;
  }

  async findActiveSessionByUserId(userId: string) {
    const sessions = await this.sessionModel.find({
      userId: new Types.ObjectId(userId),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    return sessions;
  }

  async revokeSession(token: string, reason?: string) {
    const session = await this.sessionModel.findOneAndUpdate(
      { token },
      {
        isActive: false,
        revokedAt: new Date(),
        revokeReason: reason || 'User logout',
      },
      { new: true },
    );

    return session;
  }

  async revokeAllUserSessions(userId: string, reason?: string) {
    const result = await this.sessionModel.updateMany(
      { userId: new Types.ObjectId(userId), isActive: true },
      {
        isActive: false,
        revokedAt: new Date(),
        revokeReason: reason || 'All sessions revoked',
      },
    );

    return result;
  }

  async validateSessionToken(token: string): Promise<Session | null> {
    const session = await this.sessionModel.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return null;
    }

    return session;
  }

  async refreshSession(
    refreshToken: string,
    newToken: string,
    newRefreshToken: string,
    expiresAt: Date,
  ) {
    const session = await this.sessionModel.findOneAndUpdate(
      { refreshToken, isActive: true },
      {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt,
      },
      { new: true },
    );

    return session;
  }

  async cleanupExpiredSessions() {
    const result = await this.sessionModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return result;
  }
}
