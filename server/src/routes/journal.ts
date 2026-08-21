import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { ContextService } from '../lib/ai/ContextService';

const router = Router();

function formatEntry(entry: any) {
  if (!entry) return null;
  const dateStr = entry.date instanceof Date
    ? entry.date.toISOString().split('T')[0]
    : (typeof entry.date === 'string' ? entry.date.split('T')[0] : entry.date);
  return {
    ...entry,
    date: dateStr,
  };
}

// GET /api/journal
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await prisma.journalEntry.findMany({
      where: { userId: req.userId! },
      orderBy: { date: 'desc' },
    });
    res.json(result.map(formatEntry));
  } catch (err: any) {
    console.error('Get journal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journal (Upsert by userId + date)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const targetDate = new Date(body.date);

    // Check if an entry already exists for this user and date
    const existing = await prisma.journalEntry.findFirst({
      where: {
        userId: req.userId!,
        date: targetDate,
      },
    });

    let entry;
    if (existing) {
      entry = await prisma.journalEntry.update({
        where: { id: existing.id },
        data: {
          marketBias: body.marketBias !== undefined ? body.marketBias : existing.marketBias,
          keyLevels: body.keyLevels !== undefined ? body.keyLevels : existing.keyLevels,
          watchlist: body.watchlist !== undefined ? body.watchlist : existing.watchlist,
          newsNotes: body.newsNotes !== undefined ? body.newsNotes : existing.newsNotes,
          reflection: body.reflection !== undefined ? body.reflection : existing.reflection,
          whatWentWell: body.whatWentWell !== undefined ? body.whatWentWell : existing.whatWentWell,
          whatToImprove: body.whatToImprove !== undefined ? body.whatToImprove : existing.whatToImprove,
          mood: body.mood !== undefined ? body.mood : existing.mood,
          overallDiscipline: body.overallDiscipline !== undefined ? body.overallDiscipline : existing.overallDiscipline,
          updatedAt: new Date(),
        },
      });
    } else {
      entry = await prisma.journalEntry.create({
        data: {
          userId: req.userId!,
          date: targetDate,
          marketBias: body.marketBias || null,
          keyLevels: body.keyLevels || null,
          watchlist: body.watchlist || null,
          newsNotes: body.newsNotes || null,
          reflection: body.reflection || null,
          whatWentWell: body.whatWentWell || null,
          whatToImprove: body.whatToImprove || null,
          mood: body.mood || null,
          overallDiscipline: body.overallDiscipline || null,
        },
      });
    }

    ContextService.invalidateUserCache(req.userId!).catch(() => {});
    res.status(201).json(formatEntry(entry));
  } catch (err: any) {
    console.error('Create/Upsert journal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/journal/:id
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const body = req.body;

    const existing = await prisma.journalEntry.findFirst({
      where: { id, userId: req.userId! },
    });
    if (!existing) { res.status(404).json({ error: 'Journal entry not found' }); return; }

    const updated = await prisma.journalEntry.update({
      where: { id },
      data: {
        marketBias: body.marketBias,
        keyLevels: body.keyLevels,
        watchlist: body.watchlist,
        newsNotes: body.newsNotes,
        reflection: body.reflection,
        whatWentWell: body.whatWentWell,
        whatToImprove: body.whatToImprove,
        mood: body.mood,
        overallDiscipline: body.overallDiscipline,
        updatedAt: new Date(),
      },
    });

    ContextService.invalidateUserCache(req.userId!).catch(() => {});
    res.json(formatEntry(updated));
  } catch (err: any) {
    console.error('Update journal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/journal/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.journalEntry.deleteMany({
      where: { id, userId: req.userId! },
    });

    ContextService.invalidateUserCache(req.userId!).catch(() => {});
    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete journal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
