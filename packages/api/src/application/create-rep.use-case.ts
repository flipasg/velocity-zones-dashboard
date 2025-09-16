import { Rep } from '../domain/entities';
import { RepRepository } from '../domain/repositories';

export interface CreateRepInput {
  exerciseId: string;
  velocity: number;
  metadata?: Record<string, unknown>;
}

export interface CreateRepOutput {
  rep: Rep;
}

export class CreateRepUseCase {
  constructor(private repRepository: RepRepository) {}

  async execute(input: CreateRepInput): Promise<CreateRepOutput> {
    const rep = Rep.create(input.exerciseId, input.velocity, input.metadata);
    const savedRep = await this.repRepository.save(rep);
    return { rep: savedRep };
  }
}
