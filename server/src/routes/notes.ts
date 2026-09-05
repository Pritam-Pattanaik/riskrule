import { Router } from 'express';
import { prisma } from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: any, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/', authenticate, async (req: any, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const note = await prisma.note.create({
      data: { userId: req.userId, title, content, category, tags }
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// C-4 fix: Added userId ownership filter to prevent IDOR
router.patch('/:id', authenticate, async (req: any, res) => {
  try {
    const { title, content, category, tags, isFavorite, isPinned, isArchived } = req.body;
    // Verify ownership before updating
    const existing = await prisma.note.findFirst({ where: { id: req.params.id, userId: req.userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { title, content, category, tags, isFavorite, isPinned, isArchived, updatedAt: new Date() }
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// C-4 fix: Added userId ownership filter to prevent IDOR
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const result = await prisma.note.deleteMany({ where: { id: req.params.id, userId: req.userId } });
    if (result.count === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
