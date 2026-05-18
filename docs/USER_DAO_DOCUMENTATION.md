# User DAO Documentation

## Overview

The `UserDao` (Data Access Object) class handles all database operations for the `User` entity. It provides a clean abstraction layer between the service layer and MongoDB, following the DAO pattern for better separation of concerns.

---

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete
- ✅ **Search & Filter**: Advanced filtering with pagination
- ✅ **Validation**: Duplicate email checking
- ✅ **Error Handling**: Proper exceptions and error messages
- ✅ **Password Security**: Separate password handling
- ✅ **Role Management**: Role-based operations
- ✅ **Bulk Operations**: Update and delete multiple users
- ✅ **Pagination**: Built-in pagination support

---

## Methods

### 1. **create(createUserDto)**
Creates a new user in the database.

**Parameters:**
- `createUserDto: CreateUserDto` - User data to create

**Returns:**
- `Promise<User>` - Created user object

**Throws:**
- `ConflictException` - If email already exists

**Example:**
```typescript
const newUser = await userDao.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword123',
  role: 'user'
});
```

---

### 2. **findAll(page, limit, role)**
Find all users with optional pagination and role filtering.

**Parameters:**
- `page: number` (default: 1) - Page number
- `limit: number` (default: 10) - Users per page
- `role?: string` - Optional role filter

**Returns:**
```typescript
{
  users: User[],
  total: number,
  pages: number
}
```

**Example:**
```typescript
const result = await userDao.findAll(1, 20, 'admin');
// Returns first 20 admin users with pagination info
```

---

### 3. **findById(id)**
Find a user by ID (without password).

**Parameters:**
- `id: string` - User ID

**Returns:**
- `Promise<User>` - User object (without password)

**Throws:**
- `NotFoundException` - If user not found

**Example:**
```typescript
const user = await userDao.findById('60d5ec49c1234567890abcde');
```

---

### 4. **findByEmail(email)**
Find user by email (with password, for authentication).

**Parameters:**
- `email: string` - User email

**Returns:**
- `Promise<User | null>` - User with password or null

**Example:**
```typescript
const user = await userDao.findByEmail('john@example.com');
// Returns user with password hash for auth comparison
```

---

### 5. **findByEmailPublic(email)**
Find user by email (without password).

**Parameters:**
- `email: string` - User email

**Returns:**
- `Promise<User | null>` - User without password or null

**Example:**
```typescript
const user = await userDao.findByEmailPublic('john@example.com');
// Safe to return to frontend
```

---

### 6. **findByRole(role)**
Find all users with a specific role.

**Parameters:**
- `role: string` - Role name

**Returns:**
- `Promise<User[]>` - Array of users with role

**Example:**
```typescript
const admins = await userDao.findByRole('admin');
```

---

### 7. **update(id, updateData)**
Update user information (except password).

**Parameters:**
- `id: string` - User ID
- `updateData: Partial<CreateUserDto>` - Fields to update

**Returns:**
- `Promise<User>` - Updated user

**Throws:**
- `NotFoundException` - If user not found
- `ConflictException` - If email already exists

**Example:**
```typescript
const updated = await userDao.update('60d5ec49c1234567890abcde', {
  name: 'Jane Doe'
});
```

---

### 8. **updatePassword(id, hashedPassword)**
Update user password (separate method for security).

**Parameters:**
- `id: string` - User ID
- `hashedPassword: string` - Pre-hashed password

**Returns:**
- `Promise<User>` - Updated user (without password)

**Example:**
```typescript
const hashed = await bcrypt.hash('newPassword', 10);
const user = await userDao.updatePassword('60d5ec49c1234567890abcde', hashed);
```

---

### 9. **updateRole(id, role)**
Update user role.

**Parameters:**
- `id: string` - User ID
- `role: string` - New role

**Returns:**
- `Promise<User>` - Updated user

**Example:**
```typescript
const admin = await userDao.updateRole('60d5ec49c1234567890abcde', 'admin');
```

---

### 10. **delete(id)**
Delete a user.

**Parameters:**
- `id: string` - User ID

**Returns:**
- `Promise<User>` - Deleted user

**Throws:**
- `NotFoundException` - If user not found

**Example:**
```typescript
const deleted = await userDao.delete('60d5ec49c1234567890abcde');
```

---

### 11. **exists(id)**
Check if user exists.

**Parameters:**
- `id: string` - User ID

**Returns:**
- `Promise<boolean>` - True if exists

**Example:**
```typescript
const userExists = await userDao.exists('60d5ec49c1234567890abcde');
```

---

### 12. **search(searchTerm, limit)**
Search users by name or email.

**Parameters:**
- `searchTerm: string` - Search query
- `limit?: number` (default: 10) - Max results

**Returns:**
- `Promise<User[]>` - Matching users

**Example:**
```typescript
const results = await userDao.search('john', 5);
// Searches name and email fields, case-insensitive
```

---

### 13. **count(role)**
Get total user count (optionally filtered by role).

**Parameters:**
- `role?: string` - Optional role filter

**Returns:**
- `Promise<number>` - User count

**Example:**
```typescript
const totalUsers = await userDao.count();
const adminCount = await userDao.count('admin');
```

---

