// ============================================
// API Client for VB Bank using globalThis.__API__
// ============================================
// Calls the app's exposed API directly via page.evaluate()
// This ensures API tests use the same mock layer as the UI.
// Note: globalThis.__API__ usage is intentional for mock API testing
// sonar-disable-file sonarjs/prefer-globalthis
// ============================================

import { Page } from '@playwright/test';

// Response structure from globalThis.__API__
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta: {
    requestId: string;
    timestamp: string;
    duration: number;
    endpoint: string;
    method: string;
  };
}

// Auth types
export interface AuthData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export interface SessionData {
  userId: string;
  username: string;
  role: string;
  isAuthenticated: boolean;
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone?: string;
}

// Bank types
export interface BalanceData {
  balance: number;
  currency: string;
  accountNumber: string;
}

export interface AccountDetails {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  recipientName?: string;
  recipientAccount?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface TransferData {
  transactionId: string;
  newBalance: number;
  amount: number;
  recipientAccount: string;
}

export interface DepositData {
  transactionId: string;
  newBalance: number;
  amount: number;
}

export interface WithdrawData {
  transactionId: string;
  newBalance: number;
  amount: number;
}

export interface BillPaymentData {
  transactionId: string;
  newBalance: number;
  provider: string;
  amount: number;
}

export interface BillHistoryItem {
  id: string;
  provider: string;
  amount: number;
  date: string;
  status: string;
}

export interface Card {
  id: string;
  cardNumber: string;
  cardType: 'debit' | 'credit';
  expiryDate: string;
  status: 'active' | 'frozen' | 'blocked';
  cardholderName: string;
}

export interface CardPIN {
  pin: string;
}

export interface LoanApplication {
  id: string;
  loanType: string;
  amount: number;
  term: number;
  status: string;
  monthlyPayment: number;
  interestRate: number;
}

export interface ProfileUpdate {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Admin types
export interface SystemStats {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  activeLoans: number;
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  accountNumber: string;
  balance: number;
  role: string;
  createdAt: string;
}

export interface UserDetails extends AdminUser {
  phone?: string;
  address?: string;
  lastLogin?: string;
  transactionCount?: number;
}

export interface TransactionTrend {
  date: string;
  volume: number;
  count: number;
}

export interface UserActivity {
  userId: string;
  loginCount: number;
  lastActivity: string;
  transactionCount: number;
  totalVolume: number;
}

export interface SearchResult {
  id: string;
  username: string;
  fullName: string;
  accountNumber: string;
}

// API type definition shared by Window and globalThis
interface ApiDefinition {
  auth: {
    apiLogin: (username: string, password: string) => Promise<ApiResponse<AuthData>>;
    apiRegister: (userData: RegisterData) => Promise<ApiResponse<AuthData>>;
    apiLogout: () => Promise<ApiResponse<void>>;
    apiGetSession: () => Promise<ApiResponse<SessionData>>;
    apiRefreshToken: () => Promise<ApiResponse<RefreshTokenData>>;
    apiUpdateProfile: (userId: string, updates: ProfileUpdate) => Promise<ApiResponse<UserProfile>>;
  };
  bank: {
    apiGetBalance: (userId: string) => Promise<ApiResponse<BalanceData>>;
    apiGetAccountDetails: (userId: string) => Promise<ApiResponse<AccountDetails>>;
    apiGetUserProfile: (userId: string) => Promise<ApiResponse<UserProfile>>;
    apiTransferMoney: (
      fromUserId: string,
      recipientAccount: string,
      amount: number,
      description: string
    ) => Promise<ApiResponse<TransferData>>;
    apiGetTransactions: (userId: string, limit?: number) => Promise<ApiResponse<Transaction[]>>;
    apiGetTransactionStats: (userId: string) => Promise<ApiResponse<TransactionStats>>;
    apiDepositMoney: (userId: string, amount: number, description: string) => Promise<ApiResponse<DepositData>>;
    apiWithdrawMoney: (userId: string, amount: number, description: string) => Promise<ApiResponse<WithdrawData>>;
    apiSearchUsers: (query: string) => Promise<ApiResponse<SearchResult[]>>;
    apiPayBill: (
      userId: string,
      provider: string,
      amount: number,
      description: string,
      paymentMethod: string
    ) => Promise<ApiResponse<BillPaymentData>>;
    apiGetBillHistory: (userId: string) => Promise<ApiResponse<BillHistoryItem[]>>;
    apiGetCards: (userId: string) => Promise<ApiResponse<Card[]>>;
    apiFreezeCard: (userId: string, cardId: string) => Promise<ApiResponse<Card>>;
    apiUnfreezeCard: (userId: string, cardId: string) => Promise<ApiResponse<Card>>;
    apiBlockCard: (userId: string, cardId: string) => Promise<ApiResponse<Card>>;
    apiGetCardPIN: (userId: string, cardId: string) => Promise<ApiResponse<CardPIN>>;
    apiApplyForLoan: (
      userId: string,
      loanType: string,
      amount: number,
      term: number
    ) => Promise<ApiResponse<LoanApplication>>;
    apiGetLoanApplications: (userId: string) => Promise<ApiResponse<LoanApplication[]>>;
    apiUpdateProfile: (userId: string, updates: ProfileUpdate) => Promise<ApiResponse<UserProfile>>;
    apiChangePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<ApiResponse<void>>;
  };
  admin: {
    apiGetSystemStats: () => Promise<ApiResponse<SystemStats>>;
    apiGetAllUsers: () => Promise<ApiResponse<AdminUser[]>>;
    apiGetUserDetails: (userId: string) => Promise<ApiResponse<UserDetails>>;
    apiGetAllTransactions: (limit?: number) => Promise<ApiResponse<Transaction[]>>;
    apiGetTransactionTrends: (days?: number) => Promise<ApiResponse<TransactionTrend[]>>;
    apiSearchUsers: (query: string) => Promise<ApiResponse<SearchResult[]>>;
    apiGetUserActivity: (userId: string) => Promise<ApiResponse<UserActivity>>;
  };
}

declare global {
  // Extend both Window and globalThis with __API__
  interface Window {
    __API__: ApiDefinition;
  }
  
  // eslint-disable-next-line no-var
  var __API__: ApiDefinition;
}

export class ApiClient {
  private readonly page: Page;
  private userId: string | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  // ----- Initialization -----

