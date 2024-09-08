// src/types/fastify.d.ts
import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: { userId: number, email: string}; // Replace `any` with the actual type of your user object
  }
}
