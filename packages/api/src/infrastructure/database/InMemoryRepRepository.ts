import { GetRepsQuery } from '@velocity-zones/shared';
import { RepEntity } from '../../domain/entities/RepEntity';
import { RepRepository } from '../../domain/repositories/RepRepository';

export class InMemoryRepRepository extends RepRepository {
  private reps: RepEntity[] = [];

  async saveAsync(rep: RepEntity): Promise<RepEntity> {
    this.reps.push(rep);
    return rep;
  }

  async findByIdAsync(id: string): Promise<RepEntity | null> {
    return this.reps.find((rep) => rep.id === id) || null;
  }

  async findAllAsync(): Promise<RepEntity[]> {
    return [...this.reps];
  }

  async findByQueryAsync(query: GetRepsQuery): Promise<RepEntity[]> {
    let filteredReps = [...this.reps];

    if (query.exerciseId) {
      filteredReps = filteredReps.filter(
        (rep) => rep.exerciseId === query.exerciseId
      );
    }

    if (query.startDate) {
      filteredReps = filteredReps.filter(
        (rep) => rep.timestamp >= query.startDate!
      );
    }

    if (query.endDate) {
      filteredReps = filteredReps.filter(
        (rep) => rep.timestamp <= query.endDate!
      );
    }

    if (query.limit) {
      filteredReps = filteredReps.slice(0, query.limit);
    }

    if (query.offset) {
      filteredReps = filteredReps.slice(query.offset);
    }

    return filteredReps;
  }
}
