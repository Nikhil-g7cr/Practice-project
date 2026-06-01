import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserDao } from '../../database/mongoose/dao/users.dao';

@Injectable()
export class UserService {
  constructor(private userDao: UserDao) {}

  async create(createUserDto: CreateUserDto) {
    return this.userDao.create(createUserDto);
  }

  async findAll(page: number = 1, limit: number = 10, role?: string) {
    return this.userDao.findAll(page, limit, role);
  }

  async findOne(id: string) {
    return this.userDao.findById(id);
  }

  async findbyEmail(email: string) {
    return this.userDao.findByEmail(email);
  }

  async createMicrosoftUser(data: {
    name: string;
    email: string;
    microsoftOid: string;
    microsoftTenantId: string;
    imageUrl?: string;
  }) {
    return this.userDao.createMicrosoftUser(data);
  }

  async findByMicrosoftIdentity(
    microsoftOid: string,
    microsoftTenantId: string,
  ) {
    return this.userDao.findByMicrosoftIdentity(
      microsoftOid,
      microsoftTenantId,
    );
  }

  async linkMicrosoftIdentity(
    id: string,
    data: {
      name: string;
      microsoftOid: string;
      microsoftTenantId: string;
      imageUrl?: string;
    },
  ) {
    return this.userDao.linkMicrosoftIdentity(id, data);
  }

  async findByRole(role: string) {
    return this.userDao.findByRole(role);
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>) {
    return this.userDao.update(id, updateUserDto);
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this.userDao.updatePassword(id, hashedPassword);
  }

  async updateRole(id: string, role: string) {
    return this.userDao.updateRole(id, role);
  }

  async remove(id: string) {
    return this.userDao.delete(id);
  }

  async exists(id: string) {
    return this.userDao.exists(id);
  }

  async search(searchTerm: string, limit?: number) {
    return this.userDao.search(searchTerm, limit);
  }

  async count(role?: string) {
    return this.userDao.count(role);
  }

  async findWithFilters(page?: number, limit?: number, filters?: any) {
    return this.userDao.findWithFilters(page, limit, filters);
  }

  async bulkUpdate(ids: string[], updateData: Partial<CreateUserDto>) {
    return this.userDao.bulkUpdate(ids, updateData);
  }

  async bulkDelete(ids: string[]) {
    return this.userDao.bulkDelete(ids);
  }
}
