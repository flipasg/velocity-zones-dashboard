import { Rep } from './entities';

export interface RepRepository {
  save(rep: Rep): Promise<Rep>;
  findById(id: string): Promise<Rep | null>;
  findAll(): Promise<Rep[]>;
  findByExerciseId(exerciseId: string): Promise<Rep[]>;
}

export interface VelocityZoneRepository {
  findAll(): Promise<import('./entities').VelocityZone[]>;
}
