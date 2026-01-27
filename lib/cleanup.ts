import { cleanupExpiredChats } from './chat-utils';

export async function runCleanup(): Promise<void> {
  try {
    await cleanupExpiredChats();
    console.log('Cleanup job completed successfully');
  } catch (error) {
    console.error('Cleanup job failed:', error);
  }
}

export function scheduleCleanup(intervalMs: number = 60000): NodeJS.Timeout {
  return setInterval(() => {
    runCleanup();
  }, intervalMs);
}
