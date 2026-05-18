# DatabaseService Documentation

## Overview

The `DatabaseService` is a comprehensive service that manages MongoDB connections, provides health checks, handles reconnection logic, and offers database utilities. It implements `OnModuleInit` and `OnModuleDestroy` lifecycle hooks for automatic connection management.

---

## Features

- ✅ **Connection Management** - Automatic connection on module init
- ✅ **Auto-Reconnection** - Retry logic with configurable attempts
- ✅ **Health Checks** - Continuous database health monitoring
- ✅ **Connection Pooling** - Configurable pool size
- ✅ **Index Management** - Create, drop, and list indexes
- ✅ **Database Statistics** - Collection and database stats
- ✅ **Event Listeners** - Connected, disconnected, error events
- ✅ **Session Management** - Transaction support
- ✅ **Backup Support** - Backup initiation
- ✅ **Logging** - Comprehensive logging for debugging

---

## Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/devices

# Connection Pool Configuration
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=2
DB_SERVER_SELECT_TIMEOUT=5000
DB_CONNECT_TIMEOUT=10000
DB_SOCKET_TIMEOUT=45000
DB_RETRY_WRITES=true
```

---

## Core Methods

### Connection Methods

#### **connect()**

Establishes connection to MongoDB with retry logic.

```typescript
await databaseService.connect();
```

- Retries up to 5 times with 5-second delays
- Sets up connection event listeners
- Initializes database indexes
- Throws error if max attempts exceeded

#### **disconnect()**

Gracefully disconnects from MongoDB.

```typescript
await databaseService.disconnect();
```

---

### Health & Status Methods

#### **getHealthStatus()**

Check overall database health.

```typescript
const health = await databaseService.getHealthStatus();
// Returns:
{
  status: 'healthy' | 'unhealthy',
  connected: boolean,
  readyState: number,
  message: string,
  timestamp: Date
}
```

**States:**

- `0` - Disconnected
- `1` - Connected ✅
- `2` - Connecting
- `3` - Disconnecting

#### **isConnectedToDatabase()**

Quick check if connected.

```typescript
const connected = databaseService.isConnectedToDatabase();
// Returns: true | false
```

#### **validateConnection()**

Validate connection with health check.

```typescript
const isValid = await databaseService.validateConnection();
```

---

### Statistics Methods

#### **getStats()**

Get overall database statistics.

```typescript
const stats = await databaseService.getStats();
// Returns:
{
  collections: number,
  indexes: number,
  dataSize: number,
  storageSize: number,
  avgObjSize: number
}
```

#### **getCollectionStats(collectionName)**

Get statistics for a specific collection.

```typescript
const collStats = await databaseService.getCollectionStats("users");
```

---

### Index Management

#### **createIndex(collectionName, indexSpec, options)**

Create an index on a collection.

```typescript
await databaseService.createIndex("users", { email: 1 }, { unique: true });

// Create compound index
await databaseService.createIndex(
  "users",
  { firstName: 1, lastName: 1 },
  { name: "fullName_index" },
);
```

#### **dropIndex(collectionName, indexName)**

Drop an index.

```typescript
await databaseService.dropIndex("users", "email_1");
```

#### **getIndexes(collectionName)**

List all indexes on a collection.

```typescript
const indexes = await databaseService.getIndexes("users");
// Returns array of index definitions
```

---

### Collection Management

#### **collectionExists(collectionName)**

Check if a collection exists.

```typescript
const exists = await databaseService.collectionExists("users");
```

#### **getCollectionNames()**

Get all collection names in database.

```typescript
const collections = await databaseService.getCollectionNames();
// Returns: ['users', 'sessions', 'logs', ...]
```

---

### Connection Information

#### **getConnectionDetails()**

Get current connection details.

```typescript
const details = databaseService.getConnectionDetails();
// Returns:
{
  host: 'localhost',
  port: 27017,
  database: 'devices',
  isConnected: true
}
```

#### **getDatabaseName()**

Get current database name.

```typescript
const dbName = databaseService.getDatabaseName();
```

#### **getDatabaseUrl()**

Get database URL (credentials masked).

```typescript
const url = databaseService.getDatabaseUrl();
// Returns: mongodb://***@localhost:27017
```

#### **getReadyState()**

Get connection ready state (0-4).

```typescript
const state = databaseService.getReadyState();
```

---

### Connection Instances

#### **getConnection()**

Get Mongoose connection instance.

```typescript
const connection = databaseService.getConnection();
// Use for advanced operations
```

#### **getMongooseInstance()**

Get Mongoose instance.

```typescript
const mongoose = databaseService.getMongooseInstance();
```

#### **getModel<T>(modelName)**

Get a specific model.

```typescript
const userModel = databaseService.getModel<User>("User");
```

---

### Advanced Methods

#### **startSession()**

Start a new session (for transactions).

```typescript
const session = await databaseService.startSession();
// Use with transactions
await session.startTransaction();
// ... perform operations
await session.commitTransaction();
```

#### **backup()**

Initiate database backup (basic implementation).

```typescript
await databaseService.backup();
// For production, use mongodump CLI tool
```

#### **dropDatabase(force)**

Drop entire database (requires force flag).

```typescript
// This requires explicit confirmation
await databaseService.dropDatabase(true); // ⚠️ Dangerous!
```

---

## Usage Examples

### Basic Setup (Automatic)

```typescript
// DatabaseService automatically connects on module init
// No manual setup needed!

