import { Rep } from '../domain/entities';
import { RepRepository } from '../domain/repositories';

export class InMemoryRepRepository implements RepRepository {
  private reps: Rep[] = [];

  async save(rep: Rep): Promise<Rep> {
    this.reps.push(rep);
    return rep;
  }

  async findById(id: string): Promise<Rep | null> {
    return this.reps.find((rep) => rep.id === id) || null;
  }

  async findAll(): Promise<Rep[]> {
    return [...this.reps];
  }

  async findByExerciseId(exerciseId: string): Promise<Rep[]> {
    return this.reps.filter((rep) => rep.exerciseId === exerciseId);
  }
}
