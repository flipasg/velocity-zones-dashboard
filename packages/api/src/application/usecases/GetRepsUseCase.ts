import { GetRepsQuery, RepResponseDto } from '@velocity-zones/shared';
import { RepRepository } from '../../domain/repositories/RepRepository';

export interface GetRepsUseCase {
  executeAsync(query?: GetRepsQuery): Promise<RepResponseDto[]>;
}

export class GetRepsUseCaseImpl implements GetRepsUseCase {
  constructor(private readonly repRepository: RepRepository) {}

  async executeAsync(query?: GetRepsQuery): Promise<RepResponseDto[]> {
    const reps = await this.repRepository.findByQueryAsync(query || {});

    return reps.map((rep) => ({
      id: rep.id,
      exerciseId: rep.exerciseId,
      velocity: rep.velocity,
      timestamp: rep.timestamp.toISOString(),
      metadata: rep.metadata,
    }));
  }
}
