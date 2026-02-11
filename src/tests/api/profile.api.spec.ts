import { test, expect } from '../../fixtures/api.fixtures';
import { defaultUser } from '../../data/credentials';
import { expectApiSuccess, expectApiError, expectApiArray, expectUnauthorized } from '../../helpers';

test.describe('Profile API @api @profile', () => {
  test.beforeEach(async ({ api }) => {
    await api.init();
    await api.login(defaultUser.username, defaultUser.password);
  });

  test.describe('User Profile', () => {
    test('should get current user profile', async ({ api }) => {
      const response = await api.getUserProfile();

      expectApiSuccess(response, 200);
      expect(response.data.username).toBe(defaultUser.username);
      expect(response.data.email).toBeDefined();
      expect(response.data.fullName).toBeDefined();
    });

    test('should update profile successfully', async ({ api }) => {
      const updates = {
        fullName: 'John Updated Doe',
        phone: '+1-555-123-4567',
      };

      const response = await api.updateProfile(updates);

      expectApiSuccess(response, 200);
      expect(response.data.fullName).toBe(updates.fullName);
    });

    test('should update email address', async ({ api }) => {
      const updates = {
        email: 'john.updated@example.com',
      };

      const response = await api.updateProfile(updates);

      expectApiSuccess(response, 200);
    });

    test('should update address', async ({ api }) => {
      const updates = {
        address: '123 Main Street, City, State 12345',
      };

      const response = await api.updateProfile(updates);

      expectApiSuccess(response, 200);
    });

    test('should update profile with various fields', async ({ api }) => {
      const updates = {
        phone: '+1-555-999-8888',
      };

      const response = await api.updateProfile(updates);

      expectApiSuccess(response);
    });
  });

  test.describe('Password Management', () => {
    test('should change password successfully', async ({ api }) => {
      const currentPassword = defaultUser.password;
      const newPassword = 'newSecurePassword123!';

      const response = await api.changePassword(currentPassword, newPassword);

      expectApiSuccess(response);

      // Cleanup: change password back to original
      await api.changePassword(currentPassword, newPassword);
    });

    test('should reject password change with wrong current password', async ({ api }) => {
      const wrongPassword = 'wrongPassword123';
      const newPassword = 'newPassword456';

      const response = await api.changePassword(wrongPassword, newPassword);

      expectApiError(response);
    });

    test('should reject weak new password', async ({ api }) => {
      // Arrange - using current password and a weak new password
      const currentPassword = defaultUser.password;
      const weakPassword = '123'; // Too short/weak

      const response = await api.changePassword(currentPassword, weakPassword);

      expectApiError(response);
    });
  });

  test.describe('Session Management', () => {
    test('should get current session after login', async ({ api }) => {
      const response = await api.getSession();

      expectApiSuccess(response, 200);
      expect(response.data.userId).toBeDefined();
    });

    test('should refresh token successfully', async ({ api }) => {
      const response = await api.refreshToken();

      expectApiSuccess(response);
      expect(response.data.accessToken).toBeDefined();
    });

    test('should invalidate session after logout', async ({ api }) => {
      await api.logout();

      const response = await api.getSession();

      // Assert - after logout, session should fail or show not authenticated
      expect(response.success === false || response.data?.isAuthenticated === false).toBeTruthy();
    });
  });

  test.describe('Bill History', () => {
    test('should get bill payment history', async ({ api }) => {
      const response = await api.getBillHistory();

      expectApiArray(response);

      if (response.data && response.data.length > 0) {
        const bill = response.data[0];
        expect(bill.id).toBeDefined();
        expect(bill.provider).toBeDefined();
        expect(bill.amount).toBeDefined();
      }
    });
  });

  test.describe('Loan Applications', () => {
    test('should get loan applications history', async ({ api }) => {
      const response = await api.getLoanApplications();

      expectApiArray(response);

      if (response.data && response.data.length > 0) {
        const loan = response.data[0];
        expect(loan.id).toBeDefined();
        expect(loan.loanType).toBeDefined();
        expect(loan.amount).toBeDefined();
      }
    });
  });
});

test.describe('Profile API - Security @api @profile @security', () => {
  test('should reject profile operations without authentication', async ({ api }) => {
    await api.init();
    await api.clearAuth();

    const response = await api.getUserProfile('user-1');

    expectUnauthorized(response);
  });

  test('should reject password change without authentication', async ({ api }) => {
    await api.init();
    await api.clearAuth();

    const response = await api.changePassword('old', 'new', 'user-1');

    expectUnauthorized(response);
  });
});
