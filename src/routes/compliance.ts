import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a new compliance check
router.post('/', async (req, res) => {
  const { estimateId, score, issues } = req.body;

  try {
    const complianceCheck = await prisma.complianceCheck.create({
      data: {
        score,
        issues,
        estimateId,
      },
    });
    res.status(201).json(complianceCheck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create compliance check' });
  }
});

// Get all compliance checks
router.get('/', async (req, res) => {
  try {
    const complianceChecks = await prisma.complianceCheck.findMany();
    res.status(200).json(complianceChecks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance checks' });
  }
});

// Get a single compliance check by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const complianceCheck = await prisma.complianceCheck.findUnique({
      where: { id: parseInt(id) },
    });
    if (!complianceCheck) {
      return res.status(404).json({ error: 'Compliance check not found' });
    }
    res.status(200).json(complianceCheck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance check' });
  }
});

// Update a compliance check
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { score, issues } = req.body;

  try {
    const updatedComplianceCheck = await prisma.complianceCheck.update({
      where: { id: parseInt(id) },
      data: { score, issues },
    });
    res.status(200).json(updatedComplianceCheck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update compliance check' });
  }
});

// Delete a compliance check
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.complianceCheck.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete compliance check' });
  }
});

export { router as complianceRouter }; 