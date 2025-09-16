import {
  CreateRepUseCase,
  CreateRepUseCaseImpl,
} from './application/usecases/CreateRepUseCase';
import {
  GetRepsUseCase,
  GetRepsUseCaseImpl,
} from './application/usecases/GetRepsUseCase';
import {
  GetZonesUseCase,
  GetZonesUseCaseImpl,
} from './application/usecases/GetZonesUseCase';
import { RepRepository } from './domain/repositories/RepRepository';
import { VelocityZoneRepository } from './domain/repositories/VelocityZoneRepository';
import { InMemoryRepRepository } from './infrastructure/database/InMemoryRepRepository';
import { InMemoryVelocityZoneRepository } from './infrastructure/database/InMemoryVelocityZoneRepository';
import { PersistentRepRepository } from './infrastructure/database/PersistentRepRepository';
import { PersistentVelocityZoneRepository } from './infrastructure/database/PersistentVelocityZoneRepository';
import { RepController } from './presentation/controllers/RepController';
import { VelocityZoneController } from './presentation/controllers/VelocityZoneController';
import {
  HttpRoutes,
  HttpRoutesInterface,
} from './presentation/routes/HttpRoutes';

export interface DependencyContainerInterface {
  getRepRepository(): RepRepository;
  getVelocityZoneRepository(): VelocityZoneRepository;
  getCreateRepUseCase(): CreateRepUseCase;
  getGetRepsUseCase(): GetRepsUseCase;
  getGetZonesUseCase(): GetZonesUseCase;
  getRepController(): RepController;
  getVelocityZoneController(): VelocityZoneController;
  getHttpRoutes(): HttpRoutesInterface;
}

export class DependencyContainer implements DependencyContainerInterface {
  private repRepository: RepRepository | null = null;
  private velocityZoneRepository: VelocityZoneRepository | null = null;
  private createRepUseCase: CreateRepUseCase | null = null;
  private getRepsUseCase: GetRepsUseCase | null = null;
  private getZonesUseCase: GetZonesUseCase | null = null;
  private repController: RepController | null = null;
  private velocityZoneController: VelocityZoneController | null = null;
  private httpRoutes: HttpRoutesInterface | null = null;

  public getRepRepository(): RepRepository {
    if (!this.repRepository) {
      // Use in-memory for production (Vercel serverless), file-based for local development
      if (process.env.NODE_ENV === 'production') {
        this.repRepository = new InMemoryRepRepository();
      } else {
        this.repRepository = new PersistentRepRepository();
      }
    }
    return this.repRepository;
  }

  public getVelocityZoneRepository(): VelocityZoneRepository {
    if (!this.velocityZoneRepository) {
      // Use in-memory for production (Vercel serverless), file-based for local development
      if (process.env.NODE_ENV === 'production') {
        this.velocityZoneRepository = new InMemoryVelocityZoneRepository();
      } else {
        this.velocityZoneRepository = new PersistentVelocityZoneRepository();
      }
    }
    return this.velocityZoneRepository;
  }

  public getCreateRepUseCase(): CreateRepUseCase {
    if (!this.createRepUseCase) {
      this.createRepUseCase = new CreateRepUseCaseImpl(this.getRepRepository());
    }
    return this.createRepUseCase;
  }

  public getGetRepsUseCase(): GetRepsUseCase {
    if (!this.getRepsUseCase) {
      this.getRepsUseCase = new GetRepsUseCaseImpl(this.getRepRepository());
    }
    return this.getRepsUseCase;
  }

  public getGetZonesUseCase(): GetZonesUseCase {
    if (!this.getZonesUseCase) {
      this.getZonesUseCase = new GetZonesUseCaseImpl(
        this.getVelocityZoneRepository(),
        this.getRepRepository()
      );
    }
    return this.getZonesUseCase;
  }

  public getRepController(): RepController {
    if (!this.repController) {
      this.repController = new RepController(
        this.getCreateRepUseCase(),
        this.getGetRepsUseCase()
      );
    }
    return this.repController;
  }

  public getVelocityZoneController(): VelocityZoneController {
    if (!this.velocityZoneController) {
      this.velocityZoneController = new VelocityZoneController(
        this.getGetZonesUseCase()
      );
    }
    return this.velocityZoneController;
  }

  public getHttpRoutes(): HttpRoutesInterface {
    if (!this.httpRoutes) {
      this.httpRoutes = new HttpRoutes();
    }
    return this.httpRoutes;
  }
}
