// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT?: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    DATABASE_URL: string;
  }
}
