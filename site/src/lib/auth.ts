import { cookies } from 'next/headers';
import prisma from './prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE = 'admin_session';

function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Backwards compatibility for old SHA256 hashes (they are exactly 64 chars long and hex)
  if (hash.length === 64 && /^[0-9a-f]{64}$/.test(hash)) {
    const legacyHash = crypto.createHash('sha256').update(password + 'clinic-salt-2024').digest('hex');
    return legacyHash === hash;
  }
  return bcrypt.compare(password, hash);
}

export async function createAdminUser(username: string, password: string) {
  const passwordHash = await hashPassword(password);
  return prisma.adminUser.create({
    data: {
      username,
      passwordHash: passwordHash,
      role: 'admin',
    },
  });
}

export async function authenticateAdmin(username: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { username } });
  
  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
}

export async function createSession(user: { id: number; username: string; role: string }, rememberMe: boolean = false) {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + (rememberMe ? 30 * 24 : 24)); // 30 days if remember me, else 24 hours
  
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
      rememberMe,
    },
  });

  return token;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!token) return null;

  const session = await prisma.session.findUnique({ 
    where: { token },
    include: { user: true },
  });
  
  if (!session || session.expiresAt < new Date()) {
    // Clean up expired session
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return {
    id: session.user.id,
    username: session.user.username,
    role: session.user.role
  };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  
  cookieStore.delete(SESSION_COOKIE);
}

export async function initializeDefaultAdmin() {
  const existingAdmin = await prisma.adminUser.findFirst();
  
  if (!existingAdmin) {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    
    if (!username || !password) {
      console.warn('CRITICAL: ADMIN_USERNAME and ADMIN_PASSWORD environment variables are not set. Cannot create default admin!');
      return;
    }
    
    await createAdminUser(username, password);
    console.log(`Default admin user created from environment variables: ${username}`);
  }
}

// Password reset functions
export async function createPasswordResetToken(userId: number): Promise<string> {
  const token = generateResetToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<{ userId: number } | null> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return null;
  }

  return { userId: resetToken.userId };
}

export async function markPasswordResetTokenUsed(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (resetToken) {
    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
  }
}

export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const verification = await verifyPasswordResetToken(token);
  if (!verification) return false;

  const passwordHash = await hashPassword(newPassword);
  await prisma.adminUser.update({
    where: { id: verification.userId },
    data: { passwordHash },
  });

  await markPasswordResetTokenUsed(token);
  return true;
}
