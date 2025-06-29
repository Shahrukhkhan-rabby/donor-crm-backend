import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all donors
app.get('/donors', async (req, res) => {
  const donors = await prisma.donor.findMany();
  res.json(donors);
});

// Create a new donor
app.post('/donors', async (req, res) => {
  const { name, email, amount } = req.body;
  try {
    const donor = await prisma.donor.create({
      data: { name, email, amount: Number(amount) },
    });
    res.status(201).json(donor);
  } catch (error) {
    res.status(400).json({ error: 'Could not create donor' });
  }
});

// Update donor
app.put('/donors/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, amount } = req.body;
  try {
    const donor = await prisma.donor.update({
      where: { id },
      data: { name, email, amount: Number(amount) },
    });
    res.json(donor);
  } catch (error) {
    res.status(404).json({ error: 'Donor not found' });
  }
});

// Delete donor
app.delete('/donors/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.donor.delete({ where: { id } });
    res.json({ message: 'Donor deleted' });
  } catch (error) {
    res.status(404).json({ error: 'Donor not found' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
