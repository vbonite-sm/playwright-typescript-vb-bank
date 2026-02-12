import { test, expect } from '../../fixtures';

test.describe('Admin User Management Tests', { tag: ['@regression', '@admin'] }, () => {
  test.beforeEach(async ({ userManagementPage }) => {
    await userManagementPage.goto();
  });

  test('should load user management page', { tag: ['@smoke', '@high', '@security'] }, async ({ userManagementPage }) => {
    await userManagementPage.expectPageLoaded();
  });

  test('should display user list', { tag: ['@e2e', '@high', '@security'] }, async ({ userManagementPage }) => {
    await userManagementPage.expectUsersVisible();
  });

  test('should search for users', { tag: '@high' }, async ({ userManagementPage }) => {
    await userManagementPage.searchUsers('John');

    await expect(userManagementPage.searchInput).toHaveValue('John');
  });

  test('should open user details modal', { tag: '@high' }, async ({ userManagementPage }) => {
    await userManagementPage.viewUserDetailsByIndex(0);

    await userManagementPage.expectModalVisible();
  });

  test('should close user details modal', { tag: '@medium' }, async ({ userManagementPage }) => {
    await userManagementPage.viewUserDetailsByIndex(0);
    await userManagementPage.expectModalVisible();

    await userManagementPage.closeModal();

    await userManagementPage.expectModalClosed();
  });
});
