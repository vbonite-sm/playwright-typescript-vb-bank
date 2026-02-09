import { test, expect } from '../../fixtures';

test.describe('Admin User Management Tests @regression @admin', () => {
  test.beforeEach(async ({ userManagementPage }) => {
    await userManagementPage.goto();
  });

  /**
   * Test: User management page loads with search and user list.
   */
  test('should load user management page @smoke', async ({ userManagementPage }) => {
    // Arrange - page loaded

    // Act - data renders

    // Assert
    await userManagementPage.expectPageLoaded();
  });

  /**
   * Test: Display list of users.
   */
  test('should display user list @e2e', async ({ userManagementPage }) => {
    // Arrange - page loaded with seeded users

    // Act - users auto-load

    // Assert
    await userManagementPage.expectUsersVisible();
  });

  /**
   * Test: Search users by name.
   */
  test('should search for users', async ({ userManagementPage }) => {
    // Arrange - page loaded

    // Act
    await userManagementPage.searchUsers('John');

    // Assert
    await expect(userManagementPage.searchInput).toHaveValue('John');
  });

  /**
   * Test: View user details in modal.
   */
  test('should open user details modal', async ({ userManagementPage }) => {
    // Arrange - page loaded with users

    // Act - Click the first user's "View Details" button (index 0)
    await userManagementPage.viewUserDetailsByIndex(0);

    // Assert
    await userManagementPage.expectModalVisible();
  });

  /**
   * Test: Close user details modal.
   */
  test('should close user details modal', async ({ userManagementPage }) => {
    // Arrange - open modal first (click first user)
    await userManagementPage.viewUserDetailsByIndex(0);
    await userManagementPage.expectModalVisible();

    // Act
    await userManagementPage.closeModal();

    // Assert
    await userManagementPage.expectModalClosed();
  });
});
