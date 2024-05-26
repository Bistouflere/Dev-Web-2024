declare namespace NodeJS {
  export interface ProcessEnv {
    CLERK_SECRET_KEY: string;
    WEBHOOK_SECRET: string;
    DATABASE_URL: string;
    PORT: string;
  }
}
