export type Role = 'customer' | 'vendor' | 'admin';

export type Address = {
  _id: string;
  label?: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  area?: string;
  city: string;
  district: string;
  postcode?: string;
  isDefault: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  status: 'active' | 'blocked';
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses: Address[];
  createdAt: string;
};

export type VendorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type Vendor = {
  id: string;
  shopName: string;
  slug: string;
  type: 'inhouse' | 'supplier';
  contactPhone: string;
  businessAddress: string;
  tradeLicenseNo: string | null;
  hasTradeLicense: boolean;
  payout?: { method?: string; accountName?: string; accountNumber?: string; bankName?: string; branch?: string };
  status: VendorStatus;
  statusNote: string | null;
  approvedAt: string | null;
  createdAt: string;
  user?: { _id: string; name: string; email?: string; phone?: string };
};

export type Paged<T> = { items: T[]; page: number; limit: number; total: number };
