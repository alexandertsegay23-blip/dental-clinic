import { getCurrentUser } from '@/lib/auth';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
