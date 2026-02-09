import { chromium } from '@playwright/test';

/* eslint-disable sonarjs/prefer-globalthis */
// Note: globalThis.__API__ usage is intentional for mock API exploration

async function exploreWindowAPI() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://vb-bank-demo.vercel.app/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Explore the __API__ object in detail
  const apiStructure = await page.evaluate(() => {
    const api = (globalThis as any).__API__;
    if (!api) return null;
    
    const getMethodNames = (obj: any): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      return Object.keys(obj).map(key => {
        const val = obj[key];
        if (typeof val === 'function') {
          return `${key}()`;
        } else if (typeof val === 'object' && val !== null) {
          return `${key}: { ${Object.keys(val).join(', ')} }`;
        }
        return key;
      });
    };
    
    return {
      auth: getMethodNames(api.auth),
      bank: getMethodNames(api.bank),
      admin: getMethodNames(api.admin)
    };
  });
  
  console.log('__API__ Structure:');
  console.log(JSON.stringify(apiStructure, null, 2));
  
  // Test the login API
  console.log('\n--- Testing Login API ---');
  const loginResult = await page.evaluate(async () => {
    const api = (globalThis as any).__API__;
    try {
      const result = await api.auth.login('john_doe', 'password123');
      return { success: true, result };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });
  console.log('Login result:', JSON.stringify(loginResult, null, 2));
  
  // Test getting account balance after login
  if (loginResult.success) {
    console.log('\n--- Testing Bank API ---');
    const balanceResult = await page.evaluate(async () => {
      const api = (globalThis as any).__API__;
      try {
        const result = await api.bank.getBalance();
        return { success: true, result };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    });
    console.log('Balance result:', JSON.stringify(balanceResult, null, 2));
    
    const transactionsResult = await page.evaluate(async () => {
      const api = (globalThis as any).__API__;
      try {
        const result = await api.bank.getTransactions(5);
        return { success: true, result };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    });
    console.log('Transactions result:', JSON.stringify(transactionsResult, null, 2));
  }
  
  await browser.close();
}

// Execute the exploration function - using top-level await
await exploreWindowAPI();
