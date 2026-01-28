import { prisma } from "./prisma";
import { nanoid } from "nanoid";

const CHAT_TTL_MINUTES = 30;

/**
 * Create new chat session
 */
export async function createChatSession() {
  const expiresAt = new Date(Date.now() + CHAT_TTL_MINUTES * 60 * 1000);

  return prisma.chat.create({
    data: {
      key: nanoid(5), // 🔑 shareable short key
      expiresAt,
    },
  });
}

/**
 * Get chat by DATABASE ID (internal use)
 */
export async function getChatById(chatId: string) {
  return prisma.chat.findUnique({
    where: { id: chatId },
  });
}

/**
 * ✅ Get chat by SHARE KEY (URL-safe)
 */
export async function getChatByKey(key: string) {
  return prisma.chat.findUnique({
    where: { key },
  });
}

/**
 * Store message
 */
export async function storeMessage(chatId: string, content: string) {
  return prisma.message.create({
    data: {
      chatId,
      content,
    },
  });
}

/**
 * Get undelivered messages
 */
export async function getUndeliveredMessages(chatId: string) {
  return prisma.message.findMany({
    where: {
      chatId,
      delivered: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

/**
 * Mark messages as delivered
 */
export async function markMessagesAsDelivered(messageIds: string[]) {
  // enable later if needed
  console.log(`Marked ${messageIds.length} messages as delivered.`);
}

/**
 * Cleanup expired chats
 */
export async function cleanupExpiredChats() {
  await prisma.chat.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
}
