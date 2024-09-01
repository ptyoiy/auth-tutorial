import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

/**
 * auth.ts에서 정의한 session과 token의 타입을 확장
 * https://authjs.dev/getting-started/typescript#module-augmentation
 */

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}