@Module({
  imports: [DatabaseModule],
})
export class AppModule {}
```

### Health Check Endpoint

```typescript
@Controller("health")
export class HealthController {
  constructor(private databaseService: DatabaseService) {}

  @Get("db")
  async getDbHealth() {
    return this.databaseService.getHealthStatus();
  }
}
```

### Database Management Endpoint

```typescript
@Controller("admin/database")
export class DatabaseAdminController {
  constructor(private databaseService: DatabaseService) {}

  @Get("stats")
  async getStats() {
    return this.databaseService.getStats();
  }

  @Get("collections")
  async getCollections() {
    return {
      collections: await this.databaseService.getCollectionNames(),
      details: this.databaseService.getConnectionDetails(),
    };
  }

  @Get("indexes/:collection")
  async getIndexes(@Param("collection") collection: string) {
    return this.databaseService.getIndexes(collection);
  }

  @Post("index/create")
  async createIndex(
    @Body("collection") collection: string,
    @Body("spec") spec: any,
    @Body("options") options?: any,
  ) {
    await this.databaseService.createIndex(collection, spec, options);
    return { message: "Index created" };
  }
}
```

### Connection Validation

```typescript
@Injectable()
export class DatabaseGuard implements CanActivate {
  constructor(private databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isConnected = await this.databaseService.validateConnection();

    if (!isConnected) {
      throw new ServiceUnavailableException('Database connection failed');
    }

    return true;
  }
}

