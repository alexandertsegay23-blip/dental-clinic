import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

/**
 * Protect an API route - returns error response if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  return null; // Auth passed
}

/**
 * Protect an API route and require specific role
 */
export async function requireRole(role: 'admin' | 'moderator') {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  if (user.role !== role && user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return null; // Auth passed
}
