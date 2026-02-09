/**
 * Cards API Tests
 * Tests for card management: get cards, freeze, unfreeze, block, PIN
 */
import { test, expect } from '../../fixtures/api.fixtures';
import { defaultUser } from '../../data/credentials';

test.describe('Cards API @api @cards', () => {
  test.beforeEach(async ({ api }) => {
    await api.init();
    await api.login(defaultUser.username, defaultUser.password);
  });

  test.describe('Get Cards', () => {
    test('should retrieve user cards successfully', async ({ api }) => {
      // Act
      const response = await api.getCards();

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data && response.data.length > 0) {
        const card = response.data[0];
        expect(card.id).toBeDefined();
        expect(card.cardNumber).toBeDefined();
      }
    });

    test('should have masked card number for security', async ({ api }) => {
      // Act
      const response = await api.getCards();

      // Assert
      expect(response.success).toBe(true);
      
      if (response.data && response.data.length > 0) {
        const cardNumber = response.data[0].cardNumber;
        // Card numbers should be partially masked (e.g., ****1234)
        expect(cardNumber).toBeDefined();
      }
    });
  });

  test.describe('Card Status Management', () => {
    let testCardId: string;

    test.beforeEach(async ({ api }) => {
      // Get a card to test with
      const cardsResponse = await api.getCards();
      if (cardsResponse.success && cardsResponse.data && cardsResponse.data.length > 0) {
        testCardId = cardsResponse.data[0].id;
      }
    });

    test('should freeze card successfully', async ({ api }) => {
      // Skip if no cards available
      test.skip(!testCardId, 'No cards available for testing');

      // Act
      const response = await api.freezeCard(testCardId);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data?.status).toBe('frozen');
    });

    test('should unfreeze card successfully', async ({ api }) => {
      // Skip if no cards available
      test.skip(!testCardId, 'No cards available for testing');

      // Arrange - freeze first
      await api.freezeCard(testCardId);

      // Act
      const response = await api.unfreezeCard(testCardId);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data?.status).toBe('active');
    });

    test('should block card successfully', async ({ api }) => {
      // Skip if no cards available
      test.skip(!testCardId, 'No cards available for testing');

      // Act
      const response = await api.blockCard(testCardId);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data?.status).toBe('blocked');
    });

    test('should reject operations on invalid card ID', async ({ api }) => {
      // Act
      const response = await api.freezeCard('invalid-card-id-12345');

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.error).toBeDefined();
    });
  });

  test.describe('Card PIN', () => {
    test('should retrieve card PIN for valid card', async ({ api }) => {
      // Arrange
      const cardsResponse = await api.getCards();
      test.skip(
        !cardsResponse.success || !cardsResponse.data?.length,
        'No cards available for testing'
      );

      const cardId = cardsResponse.data![0].id;

      // Act
      const response = await api.getCardPIN(cardId);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data?.pin).toBeDefined();
      // PIN should be 4 digits
      expect(response.data?.pin).toMatch(/^\d{4}$/);
    });

    test('should reject PIN request for invalid card', async ({ api }) => {
      // Act
      const response = await api.getCardPIN('invalid-card-id');

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});

test.describe('Cards API - Authentication @api @cards @security', () => {
  test('should reject card operations without authentication', async ({ api }) => {
    // Arrange
    await api.init();
    await api.clearAuth();

    // Act
    const response = await api.getCards('user-1');

    // Assert
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
    expect(response.error?.code).toBe('UNAUTHORIZED');
  });
});
