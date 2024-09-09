import type { User } from "@prisma/client";

declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NODE_ENV;
      PORT: string;
      JWT_SECRET: string;
      DATABASE_URL: string;
      REFRESH_TOKEN_SECRET: string;
    }
}

enum NODE_ENV {
    development = 'development',
    production = 'production',
    test = 'test'
}


declare global {
  namespace Express {
    interface Request {
      user?: User & { userId: number };
    }
  }
}