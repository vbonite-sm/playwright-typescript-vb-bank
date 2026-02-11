import { test, expect } from '../../fixtures';

test.describe('Admin User Management Tests @regression @admin', () => {
  test.beforeEach(async ({ userManagementPage }) => {
    await userManagementPage.goto();
  });

  test('should load user management page @smoke', async ({ userManagementPage }) => {
    await userManagementPage.expectPageLoaded();
  });

  test('should display user list @e2e', async ({ userManagementPage }) => {
    await userManagementPage.expectUsersVisible();
  });

  test('should search for users', async ({ userManagementPage }) => {
    await userManagementPage.searchUsers('John');

    await expect(userManagementPage.searchInput).toHaveValue('John');
  });

  test('should open user details modal', async ({ userManagementPage }) => {
    await userManagementPage.viewUserDetailsByIndex(0);

    await userManagementPage.expectModalVisible();
  });

  test('should close user details modal', async ({ userManagementPage }) => {
    await userManagementPage.viewUserDetailsByIndex(0);
    await userManagementPage.expectModalVisible();

    await userManagementPage.closeModal();

    await userManagementPage.expectModalClosed();
  });
});
