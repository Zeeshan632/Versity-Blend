declare namespace NodeJS {
  interface ProcessEnv {
    // Server
    PORT?: string;

    // Auth / JWT
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRATION: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRATION: string;

    // Database (PostgreSQL)
    DB_TYPE: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}
