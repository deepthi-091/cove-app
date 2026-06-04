/// <reference path="./detox.d.ts" />
/**
 * E2E Test: Shopping Cart Flow
 * Tests browsing products, adding to cart, and checkout
 */

describe('Shopping Cart E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Browse and Add to Cart', () => {
    it('should add product to cart', async () => {
      // Step 1: Login
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      // Step 2: Wait for home screen
      await waitFor(element(by.id('homeScreen')))
        .toBeVisible()
        .withTimeout(10000);

      // Step 3: Find first product and tap it
      await waitFor(element(by.id('productCard-0')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('productCard-0')).multiTap(1);

      // Step 4: Wait for product detail screen
      await waitFor(element(by.id('productDetailScreen')))
        .toBeVisible()
        .withTimeout(5000);

      // Step 5: Tap "Add to Cart" button
      await element(by.id('addToCartButton')).multiTap(1);

      // Step 6: See success message
      await waitFor(element(by.text('Added to cart!')))
        .toBeVisible()
        .withTimeout(3000);

      // Step 7: Verify cart badge updated
      await expect(element(by.id('cartBadge'))).toHaveText('1');
    });

    it('should increase quantity in cart', async () => {
      // Login and add product
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      // Wait and add to cart
      await waitFor(element(by.id('productCard-0')))
        .toBeVisible()
        .withTimeout(10000);
      await element(by.id('productCard-0')).multiTap(1);

      await waitFor(element(by.id('addToCartButton')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('addToCartButton')).multiTap(1);

      // Go to cart
      await element(by.id('cartTab')).multiTap(1);

      // Wait for cart screen
      await waitFor(element(by.id('cartScreen')))
        .toBeVisible()
        .withTimeout(5000);

      // Increase quantity
      await element(by.id('increaseQuantity-0')).multiTap(1);

      // Verify quantity changed
      await expect(element(by.id('quantity-0'))).toHaveText('2');

      // Verify total updated
      await expect(element(by.id('cartTotal'))).toExist();
    });

    it('should remove item from cart', async () => {
      // Add item to cart
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      await waitFor(element(by.id('productCard-0')))
        .toBeVisible()
        .withTimeout(10000);
      await element(by.id('productCard-0')).multiTap(1);
      await element(by.id('addToCartButton')).multiTap(1);

      // Go to cart
      await element(by.id('cartTab')).multiTap(1);

      // Remove item
      await element(by.id('removeButton-0')).multiTap(1);

      // Verify item removed
      await waitFor(element(by.text('Your cart is empty')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });

  describe('Checkout Flow', () => {
    it('should complete checkout', async () => {
      // Login
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      // Add to cart
      await waitFor(element(by.id('productCard-0')))
        .toBeVisible()
        .withTimeout(10000);
      await element(by.id('productCard-0')).multiTap(1);
      await element(by.id('addToCartButton')).multiTap(1);

      // Go to cart
      await element(by.id('cartTab')).multiTap(1);

      // Tap checkout button
      await waitFor(element(by.id('checkoutButton')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('checkoutButton')).multiTap(1);

      // See order confirmation
      await waitFor(element(by.text('Order Confirmed!')))
        .toBeVisible()
        .withTimeout(10000);

      // Verify order number shown
      await expect(element(by.id('orderNumber'))).toExist();
    });
  });
});
