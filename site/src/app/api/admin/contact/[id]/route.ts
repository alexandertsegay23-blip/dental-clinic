import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getContactSubmissionById, updateContactSubmission, deleteContactSubmission } from '@/lib/repository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const submission = await getContactSubmissionById(parseInt(id));
    
    if (!submission) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Failed to fetch contact submission:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submission' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    
    const submission = await updateContactSubmission(parseInt(id), {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.message !== undefined && { message: body.message }),
      ...(body.is_read !== undefined && { is_read: body.is_read }),
    });

    if (!submission) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Failed to update contact submission:', error);
    return NextResponse.json({ error: 'Failed to update contact submission' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await deleteContactSubmission(parseInt(id));
    
    if (!success) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Failed to delete contact submission:', error);
    return NextResponse.json({ error: 'Failed to delete contact submission' }, { status: 500 });
  }
}
