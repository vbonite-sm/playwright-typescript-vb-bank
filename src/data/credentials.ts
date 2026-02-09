// ============================================
// Credentials & User Data for VB Bank Tests
// ============================================

export interface UserCredentials {
  username: string;
  password: string;
  fullName: string;
  accountNumber: string;
  balance: number;
  email: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface TransferRecipient {
  name: string;
  accountNumber: string;
}

// ----- User Accounts -----
export const users: Record<string, UserCredentials> = {
  johnDoe: {
    username: 'john.doe',
    password: 'user123',
    fullName: 'John Doe',
    accountNumber: '1234567890',
    balance: 15000,
    email: 'john.doe@example.com',
  },
  janeSmith: {
    username: 'jane.smith',
    password: 'user123',
    fullName: 'Jane Smith',
    accountNumber: '2345678901',
    balance: 25000.5,
    email: 'jane.smith@example.com',
  },
  mikeWilson: {
    username: 'mike.wilson',
    password: 'user123',
    fullName: 'Mike Wilson',
    accountNumber: '3456789012',
    balance: 8500.75,
    email: 'mike.wilson@example.com',
  },
};

// ----- Admin Account -----
export const admin: AdminCredentials = {
  username: 'admin',
  password: 'admin123',
};

// ----- Default user for most tests -----
export const defaultUser = users.johnDoe;

// ----- Transfer Recipients -----
export const transferRecipients: Record<string, TransferRecipient> = {
  janeSmith: {
    name: 'Jane Smith',
    accountNumber: '2345678901',
  },
  mikeWilson: {
    name: 'Mike Wilson',
    accountNumber: '3456789012',
  },
  johnDoe: {
    name: 'John Doe',
    accountNumber: '1234567890',
  },
};
