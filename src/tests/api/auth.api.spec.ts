// ============================================
// Auth API Tests
// ============================================

import { test, expect } from '../../fixtures/api.fixtures';
import { defaultUser, admin } from '../../data/credentials';

test.describe('Auth API @api @regression', () => {
  test.describe('Login', () => {
    test('should login successfully with valid user credentials @smoke', async ({ api }) => {
      // Act
      const response = await api.login(defaultUser.username, defaultUser.password);

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data!.user.username).toBe(defaultUser.username);
      expect(response.data!.accessToken).toBeTruthy();
    });

    test('should login successfully with admin credentials @smoke', async ({ api }) => {
      // Act
      const response = await api.login(admin.username, admin.password);

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data!.user.role).toBe('admin');
    });

    test('should fail login with invalid password', async ({ api }) => {
      // Act
      const response = await api.login(defaultUser.username, 'wrongpassword');

      // Assert
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });

    test('should fail login with non-existent username', async ({ api }) => {
      // Act
      const response = await api.login('nonexistent_user', 'anypassword');

      // Assert
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully @smoke', async ({ userApi }) => {
      // Act
      const response = await userApi.logout();

      // Assert
      expect(response.success).toBe(true);
    });
  });
});
