import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  baseUrl: process.env.BASE_URL || 'https://vb-bank-demo.vercel.app',

  timeouts: {
    default: Number.parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    navigation: Number.parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
    expect: Number.parseInt(process.env.EXPECT_TIMEOUT || '10000'),
  },

  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: Number.parseInt(process.env.SLOW_MO || '0'),
  },
} as const;
