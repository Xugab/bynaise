import { handlers } from "@/lib/auth";

// Expose NextAuth GET and POST handlers untuk /api/auth/[...nextauth]
export const { GET, POST } = handlers;
