import { requireUser } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireUser(['admin']);
  return children;
}
