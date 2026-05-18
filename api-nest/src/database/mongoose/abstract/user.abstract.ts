export abstract class UserAbstractDao {
  abstract findUserById(userId: string): Promise<any>;
  abstract findUserByUsername(username: string): Promise<any>;
  abstract createUser(userData: any): Promise<any>;
  abstract updateUser(userId: string, updateData: any): Promise<any>;
  abstract deleteUser(userId: string): Promise<any>;
  // Implement methods for user management using MongoDB
}
