/**
 * E2E Test: Comments Flow
 * Tests viewing and adding comments to products
 */

describe('Comments E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('View and Add Comments', () => {
    it('should view product comments', async () => {
      // Login
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      // Wait for home screen
      await waitFor(element(by.id('homeScreen')))
        .toBeVisible()
        .withTimeout(10000);

      // Open first product
      await element(by.id('productCard-0')).multiTap(1);

      // Wait for product detail
      await waitFor(element(by.id('productDetailScreen')))
        .toBeVisible()
        .withTimeout(5000);

      // Scroll down to comments section
      await waitFor(element(by.id('commentsSection')))
        .toBeVisible()
        .withTimeout(5000);

      // Should see comments list
      await expect(element(by.id('commentsList'))).toExist();
    });

    it('should add comment to product', async () => {
      // Login and navigate to product
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      await waitFor(element(by.id('homeScreen')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('productCard-0')).multiTap(1);

      // Scroll to comments section
      await waitFor(element(by.id('commentsSection')))
        .toBeVisible()
        .withTimeout(5000);

      // Tap "Add Comment" button
      await element(by.id('addCommentButton')).multiTap(1);

      // Wait for comment modal
      await waitFor(element(by.id('commentModal')))
        .toBeVisible()
        .withTimeout(3000);

      // Type comment
      await element(by.id('commentInput')).typeText(
        'This is a great product! Very happy with my purchase.'
      );

      // Tap post button
      await element(by.id('postCommentButton')).multiTap(1);

      // See success message
      await waitFor(element(by.text('Comment posted!')))
        .toBeVisible()
        .withTimeout(3000);

      // Verify comment appears in list
      await waitFor(
        element(by.text('This is a great product! Very happy with my purchase.'))
      )
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should validate comment length', async () => {
      // Navigate to add comment
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      await waitFor(element(by.id('homeScreen')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('productCard-0')).multiTap(1);
      await element(by.id('addCommentButton')).multiTap(1);

      // Try to post short comment
      await element(by.id('commentInput')).typeText('Short');

      // Post button should be disabled or show error
      await element(by.id('postCommentButton')).multiTap(1);

      // Should see error message
      await waitFor(element(by.text('Comment must be at least 10 characters')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should edit own comment', async () => {
      // Add a comment first
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      await waitFor(element(by.id('homeScreen')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('productCard-0')).multiTap(1);
      await element(by.id('addCommentButton')).multiTap(1);

      await element(by.id('commentInput')).typeText(
        'Original comment text here'
      );
      await element(by.id('postCommentButton')).multiTap(1);

      // Find edit button on own comment
      await waitFor(element(by.id('editComment-0')))
        .toBeVisible()
        .withTimeout(5000);

      // Tap edit button
      await element(by.id('editComment-0')).multiTap(1);

      // Modal should show with comment text
      await waitFor(element(by.id('commentModal')))
        .toBeVisible()
        .withTimeout(3000);

      // Clear and type new text
      await element(by.id('commentInput')).clearText();
      await element(by.id('commentInput')).typeText('Updated comment text');

      // Save changes
      await element(by.id('updateCommentButton')).multiTap(1);

      // See update success message
      await waitFor(element(by.text('Comment updated!')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });
});
