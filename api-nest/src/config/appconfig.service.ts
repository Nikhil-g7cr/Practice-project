import { Injectable } from '@nestjs/common';

export interface IAppConfig {
  app: {
    port: number;
    environment: string;
    debug: boolean;
  };
  database: {
    mongoose: {
      dialect: string;
      uri: string;
      username?: string;
      password?: string;
    };
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

@Injectable()
export class AppConfigService {
  private readonly envConfig: IAppConfig;

  constructor() {
    this.envConfig = {
      app: {
        port: parseInt(process.env.PORT || '3000', 10),
        environment: process.env.NODE_ENV || 'development',
        debug: process.env.DEBUG === 'true',
      },
      database: {
        mongoose: {
          dialect: 'mongodb',
          uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nestdb',
          username: process.env.MONGO_USER,
          password: process.env.MONGO_PASSWORD,
        },
      },
      jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    };
  }

  /**
   * Get the entire config
   */
  getConfig(): IAppConfig {
    return this.envConfig;
  }

  /**
   * Get app configuration
   */
  getAppConfig() {
    return this.envConfig.app;
  }

  /**
   * Get database configuration
   */
  getDatabaseConfig() {
    return this.envConfig.database;
  }

  /**
   * Get JWT configuration
   */
  getJwtConfig() {
    return this.envConfig.jwt;
  }

  /**
   * Get specific environment variable
   */
  get(key: string): any {
    return this.envConfig[key];
  }

  /**
   * Get port
   */
  getPort(): number {
    return this.envConfig.app.port;
  }

  /**
   * Get environment
   */
  getEnvironment(): string {
    return this.envConfig.app.environment;
  }

  /**
   * Get database URI
   */
  getDatabaseUri(): string {
    return this.envConfig.database.mongoose.uri;
  }

  /**
   * Get JWT secret
   */
  getJwtSecret(): string {
    return this.envConfig.jwt.secret;
  }

  /**
   * Check if production
   */
  isProduction(): boolean {
    return this.envConfig.app.environment === 'production';
  }

  /**
   * Check if development
   */
  isDevelopment(): boolean {
    return this.envConfig.app.environment === 'development';
  }
}
