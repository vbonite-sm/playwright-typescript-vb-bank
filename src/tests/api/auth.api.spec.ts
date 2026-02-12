import { test, expect } from '../../fixtures/api.fixtures';
import { defaultUser, admin } from '../../data/credentials';
import { expectApiSuccess, expectApiError } from '../../helpers';

test.describe('Auth API', { tag: ['@api', '@regression'] }, () => {
  test.describe('Login', () => {
    test('should login successfully with valid user credentials', { tag: ['@smoke', '@critical', '@security'] }, async ({ api }) => {
      const response = await api.login(defaultUser.username, defaultUser.password);

      expectApiSuccess(response);
      expect(response.data.user.username).toBe(defaultUser.username);
      expect(response.data.accessToken).toBeTruthy();
    });

    test('should login successfully with admin credentials', { tag: ['@smoke', '@critical', '@security'] }, async ({ api }) => {
      const response = await api.login(admin.username, admin.password);

      expectApiSuccess(response);
      expect(response.data.user.role).toBe('admin');
    });

    test('should fail login with invalid password', { tag: ['@critical', '@security'] }, async ({ api }) => {
      const response = await api.login(defaultUser.username, 'wrongpassword');

      expectApiError(response);
    });

    test('should fail login with non-existent username', { tag: ['@critical', '@security'] }, async ({ api }) => {
      const response = await api.login('nonexistent_user', 'anypassword');

      expectApiError(response);
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', { tag: ['@smoke', '@critical', '@security'] }, async ({ userApi }) => {
      const response = await userApi.logout();

      expect(response.success).toBe(true);
    });
  });
});
