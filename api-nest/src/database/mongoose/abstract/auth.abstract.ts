export abstract class AuthAbstract {
    abstract validateUser(username: string, password: string): Promise<any>;
    abstract registerUser(userData: any): Promise<any>;
    abstract findUserById(userId: string): Promise<any>;
    abstract findUserByUsername(username: string): Promise<any>;
    abstract updateUserPassword(userId: string, newPassword: string): Promise<any>;
    abstract deleteUser(userId: string): Promise<any>;
    // Implement methods for authentication using MongoDB
}
