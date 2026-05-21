import { prisma } from '@maison/db';
import type { User } from '@maison/db';

// The shape of auth info the API expects from its callers (web, mobile).
// Both clients pull this from Clerk via their own SDKs; the API itself is
// agnostic to where the verified identity came from.
export type AuthContext = {
  clerkUserId: string | null;
  // Profile snapshot from Clerk — passed by the caller alongside the
  // verified user id so the API can keep its local User row in sync
  // without depending on Clerk's SDK itself.
  profile?: {
    email: string;
    name: string;
    avatarUrl?: string;
  };
};

export type CreateContextOptions = {
  auth: AuthContext;
};

export type Context = {
  auth: AuthContext;
  prisma: typeof prisma;
  // Resolved on demand by procedures that need it (see trpc.ts).
  user: User | null;
};

export function createContext(opts: CreateContextOptions): Context {
  return {
    auth: opts.auth,
    prisma,
    user: null,
  };
}
