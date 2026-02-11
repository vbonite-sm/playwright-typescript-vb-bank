import { test as base } from '@playwright/test';
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  TransferPage,
  HistoryPage,
  TopUpPage,
  BillPayPage,
  LoanPage,
  SettingsPage,
  AdminDashboardPage,
  UserManagementPage,
  NavigationComponent,
} from '../pages';

/** Page Object fixtures — eliminates boilerplate in test files. */
type PageFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  dashboardPage: DashboardPage;
  transferPage: TransferPage;
  historyPage: HistoryPage;
  topUpPage: TopUpPage;
  billPayPage: BillPayPage;
  loanPage: LoanPage;
  settingsPage: SettingsPage;
  adminDashboardPage: AdminDashboardPage;
  userManagementPage: UserManagementPage;
  nav: NavigationComponent;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  transferPage: async ({ page }, use) => {
    await use(new TransferPage(page));
  },
  historyPage: async ({ page }, use) => {
    await use(new HistoryPage(page));
  },
  topUpPage: async ({ page }, use) => {
    await use(new TopUpPage(page));
  },
  billPayPage: async ({ page }, use) => {
    await use(new BillPayPage(page));
  },
  loanPage: async ({ page }, use) => {
    await use(new LoanPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },
  userManagementPage: async ({ page }, use) => {
    await use(new UserManagementPage(page));
  },
  nav: async ({ page }, use) => {
    await use(new NavigationComponent(page));
  },
});

export { expect } from '@playwright/test';