  /**
   * Navigates to the app and waits for __API__ to be available.
   * Must be called once before making any API requests.
   */
  async init(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForFunction(
      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
      // @ts-ignore - Using globalThis.__API__ for mock API testing
      () => globalThis.__API__ !== undefined,
      { timeout: 30000 }
    );
  }

  /** Returns the current user ID */
  getUserId(): string | null {
    return this.userId;
  }

  // ============================================
  // AUTH API
  // ============================================

  async login(username: string, password: string): Promise<ApiResponse<AuthData>> {
    const response = await this.page.evaluate(
      async ([user, pass]) => {
        return await globalThis.__API__.auth.apiLogin(user, pass);
      },
      [username, password] as const
    );
    
    if (response.success) {
      // Get userId from response or localStorage session
      if (response.data?.userId) {
        this.userId = response.data.userId;
      } else {
        // Fallback: get from localStorage
        this.userId = await this.page.evaluate(() => {
          const session = localStorage.getItem('vb_bank_session');
          return session ? JSON.parse(session).userId : null;
        });
      }
    }
    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthData>> {
    const response = await this.page.evaluate(
      async (data) => {
        return await globalThis.__API__.auth.apiRegister(data);
      },
      userData
    );
    
    if (response.success && response.data) {
      this.userId = response.data.userId;
    }
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.page.evaluate(async () => {
      return await globalThis.__API__.auth.apiLogout();
    });
    
    if (response.success) {
      this.userId = null;
    }
    return response;
  }

  // ============================================
  // BANK API
  // ============================================

  async getBalance(userId?: string): Promise<ApiResponse<BalanceData>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.bank.apiGetBalance(uid);
      },
      id
    );
  }

