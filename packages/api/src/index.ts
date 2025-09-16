import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { CreateRepUseCase } from './application/create-rep.use-case';
import { GetZonesUseCase } from './application/get-zones.use-case';
import { InMemoryRepRepository } from './infrastructure/in-memory-rep.repository';
import { InMemoryVelocityZoneRepository } from './infrastructure/in-memory-velocity-zone.repository';
import { RepController } from './interfaces/rep.controller';
import { ZoneController } from './interfaces/zone.controller';

const app: Application = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Repositories
const repRepository = new InMemoryRepRepository();
const zoneRepository = new InMemoryVelocityZoneRepository();

// Use Cases
const createRepUseCase = new CreateRepUseCase(repRepository);
const getZonesUseCase = new GetZonesUseCase(zoneRepository, repRepository);

// Controllers
const repController = new RepController(createRepUseCase);
const zoneController = new ZoneController(getZonesUseCase);

// Routes
app.post('/reps', (req, res) => repController.createRep(req, res));
app.get('/zones', (req, res) => zoneController.getZones(req, res));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 API server running on port ${port}`);
});

export default app;
