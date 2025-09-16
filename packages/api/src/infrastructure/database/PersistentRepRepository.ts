import { RepEntity } from '../../domain/entities/RepEntity';
import { RepRepository } from '../../domain/repositories/RepRepository';
import { GetRepsQuery } from '@velocity-zones/shared';
import { DatabaseConfig } from './DatabaseConfig';

export class PersistentRepRepository extends RepRepository {
  async findAllAsync(): Promise<RepEntity[]> {
    const data = await DatabaseConfig.readData();
    
    return data.reps.map(rep => 
      RepEntity.fromPersistence(
        rep.id,
        rep.exerciseId,
        rep.velocity,
        new Date(rep.timestamp),
        rep.metadata
      )
    );
  }

  async findByIdAsync(id: string): Promise<RepEntity | null> {
    const data = await DatabaseConfig.readData();
    const rep = data.reps.find(r => r.id === id);
    
    if (!rep) {
      return null;
    }

    return RepEntity.fromPersistence(
      rep.id,
      rep.exerciseId,
      rep.velocity,
      new Date(rep.timestamp),
      rep.metadata
    );
  }

  async findByQueryAsync(query: GetRepsQuery): Promise<RepEntity[]> {
    const data = await DatabaseConfig.readData();
    let reps = data.reps;

    // Apply filters if query is provided
    if (query.exerciseId) {
      reps = reps.filter(rep => rep.exerciseId === query.exerciseId);
    }
    if (query.startDate) {
      reps = reps.filter(rep => new Date(rep.timestamp) >= query.startDate!);
    }
    if (query.endDate) {
      reps = reps.filter(rep => new Date(rep.timestamp) <= query.endDate!);
    }
    if (query.offset) {
      reps = reps.slice(query.offset);
    }
    if (query.limit) {
      reps = reps.slice(0, query.limit);
    }

    return reps.map(rep => 
      RepEntity.fromPersistence(
        rep.id,
        rep.exerciseId,
        rep.velocity,
        new Date(rep.timestamp),
        rep.metadata
      )
    );
  }

  async saveAsync(rep: RepEntity): Promise<RepEntity> {
    const data = await DatabaseConfig.readData();
    
    const repData = {
      id: rep.id,
      exerciseId: rep.exerciseId,
      velocity: rep.velocity,
      timestamp: rep.timestamp.toISOString(),
      metadata: rep.metadata
    };

    // Check if rep already exists
    const existingIndex = data.reps.findIndex(r => r.id === rep.id);
    if (existingIndex >= 0) {
      data.reps[existingIndex] = repData;
    } else {
      data.reps.push(repData);
    }

    await DatabaseConfig.writeData(data);
    return rep;
  }
}