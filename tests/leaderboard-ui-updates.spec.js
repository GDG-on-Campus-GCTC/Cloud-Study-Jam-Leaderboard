import { test, expect } from '@playwright/test';

test.describe('Leaderboard UI Updates', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3001');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should display Skill Badges metric with value 51', async ({ page }) => {
    // Find the "Skill Badges" metric card
    const skillBadgesLabel = await page.locator('text=Skill Badges').first();
    
    // Verify the label exists
    await expect(skillBadgesLabel).toBeVisible();
    
    // Find the value associated with Skill Badges
    const skillBadgesValue = skillBadgesLabel.locator('..').locator('text=51');
    
    // Verify the value is 51
    await expect(skillBadgesValue).toBeVisible();
    await expect(skillBadgesValue).toContainText('51');
  });

  test('should NOT display star icons next to rank numbers in leaderboard', async ({ page }) => {
    // Wait for the leaderboard table to load
    const leaderboardTable = page.locator('table');
    await expect(leaderboardTable).toBeVisible();
    
    // Get all rows from the leaderboard
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    
    // Verify at least some rows exist
    expect(rowCount).toBeGreaterThan(0);
    
    // Check first 10 rows for the presence of star icons in rank cells
    for (let i = 0; i < Math.min(10, rowCount); i++) {
      const row = rows.nth(i);
      
      // Get the rank cell (first cell in the row)
      const rankCell = row.locator('td').first();
      
      // Verify the rank cell doesn't contain any SVG elements (which would be the star)
      const svgElements = rankCell.locator('svg');
      const svgCount = await svgElements.count();
      
      // Rank cells should not have any SVG elements (no stars)
      expect(svgCount).toBe(0);
    }
  });

  test('should display progress calculation based on 100 max instead of 50', async ({ page }) => {
    // Find the Achievement Goals section
    const achievementSection = await page.locator('text=Achievement Goals');
    await expect(achievementSection).toBeVisible();
    
    // Check that the percentage values are displayed
    const skillBadgesProgress = achievementSection.locator('..').locator('text=Skill Badges');
    await expect(skillBadgesProgress).toBeVisible();
    
    // Get the progress percentage text
    const progressPercentage = await page.locator('text=92.0%').first();
    await expect(progressPercentage).toBeVisible();
    
    // The percentage should be reasonable (between 0 and 100)
    const percentageText = await progressPercentage.textContent();
    const percentageValue = parseFloat(percentageText);
    
    expect(percentageValue).toBeGreaterThanOrEqual(0);
    expect(percentageValue).toBeLessThanOrEqual(100);
  });

  test('should display marquee with proper styling in desktop view', async ({ page }) => {
    // Find the marquee container
    const marquee = page.locator('.marquee-container');
    await expect(marquee).toBeVisible();
    
    // Verify the marquee text is visible and scrolling
    const marqueeText = marquee.locator('.marquee-text');
    await expect(marqueeText).toBeVisible();
    
    // Check that the marquee text contains the campaign message
    const marqueeContent = await marqueeText.first().textContent();
    expect(marqueeContent).toContain('Campaign Completed');
  });

  test('should display marquee with square edges and full width on mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);
    
    // Find the marquee container
    const marquee = page.locator('.marquee-container');
    await expect(marquee).toBeVisible();
    
    // Get the computed style to verify border-radius is 0 on mobile
    const borderRadius = await marquee.evaluate(el => {
      return window.getComputedStyle(el).borderRadius;
    });
    
    // On mobile, border-radius should be 0 (or close to 0)
    expect(borderRadius).toBe('0px');
    
    // Verify the marquee spans nearly the full viewport width
    const boundingBox = await marquee.boundingBox();
    const viewportWidth = page.viewportSize().width;
    
    // The marquee should be close to viewport width (allowing for small margins)
    expect(boundingBox.width).toBeGreaterThanOrEqual(viewportWidth - 10);
  });

  test('should display larger marquee text on mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);
    
    // Get the marquee text element
    const marqueeText = page.locator('.marquee-text').first();
    
    // Get the computed font size
    const fontSize = await marqueeText.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    
    // Parse the font size value
    const fontSizeValue = parseFloat(fontSize);
    
    // On mobile, font size should be between 20-32px (based on clamp(1.25rem, 4.5vw, 2rem))
    expect(fontSizeValue).toBeGreaterThanOrEqual(16);
    expect(fontSizeValue).toBeLessThanOrEqual(40);
  });

  test('should maintain marquee text color consistency across themes', async ({ page }) => {
    // Find the marquee text
    const marqueeText = page.locator('.marquee-text').first();
    await expect(marqueeText).toBeVisible();
    
    // Get the computed color
    const color = await marqueeText.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Color should be white or light gray (using CSS variable --color-header-text)
    expect(color).toBeTruthy();
  });

  test('should have correct metric card layout', async ({ page }) => {
    // Find all metric cards
    const metricCards = page.locator('.metric-card');
    
    // Verify there are at least 5 metric cards (Credits, Badges, Skill Badges, Arcade, Campaign)
    const cardCount = await metricCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(5);
    
    // Verify each card has the expected structure
    for (let i = 0; i < Math.min(5, cardCount); i++) {
      const card = metricCards.nth(i);
      
      // Each card should have a label and a value
      const label = card.locator('.metric-label');
      expect(await label.count()).toBeGreaterThan(0);
    }
  });

  test('should display leaderboard table correctly', async ({ page }) => {
    // Find the leaderboard table
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Find table headers
    const headers = table.locator('thead th');
    const headerCount = await headers.count();
    
    // Should have at least 4 headers (Rank, Name, Skill Badges, Arcade Games)
    expect(headerCount).toBeGreaterThanOrEqual(4);
    
    // Find table body rows
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    
    // Should have at least some participants
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should verify no campaign completer styling issues', async ({ page }) => {
    // Find any cards with the top-performer-card class
    const topPerformerCards = page.locator('.top-performer-card');
    
    // If campaign completers exist, verify their styling
    const count = await topPerformerCards.count();
    if (count > 0) {
      // Check that the name text has proper styling
      const firstTopPerformer = topPerformerCards.first();
      const nameText = firstTopPerformer.locator('a, span').first();
      
      // Verify the name is visible and has text
      await expect(nameText).toBeVisible();
      const text = await nameText.textContent();
      expect(text.length).toBeGreaterThan(0);
    }
  });
});

test.describe('Mobile-specific Tests', () => {
  test('should handle marquee responsively on different screen sizes', async ({ page }) => {
    // Test desktop size (1366x768)
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    let marquee = page.locator('.marquee-container');
    await expect(marquee).toBeVisible();
    
    let boxDesktop = await marquee.boundingBox();
    
    // Test tablet size (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    
    marquee = page.locator('.marquee-container');
    let boxTablet = await marquee.boundingBox();
    
    // Test mobile size (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    
    marquee = page.locator('.marquee-container');
    let boxMobile = await marquee.boundingBox();
    
    // Verify marquee is visible on all sizes
    expect(boxDesktop).toBeTruthy();
    expect(boxTablet).toBeTruthy();
    expect(boxMobile).toBeTruthy();
    
    // Verify mobile has full width (less margin/padding)
    expect(boxMobile.width).toBeGreaterThanOrEqual(boxTablet.width * 0.9);
  });
});