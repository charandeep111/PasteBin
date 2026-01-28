import { headers } from 'next/headers';

export function getCurrentTime(): number {
  if (process.env.TEST_MODE === '1') {
    const headerList = headers();
    const testNow = headerList.get('x-test-now-ms');
    if (testNow) {
      const parsed = parseInt(testNow, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return Date.now();
}
