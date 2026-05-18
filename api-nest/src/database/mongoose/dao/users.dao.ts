import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../../../modules/user/dto/create-user.dto';

@Injectable()
export class UserDao {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Find all users (with optional pagination)
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    role?: string,
  ): Promise<{ users: User[]; total: number; pages: number }> {
    const query: any = {};

    if (role) {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.userModel.countDocuments(query),
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find user by email (includes password for auth)
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user || null;
  }

  /**
   * Find user by email (without password)
   */
  async findByEmailPublic(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).select('-password');
    return user || null;
  }

  /**
   * Find user by role
   */
  async findByRole(role: string): Promise<User[]> {
    const users = await this.userModel
      .find({ role })
      .select('-password')
      .sort({ createdAt: -1 });

    return users;
  }

  /**
   * Update user
   */
  async update(id: string, updateData: Partial<CreateUserDto>): Promise<User> {
    // Don't allow email update through this method if it creates duplicates
    if (updateData.email) {
      const existingUser = await this.userModel.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user password (without returning password)
   */
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user role
   */
  async updateRole(id: string, role: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Check if user exists
   */
  async exists(id: string): Promise<boolean> {
    const user = await this.userModel.findById(id);
    return !!user;
  }

  /**
   * Search users by name or email
   */
  async search(searchTerm: string, limit: number = 10): Promise<User[]> {
    const users = await this.userModel
      .find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
        ],
      })
      .select('-password')
      .limit(limit)
      .sort({ createdAt: -1 });

    return users;
  }

  /**
   * Get user count
   */
  async count(role?: string): Promise<number> {
    const query: any = {};

    if (role) {
      query.role = role;
    }

    return await this.userModel.countDocuments(query);
  }

  /**
   * Get users with pagination and filtering
   */
  async findWithFilters(
    page: number = 1,
    limit: number = 10,
    filters: {
      role?: string;
      search?: string;
      sortBy?: string;
      order?: 'asc' | 'desc';
    } = {},
  ): Promise<{ users: User[]; total: number; pages: number }> {
    const query: any = {};

    if (filters.role) {
      query.role = filters.role;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = filters.order === 'asc' ? 1 : -1;
    const sortField = filters.sortBy || 'createdAt';

    const sort: any = {};
    sort[sortField] = sortOrder;

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort(sort),
      this.userModel.countDocuments(query),
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Bulk update users
   */
  async bulkUpdate(ids: string[], updateData: Partial<CreateUserDto>) {
    const result = await this.userModel.updateMany(
      { _id: { $in: ids } },
      updateData,
      { runValidators: false },
    );

    return result;
  }

  /**
   * Bulk delete users
   */
  async bulkDelete(ids: string[]) {
    const result = await this.userModel.deleteMany({
      _id: { $in: ids },
    });

    return result;
  }

  /**
   * Get user with populated data (if there were references)
   */
  async findByIdPopulated(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
