/**
 * Profile API Tests
 * Tests for user profile management: update profile, change password, session
 */
import { test, expect } from '../../fixtures/api.fixtures';
import { defaultUser } from '../../data/credentials';

test.describe('Profile API @api @profile', () => {
  test.beforeEach(async ({ api }) => {
    await api.init();
    await api.login(defaultUser.username, defaultUser.password);
  });

  test.describe('User Profile', () => {
    test('should get current user profile', async ({ api }) => {
      // Act
      const response = await api.getUserProfile();

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data?.username).toBe(defaultUser.username);
      expect(response.data?.email).toBeDefined();
      expect(response.data?.fullName).toBeDefined();
    });

    test('should update profile successfully', async ({ api }) => {
      // Arrange
      const updates = {
        fullName: 'John Updated Doe',
        phone: '+1-555-123-4567',
      };

      // Act
      const response = await api.updateProfile(updates);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data?.fullName).toBe(updates.fullName);
    });

    test('should update email address', async ({ api }) => {
      // Arrange
      const updates = {
        email: 'john.updated@example.com',
      };

      // Act
      const response = await api.updateProfile(updates);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
    });

    test('should update address', async ({ api }) => {
      // Arrange
      const updates = {
        address: '123 Main Street, City, State 12345',
      };

      // Act
      const response = await api.updateProfile(updates);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
    });

    test('should update profile with various fields', async ({ api }) => {
      // Arrange
      const updates = {
        phone: '+1-555-999-8888',
      };

      // Act
      const response = await api.updateProfile(updates);

      // Assert
      expect(response.success).toBe(true);
      expect([200, 201]).toContain(response.status);
    });
  });

  test.describe('Password Management', () => {
    test('should change password successfully', async ({ api }) => {
      // Arrange
      const currentPassword = defaultUser.password;
      const newPassword = 'newSecurePassword123!';

      // Act
      const response = await api.changePassword(currentPassword, newPassword);

      // Assert
      expect(response.success).toBe(true);
      expect([200, 201]).toContain(response.status);

      // Cleanup: change password back to original
      await api.changePassword(currentPassword, newPassword);
    });

    test('should reject password change with wrong current password', async ({ api }) => {
      // Arrange
      const wrongPassword = 'wrongPassword123';
      const newPassword = 'newPassword456';

      // Act
      const response = await api.changePassword(wrongPassword, newPassword);

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.error).toBeDefined();
    });

    test('should reject weak new password', async ({ api }) => {
      // Arrange - using current password and a weak new password
      const currentPassword = defaultUser.password;
      const weakPassword = '123'; // Too short/weak

      // Act
      const response = await api.changePassword(currentPassword, weakPassword);

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('Session Management', () => {
    test('should get current session after login', async ({ api }) => {
      // Act
      const response = await api.getSession();

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      // Session data structure may vary
      expect(response.data?.userId).toBeDefined();
    });

    test('should refresh token successfully', async ({ api }) => {
      // Act
      const response = await api.refreshToken();

      // Assert
      expect(response.success).toBe(true);
      expect([200, 201]).toContain(response.status);
      expect(response.data).toBeDefined();
      expect(response.data?.accessToken).toBeDefined();
    });

    test('should invalidate session after logout', async ({ api }) => {
      // Arrange
      await api.logout();

      // Act
      const response = await api.getSession();

      // Assert - after logout, session should fail or show not authenticated
      expect(response.success === false || response.data?.isAuthenticated === false).toBeTruthy();
    });
  });

  test.describe('Bill History', () => {
    test('should get bill payment history', async ({ api }) => {
      // Act
      const response = await api.getBillHistory();

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
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
      // Act
      const response = await api.getLoanApplications();

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
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
    // Arrange
    await api.init();
    await api.clearAuth();

    // Act
    const response = await api.getUserProfile('user-1');

    // Assert
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
    expect(response.error?.code).toBe('UNAUTHORIZED');
  });

  test('should reject password change without authentication', async ({ api }) => {
    // Arrange
    await api.init();
    await api.clearAuth();

    // Act
    const response = await api.changePassword('old', 'new', 'user-1');

    // Assert
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
  });
});