  async transfer(
    recipientAccount: string,
    amount: number,
    description: string,
    fromUserId?: string
  ): Promise<ApiResponse<TransferData>> {
    const id = fromUserId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, recipient, amt, desc]) => {
        return await globalThis.__API__.bank.apiTransferMoney(uid, recipient, amt, desc);
      },
      [id, recipientAccount, amount, description] as const
    );
  }

  async getTransactions(userId?: string, limit?: number): Promise<ApiResponse<Transaction[]>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, lim]) => {
        return await globalThis.__API__.bank.apiGetTransactions(uid, lim ?? undefined);
      },
      [id, limit] as const
    );
  }

  async payBill(
    provider: string,
    amount: number,
    description: string,
    paymentMethod: string = 'balance',
    userId?: string
  ): Promise<ApiResponse<BillPaymentData>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, prov, amt, desc, method]) => {
        return await globalThis.__API__.bank.apiPayBill(uid, prov, amt, desc, method);
      },
      [id, provider, amount, description, paymentMethod] as const
    );
  }

  async applyForLoan(
    loanType: string,
    amount: number,
    term: number,
    userId?: string
  ): Promise<ApiResponse<LoanApplication>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, type, amt, trm]) => {
        return await globalThis.__API__.bank.apiApplyForLoan(uid, type, amt, trm);
      },
      [id, loanType, amount, term] as const
    );
  }

  // ============================================
  // ADMIN API
  // ============================================

  async adminGetSystemStats(): Promise<ApiResponse<SystemStats>> {
    return this.page.evaluate(async () => {
      return await globalThis.__API__.admin.apiGetSystemStats();
    });
  }

  async adminGetAllUsers(): Promise<ApiResponse<AdminUser[]>> {
    return this.page.evaluate(async () => {
      return await globalThis.__API__.admin.apiGetAllUsers();
    });
  }

  async adminGetAllTransactions(limit?: number): Promise<ApiResponse<Transaction[]>> {
    return this.page.evaluate(
      async (lim) => {
        return await globalThis.__API__.admin.apiGetAllTransactions(lim ?? undefined);
      },
      limit
    );
  }

  async adminGetUserDetails(userId: string): Promise<ApiResponse<UserDetails>> {
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.admin.apiGetUserDetails(uid);
      },
      userId
    );
  }

  async adminGetTransactionTrends(days?: number): Promise<ApiResponse<TransactionTrend[]>> {
    return this.page.evaluate(
      async (d) => {
        return await globalThis.__API__.admin.apiGetTransactionTrends(d ?? undefined);
      },
      days
    );
  }

  async adminSearchUsers(query: string): Promise<ApiResponse<SearchResult[]>> {
    return this.page.evaluate(
      async (q) => {
        return await globalThis.__API__.admin.apiSearchUsers(q);
      },
      query
    );
  }

  async adminGetUserActivity(userId: string): Promise<ApiResponse<UserActivity>> {
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.admin.apiGetUserActivity(uid);
      },
      userId
    );
  }

  // ============================================
  // EXTENDED AUTH API
  // ============================================

  async getSession(): Promise<ApiResponse<SessionData>> {
    return this.page.evaluate(async () => {
      return await globalThis.__API__.auth.apiGetSession();
    });
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenData>> {
    return this.page.evaluate(async () => {
      return await globalThis.__API__.auth.apiRefreshToken();
    });
  }

  // ============================================
  // EXTENDED BANK API
  // ============================================

  async getAccountDetails(userId?: string): Promise<ApiResponse<AccountDetails>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.bank.apiGetAccountDetails(uid);
      },
      id
    );
  }

  async getUserProfile(userId?: string): Promise<ApiResponse<UserProfile>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.bank.apiGetUserProfile(uid);
      },
      id
    );
  }

  async getTransactionStats(userId?: string): Promise<ApiResponse<TransactionStats>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.bank.apiGetTransactionStats(uid);
      },
      id
    );
  }

  async deposit(
    amount: number,
    description: string,
    userId?: string
  ): Promise<ApiResponse<DepositData>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, amt, desc]) => {
        return await globalThis.__API__.bank.apiDepositMoney(uid, amt, desc);
      },
      [id, amount, description] as const
    );
  }

  async withdraw(
    amount: number,
    description: string,
    userId?: string
  ): Promise<ApiResponse<WithdrawData>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, amt, desc]) => {
        return await globalThis.__API__.bank.apiWithdrawMoney(uid, amt, desc);
      },
      [id, amount, description] as const
    );
  }

  async searchUsers(query: string): Promise<ApiResponse<SearchResult[]>> {
    return this.page.evaluate(
      async (q) => {
        return await globalThis.__API__.bank.apiSearchUsers(q);
      },
      query
    );
  }

  async getBillHistory(userId?: string): Promise<ApiResponse<BillHistoryItem[]>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.bank.apiGetBillHistory(uid);
      },
      id
    );
  }

  // ============================================
  // CARDS API
  // ============================================

  async getCards(userId?: string): Promise<ApiResponse<Card[]>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.bank.apiGetCards(uid);
      },
      id
    );
  }

  async freezeCard(cardId: string, userId?: string): Promise<ApiResponse<Card>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, cid]) => {
        return await globalThis.__API__.bank.apiFreezeCard(uid, cid);
      },
      [id, cardId] as const
    );
  }

  async unfreezeCard(cardId: string, userId?: string): Promise<ApiResponse<Card>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, cid]) => {
        return await globalThis.__API__.bank.apiUnfreezeCard(uid, cid);
      },
      [id, cardId] as const
    );
  }

  async blockCard(cardId: string, userId?: string): Promise<ApiResponse<Card>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, cid]) => {
        return await globalThis.__API__.bank.apiBlockCard(uid, cid);
      },
      [id, cardId] as const
    );
  }

  async getCardPIN(cardId: string, userId?: string): Promise<ApiResponse<CardPIN>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, cid]) => {
        return await globalThis.__API__.bank.apiGetCardPIN(uid, cid);
      },
      [id, cardId] as const
    );
  }

  // ============================================
  // LOANS EXTENDED
  // ============================================

  async getLoanApplications(userId?: string): Promise<ApiResponse<LoanApplication[]>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async (uid) => {
        return await globalThis.__API__.bank.apiGetLoanApplications(uid);
      },
      id
    );
  }

  // ============================================
  // PROFILE API
  // ============================================

  async updateProfile(updates: ProfileUpdate, userId?: string): Promise<ApiResponse<UserProfile>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, upd]) => {
        return await globalThis.__API__.bank.apiUpdateProfile(uid, upd);
      },
      [id, updates] as const
    );
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    userId?: string
  ): Promise<ApiResponse<void>> {
    const id = userId ?? this.userId;
    if (!id) throw new Error('No userId provided and not logged in');
    
    return this.page.evaluate(
      async ([uid, currPass, newPass]) => {
        return await globalThis.__API__.bank.apiChangePassword(uid, currPass, newPass);
      },
      [id, currentPassword, newPassword] as const
    );
  }

  // ============================================
  // HELPER: Clear auth state
  // ============================================

  async clearAuth(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('vb_bank_token');
      localStorage.removeItem('vb_bank_session');
    });
    this.userId = null;
  }
}
