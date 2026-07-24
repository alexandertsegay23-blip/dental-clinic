import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword, createSession, createPasswordResetToken, verifyPasswordResetToken, resetPasswordWithToken } from '@/lib/auth';
import { checkRateLimit, getClientIP, resetRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    const rateLimit = checkRateLimit(clientIP, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      const minutes = Math.ceil(rateLimit.resetIn / 60000);
      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: minutes,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetIn / 1000)),
          }
        }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: (result.error as any).issues }, 
        { status: 400 }
      );
    }

    const { username, password, rememberMe } = result.data;

    const user = await prisma.adminUser.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials', remaining: rateLimit.remaining },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials', remaining: rateLimit.remaining },
        { status: 401 }
      );
    }

    // Success! Reset rate limit for this IP
    resetRateLimit(clientIP);

    const session = await createSession({ id: user.id, username: user.username, role: user.role }, rememberMe);
    const response = NextResponse.json({ 
      message: 'Login successful', 
      user: { id: user.id, username: user.username, role: user.role } 
    });
    
    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 24 hours
    response.cookies.set('admin_session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

// Password reset request
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: (result.error as any).issues },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Find user by email (we need to check all users since username is the login field)
    const users = await prisma.adminUser.findMany();
    const user = users.find(u => u.username === email || u.username === email.toLowerCase());

    if (!user) {
      // Don't reveal whether the email exists or not
      return NextResponse.json({ message: 'If an account with that email exists, we have sent a password reset link.' });
    }

    // Create reset token
    const token = await createPasswordResetToken(user.id);

    // In a real application, you would send an email here
    // For now, we'll log the token in the console (for development)
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;
    
    console.log(`[Password Reset] Reset URL for ${user.username}: ${resetUrl}`);

    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Failed to process password reset request' }, { status: 500 });
  }
}
