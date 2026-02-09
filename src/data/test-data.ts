// ============================================
// Test Data for VB Bank Feature Tests
// ============================================

// ----- Transfer Test Data -----
export const transferData = {
  valid: {
    recipientAccount: '2345678901',
    amount: '100',
    description: 'Test transfer via Playwright',
  },
  largeAmount: {
    recipientAccount: '2345678901',
    amount: '5000',
    description: 'Large transfer test',
  },
  invalidAccount: {
    recipientAccount: '9999999999',
    amount: '50',
    description: 'Invalid account transfer',
  },
  zeroAmount: {
    recipientAccount: '2345678901',
    amount: '0',
    description: 'Zero amount transfer',
  },
};

// ----- Top Up Test Data -----
export const topUpData = {
  customAmount: '200',
  quickAmounts: [50, 100, 250, 500] as const,
};

// ----- Bill Pay Test Data -----
export const billPayData = {
  electricity: {
    provider: 'VB Power',
    accountNumber: 'ELEC-001',
    amount: '150',
    description: 'Monthly electricity bill',
  },
  water: {
    provider: 'VB Water',
    accountNumber: 'WATER-001',
    amount: '75',
    description: 'Monthly water bill',
  },
  internet: {
    provider: 'VB Internet',
    accountNumber: 'NET-001',
    amount: '99',
    description: 'Monthly internet bill',
  },
};

// ----- Loan Test Data -----
export const loanData = {
  personal: {
    type: 'loan_personal',
    typeName: 'Personal Loan',
    amount: '5000',
    term: '24',
  },
  home: {
    type: 'loan_home',
    typeName: 'Home Loan',
    amount: '250000',
    term: '360',
  },
  auto: {
    type: 'loan_auto',
    typeName: 'Auto Loan',
    amount: '30000',
    term: '60',
  },
  education: {
    type: 'loan_education',
    typeName: 'Education Loan',
    amount: '20000',
    term: '48',
  },
};

// ----- Registration Test Data -----
export const registrationData = {
  valid: {
    fullName: 'Test User',
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: 'Test@123',
    confirmPassword: 'Test@123',
  },
  passwordMismatch: {
    fullName: 'Test User',
    username: 'testuser_mismatch',
    email: 'mismatch@example.com',
    password: 'Test@123',
    confirmPassword: 'WrongPass',
  },
};

// ----- Settings Test Data -----
export const settingsData = {
  profileUpdate: {
    fullName: 'John Doe Updated',
    email: 'john.updated@example.com',
    phone: '+1-555-9999',
  },
  passwordChange: {
    currentPassword: 'user123',
    newPassword: 'NewPass@123',
    confirmPassword: 'NewPass@123',
  },
};

// ----- Mock Gateway Card -----
export const testCard = {
  number: '4242424242424242',
  cvc: '123',
  expiry: '12/28',
};
