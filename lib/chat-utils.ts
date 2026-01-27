import { prisma } from "./prisma";
import { nanoid } from "nanoid";

const CHAT_TTL_MINUTES = 30;

/**
 * Create new chat session
 */
export async function createChatSession() {
  const expiresAt = new Date(Date.now() + CHAT_TTL_MINUTES * 60 * 1000);

  const chat = await prisma.chat.create({
    data: {
      key: nanoid(16),
      expiresAt,
    },
  });

  return chat;
}

export async function getChatById(chatId: string) {
  return prisma.chat.findUnique({
    where: { id: chatId },
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
 * Mark messages as delivered (one-time)
 */
export async function markMessagesAsDelivered(messageIds: string[]) {
  // if (messageIds.length === 0) return;

  // await prisma.message.updateMany({
  //   where: { id: { in: messageIds } },
  //   data: { delivered: true },
  // });

  console.log(`Marked ${messageIds.length} messages as delivered.`);
}

/**
 * Cleanup expired chats
 */
export async function cleanupExpiredChats() {
  const now = new Date();

  await prisma.chat.deleteMany({
    where: {
      expiresAt: { lt: now },
    },
  });

  console.log("Cleaned up expired chats.");
}
