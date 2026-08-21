import { Request, Response } from 'express';
import { prisma } from '../db';

export type NotificationCategory = 'Trading' | 'Risk' | 'Market' | 'AI' | 'Reports';
export type NotificationPriority = 'Critical' | 'Warning' | 'Success' | 'Information';
export type NotificationDisplayScope = 'global' | 'in-app' | 'both';

interface CreateNotificationDTO {
  userId: string;
  title: string;
  description: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  displayScope?: NotificationDisplayScope;
  actionLabel?: string;
  actionUrl?: string;
}

// ─── Routing Matrix ─────────────────────────────────────────────────────────
// Determines the default displayScope if caller doesn't explicitly provide one.
// Rule: Critical & Warning in Risk, Trading, Market, AI → 'both' (global + in-app)
//       Everything else (Information, Success, or Reports category) → 'in-app'
const GLOBAL_CATEGORIES: NotificationCategory[] = ['Risk', 'Trading', 'Market', 'AI'];
const GLOBAL_PRIORITIES: NotificationPriority[] = ['Critical', 'Warning'];

function resolveDisplayScope(
  category: NotificationCategory,
  priority: NotificationPriority,
  explicit?: NotificationDisplayScope
): NotificationDisplayScope {
  if (explicit) return explicit;
  // Default to 'both' so that the client routing rules & user customization govern delivery
  return 'both';
}

// ─── SSE Client Registry ────────────────────────────────────────────────────
// Store active SSE connections mapped by userId
const clients = new Map<string, Response[]>();

/**
 * Adds a new SSE connection for a user
 */
export function addClient(userId: string, req: Request, res: Response) {
  if (!clients.has(userId)) {
    clients.set(userId, []);
  }
  clients.get(userId)?.push(res);

  req.on('close', () => {
    removeClient(userId, res);
  });
}

function removeClient(userId: string, res: Response) {
  const userClients = clients.get(userId);
  if (userClients) {
    const updated = userClients.filter((client) => client !== res);
    if (updated.length === 0) {
      clients.delete(userId);
    } else {
      clients.set(userId, updated);
    }
  }
}

/**
 * Pushes a real-time event to the user if they are connected via SSE
 */
function emitToUser(userId: string, event: string, data: any) {
  const userClients = clients.get(userId);
  if (userClients) {
    userClients.forEach((client) => {
      client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    });
  }
}

/**
 * Creates a notification in the DB and instantly pushes it to the user via SSE.
 * If `displayScope` is not provided, it is automatically resolved from the
 * routing matrix (Critical/Warning in Risk/Trading/Market/AI → 'both', else 'in-app').
 */
export async function createNotification(data: CreateNotificationDTO) {
  try {
    const displayScope = resolveDisplayScope(data.category, data.priority, data.displayScope);

    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        displayScope,
        actionLabel: data.actionLabel,
        actionUrl: data.actionUrl,
        isRead: false,
      }
    });

    emitToUser(data.userId, 'new_notification', notification);
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}
