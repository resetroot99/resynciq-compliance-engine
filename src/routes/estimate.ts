import { Router } from 'express';
import { databaseService } from '../services/database/DatabaseService';
import { autoCorrectEstimate, predictApproval, parseEstimateFromPDF } from '../services/aiService';
import multer from 'multer';

const router = Router();
const upload = multer();

// Create a new estimate
router.post('/', async (req, res) => {
  try {
    const estimate = await databaseService.createEstimate(req.body);
    res.status(201).json(estimate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create estimate' });
  }
});

// Get all estimates
router.get('/', async (req, res) => {
  try {
    const estimates = await databaseService.getEstimates();
    res.status(200).json(estimates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch estimates' });
  }
});

// Get a single estimate by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const estimate = await databaseService.getEstimate(parseInt(id));
    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }
    res.status(200).json(estimate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch estimate' });
  }
});

// Update an estimate
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { operations, parts } = req.body;

  try {
    const updatedEstimate = await databaseService.updateEstimate(parseInt(id), { operations, parts });
    res.status(200).json(updatedEstimate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update estimate' });
  }
});

// Delete an estimate
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await databaseService.deleteEstimate(parseInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete estimate' });
  }
});

// Auto-correct an estimate
router.post('/auto-correct', async (req, res) => {
  const { estimate } = req.body;

  try {
    const correctedEstimate = await autoCorrectEstimate(estimate);
    res.status(200).json(correctedEstimate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to auto-correct estimate' });
  }
});

// Predict approval for an estimate
router.post('/predict-approval', async (req, res) => {
  const { estimate } = req.body;

  try {
    const approvalPrediction = await predictApproval(estimate);
    res.status(200).json({ approvalPrediction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to predict approval' });
  }
});

// Upload and parse PDF estimate
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const estimate = await parseEstimateFromPDF(req.file.buffer);
    res.status(200).json(estimate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse PDF estimate' });
  }
});

// Add this route to test database connection
router.get('/test-db', async (req, res) => {
  try {
    const company = await databaseService.prisma.company.findFirst();
    res.json({ message: 'Database connection successful', company });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

export { router as estimateRouter }; 