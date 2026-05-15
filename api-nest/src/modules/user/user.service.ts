import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await new this.UserModel(createUserDto);
    return user.save();
  }

  async findAll() {
    const users = await this.UserModel.find();
    return users;
  }

  async findOne(id: string) {
    const User = await this.UserModel.findById(id);
    if (!User) {
      throw new NotFoundException('User is not found');
    }
    return User;
  }

  async findbyEmail(email: string) {
    const user = await this.UserModel
      .findOne({ email });
    return user;
  }

  async update(id: string, createUSerDto: CreateUserDto) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const updatedUser = await this.UserModel.findByIdAndUpdate(
      id,
      createUSerDto,
    );

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const removedUser = await this.UserModel.findByIdAndDelete(id);

    return removedUser;
  }
}
