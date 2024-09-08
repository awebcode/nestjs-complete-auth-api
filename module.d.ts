declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: NODE_ENV;
        PORT: string;
        JWT_SECRET: string;
        DATABASE_URL: string;
    }
}

enum NODE_ENV {
    development = 'development',
    production = 'production',
    test = 'test'
}