### 14. **findWithFilters(page, limit, filters)**
Advanced filtering with multiple criteria.

**Parameters:**
- `page?: number` (default: 1)
- `limit?: number` (default: 10)
- `filters?: object`:
  - `role?: string` - Filter by role
  - `search?: string` - Search name or email
  - `sortBy?: string` - Field to sort by
  - `order?: 'asc' | 'desc'` - Sort order

**Returns:**
```typescript
{
  users: User[],
  total: number,
  pages: number
}
```

**Example:**
```typescript
const result = await userDao.findWithFilters(1, 20, {
  role: 'admin',
  search: 'john',
  sortBy: 'name',
  order: 'asc'
});
```

---

### 15. **bulkUpdate(ids, updateData)**
Update multiple users at once.

**Parameters:**
- `ids: string[]` - Array of user IDs
- `updateData: Partial<CreateUserDto>` - Fields to update

**Returns:**
- Update result object with `modifiedCount`

**Example:**
```typescript
const result = await userDao.bulkUpdate(
  ['id1', 'id2', 'id3'],
  { role: 'moderator' }
);
```

---

### 16. **bulkDelete(ids)**
Delete multiple users at once.

**Parameters:**
- `ids: string[]` - Array of user IDs

**Returns:**
- Delete result object with `deletedCount`

**Example:**
```typescript
const result = await userDao.bulkDelete(['id1', 'id2']);
```

---

### 17. **findByIdPopulated(id)**
Find user by ID (prepared for populated fields if references exist).

**Parameters:**
- `id: string` - User ID

**Returns:**
- `Promise<User>` - User object

**Example:**
```typescript
const user = await userDao.findByIdPopulated('60d5ec49c1234567890abcde');
```

---

## Usage in Services

### Basic Service Implementation

```typescript
import { Injectable } from '@nestjs/common';
import { UserDao } from '../../database/mongoose/dao/users.dao';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private userDao: UserDao) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.userDao.create(createUserDto);
  }

  async getUser(id: string) {
    return this.userDao.findById(id);
  }

  async updateUser(id: string, updateData: Partial<CreateUserDto>) {
    return this.userDao.update(id, updateData);
  }

  async deleteUser(id: string) {
    return this.userDao.delete(id);
  }
}
```

---

## Error Handling

The DAO throws specific exceptions that should be caught in services/controllers:

```typescript
try {
  const user = await userDao.create(userData);
} catch (error) {
  if (error instanceof ConflictException) {
    // Handle duplicate email
    console.error('Email already exists');
  }
}
```

---

## Password Security

The DAO has separate methods for password handling:

```typescript
// In Auth Service
const hashedPassword = await bcrypt.hash(password, 10);
const user = await userDao.create({
  ...userData,
  password: hashedPassword
});

// Update password
const newHashedPassword = await bcrypt.hash(newPassword, 10);
await userDao.updatePassword(userId, newHashedPassword);

// Password never returned in responses
const user = await userDao.findById(userId); // No password field
```

---

## Database Indexes

For optimal performance, the following indexes are recommended:

```javascript
// In User schema
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ name: 1 });
db.users.createIndex({ createdAt: -1 });
```

---

## Pagination Example

```typescript
// Get page 2, 25 users per page
const result = await userDao.findAll(2, 25);

// Response
{
  users: [ /* 25 users */ ],
  total: 1500,      // Total users in database
  pages: 60         // Total pages (1500 / 25)
}
```

---

## Search Example

```typescript
// Search for users with "john" in name or email
const users = await userDao.search('john', 10);

// Case-insensitive search in both fields
// Limited to 10 results
```

---

## Advanced Filter Example

```typescript
const result = await userDao.findWithFilters(1, 20, {
  role: 'admin',              // Only admins
  search: 'example.com',      // Email contains
  sortBy: 'createdAt',        // Sort by creation date
  order: 'desc'               // Newest first
});

// Returns:
{
  users: [ /* admin users from example.com */ ],
  total: 45,
  pages: 3
}
```

---

## Performance Tips

1. **Use pagination** for large datasets
2. **Search with limit** to avoid returning too many results
3. **Select without password** for public responses
4. **Bulk operations** for updating many users
5. **Role-based queries** instead of filtering in memory

---

## Testing Example

```typescript
describe('UserDao', () => {
  let userDao: UserDao;

  beforeEach(() => {
    // Setup DAO with test database
  });

  it('should create a user', async () => {
    const user = await userDao.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user'
    });

    expect(user._id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  it('should throw ConflictException on duplicate email', async () => {
    await userDao.create({
      name: 'User 1',
      email: 'test@example.com',
      password: 'hash1'
    });

    await expect(
      userDao.create({
        name: 'User 2',
        email: 'test@example.com',
        password: 'hash2'
      })
    ).rejects.toThrow(ConflictException);
  });
});
```

---

## Integration with Controllers

```typescript
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('role') role?: string
  ) {
    return this.userService.findAll(page, limit, role);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
```

---

## Summary

The UserDao provides a comprehensive data access layer that:
- Encapsulates all database operations
- Ensures consistent error handling
- Protects sensitive data (passwords)
- Provides advanced querying capabilities
- Maintains clean separation of concerns
- Improves testability and maintainability