// Use as guard
@UseGuards(DatabaseGuard)
@Get('protected-route')
protectedRoute() {
  return 'Only accessible when DB is connected';
}
```

### Transaction Example

```typescript
async transferFunds(fromUserId: string, toUserId: string, amount: number) {
  const session = await this.databaseService.startSession();

  try {
    await session.startTransaction();

    // Debit from user
    await userModel.findByIdAndUpdate(
      fromUserId,
      { $inc: { balance: -amount } },
      { session }
    );

    // Credit to user
    await userModel.findByIdAndUpdate(
      toUserId,
      { $inc: { balance: amount } },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}
```

### Index Creation on Startup

```typescript
@Injectable()
export class DatabaseInitializationService implements OnModuleInit {
  constructor(private databaseService: DatabaseService) {}

  async onModuleInit() {
    // Create specific indexes
    await this.databaseService.createIndex(
      "users",
      { email: 1 },
      { unique: true, background: true },
    );

    await this.databaseService.createIndex(
      "users",
      { createdAt: 1 },
      { expireAfterSeconds: 2592000 }, // 30 days TTL
    );

    await this.databaseService.createIndex(
      "sessions",
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }, // Auto-delete expired
    );
  }
}
```

---

## Event Listeners

The service automatically sets up connection event listeners:

```typescript
// Connected
database-service: 🔗 Database connection established

// Disconnected
database-service: 🔌 Database connection disconnected

// Error
database-service: Database connection error: [error message]

// Reconnected
database-service: 🔄 Database connection reconnected
```

---

## Logging

All operations are logged with appropriate log levels:

```
[LOG]   ✅ Successfully connected to MongoDB
[LOG]   ✅ Database indexes initialization complete
[LOG]   🔗 Database connection established
[WARN]  🔄 Retrying connection (1/5) in 5000ms
[ERROR] ❌ Failed to connect to MongoDB
[ERROR] ❌ Max connection attempts reached
```

---

## Error Handling

```typescript
try {
  const stats = await databaseService.getStats();
} catch (error) {
  console.error("Failed to get database stats:", error.message);
}

try {
  await databaseService.validateConnection();
} catch (error) {
  // Connection not available
}
```

---

## Connection States

| State         | Number | Description               |
| ------------- | ------ | ------------------------- |
| Disconnected  | 0      | Not connected             |
| Connected     | 1      | Successfully connected ✅ |
| Connecting    | 2      | Attempting connection     |
| Disconnecting | 3      | Closing connection        |
| Invalid       | 4      | Invalid state             |

---

## Performance Tuning

### Connection Pool Settings

```env
# Increase pool size for high concurrency
DB_MAX_POOL_SIZE=50
DB_MIN_POOL_SIZE=10

# Adjust timeouts for slow networks
DB_CONNECT_TIMEOUT=20000
DB_SOCKET_TIMEOUT=60000
```

### Index Optimization

```typescript
// Create compound index for common queries
await databaseService.createIndex(
  "users",
  {
    createdAt: -1,
    role: 1,
    status: 1,
  },
  { name: "search_index" },
);
```

---

## Monitoring & Observability

### Health Check in Readiness Probe

```typescript
@Get('/ready')
async readinessProbe() {
  const health = await this.databaseService.getHealthStatus();

  if (health.status !== 'healthy') {
    throw new ServiceUnavailableException('Database not ready');
  }

  return { status: 'ok' };
}
```

### Metrics Collection

```typescript
@Get('/metrics')
async getMetrics() {
  const stats = await this.databaseService.getStats();
  const health = await this.databaseService.getHealthStatus();
  const details = this.databaseService.getConnectionDetails();

  return {
    database: {
      stats,
      health,
      details,
    },
  };
}
```

---

## Testing

```typescript
describe("DatabaseService", () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it("should be connected", async () => {
    const connected = await service.validateConnection();
    expect(connected).toBe(true);
  });

  it("should get health status", async () => {
    const health = await service.getHealthStatus();
    expect(health.status).toBe("healthy");
  });

  it("should get database stats", async () => {
    const stats = await service.getStats();
    expect(stats.collections).toBeGreaterThan(0);
  });
});
```

---

## Best Practices

1. **Don't call connect() manually** - Let the service handle it
2. **Always use health checks** - Verify connection before critical operations
3. **Handle reconnection gracefully** - Your app will auto-reconnect
4. **Use transactions for multi-document operations** - Ensure consistency
5. **Create indexes proactively** - During initialization, not at runtime
6. **Monitor logs** - Watch for connection errors and timeouts
7. **Test database availability** - Include in liveness/readiness probes

---

## Troubleshooting

### Connection Timeout

```
Error: serverSelectionTimeoutMS expired

Solution:
- Increase DB_SERVER_SELECT_TIMEOUT
- Check MongoDB is running
- Verify MONGODB_URI is correct
```

### Max Connection Attempts

```
Error: Max connection attempts reached

Solution:
- Check MongoDB credentials
- Verify network connectivity
- Check MongoDB service status
- Review MongoDB logs
```

### Connection Pool Exhausted

```
Error: Timed out while checking out a connection

Solution:
- Increase DB_MAX_POOL_SIZE
- Review connection usage patterns
- Close unused connections properly
```

---

## Summary

The DatabaseService provides a complete, production-ready solution for:

- ✅ MongoDB connection management
- ✅ Automatic reconnection
- ✅ Health monitoring
- ✅ Index management
- ✅ Database statistics
- ✅ Transaction support
- ✅ Comprehensive logging
- ✅ Error handling

All operations are secure, logged, and monitored for reliability.
