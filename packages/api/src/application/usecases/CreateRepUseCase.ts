import { CreateRepDto, RepResponseDto } from '@velocity-zones/shared';
import { RepEntity, VelocityValue } from '../../domain/entities/RepEntity';
import { RepRepository } from '../../domain/repositories/RepRepository';

export interface CreateRepUseCase {
  executeAsync(dto: CreateRepDto): Promise<RepResponseDto>;
}

export class CreateRepUseCaseImpl implements CreateRepUseCase {
  constructor(private readonly repRepository: RepRepository) {}

  async executeAsync(dto: CreateRepDto): Promise<RepResponseDto> {
    const velocityValue = VelocityValue.create(dto.velocity);
    const repEntity = RepEntity.create(
      dto.exerciseId,
      velocityValue,
      dto.metadata
    );

    const savedRep = await this.repRepository.saveAsync(repEntity);

    return {
      id: savedRep.id,
      exerciseId: savedRep.exerciseId,
      velocity: savedRep.velocity,
      timestamp: savedRep.timestamp.toISOString(),
      metadata: savedRep.metadata,
    };
  }
}
