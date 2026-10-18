import { PageShell } from '@/components/PageShell';
import { ProfileCard } from '@/components/account/ProfileCard';
import { AddressBook } from '@/components/account/AddressBook';
import { AccountLinks } from '@/components/account/AccountLinks';

export const metadata = { title: 'My account' };

export default function AccountPage() {
  return (
    <PageShell title="My account">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ProfileCard />
          <AddressBook />
        </div>
        <AccountLinks />
      </div>
    </PageShell>
  );
}
