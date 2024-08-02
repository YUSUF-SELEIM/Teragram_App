import { Request } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hive';

export const context = async ({ req }: { req: Request }) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  let user = null;

  if (token) {
    try {
      // Decode and verify the token
      user = jwt.verify(token, JWT_SECRET) as { id: string;};
    } catch (e) {
      console.error('Invalid token:', e);
    }
  }
  // Return user info in context
  return {
    user, // Use 'user' to share user info with resolvers because the context is shared across all resolvers
  };
};