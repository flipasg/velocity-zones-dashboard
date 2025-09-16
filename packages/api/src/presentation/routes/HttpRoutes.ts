import { Router } from 'express';
import { RepController } from '../controllers/RepController';
import { VelocityZoneController } from '../controllers/VelocityZoneController';

export interface HttpRoutesInterface {
  configureRoutes(
    repController: RepController,
    velocityZoneController: VelocityZoneController
  ): Router;
}

export class HttpRoutes implements HttpRoutesInterface {
  configureRoutes(
    repController: RepController,
    velocityZoneController: VelocityZoneController
  ): Router {
    const router = Router();

    // Rep routes
    router.post('/reps', repController.createRep);
    router.get('/reps', repController.getReps);
    router.get('/reps/:id', repController.getRepById);

    // Velocity zone routes
    router.get('/zones', velocityZoneController.getZones);
    router.get('/zones/:id', velocityZoneController.getZoneById);

    return router;
  }
}
