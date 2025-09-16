import { ZoneResponseDto } from '@velocity-zones/shared';
import { RepRepository } from '../../domain/repositories/RepRepository';
import { VelocityZoneRepository } from '../../domain/repositories/VelocityZoneRepository';
import { RepDomainService } from '../../domain/services/RepDomainService';

export interface GetZonesUseCase {
  executeAsync(): Promise<ZoneResponseDto[]>;
}

export class GetZonesUseCaseImpl implements GetZonesUseCase {
  constructor(
    private readonly velocityZoneRepository: VelocityZoneRepository,
    private readonly repRepository: RepRepository
  ) {}

  async executeAsync(): Promise<ZoneResponseDto[]> {
    const zones = await this.velocityZoneRepository.findAllAsync();
    const reps = await this.repRepository.findByQueryAsync({});

    const distribution = RepDomainService.calculateZoneDistribution(
      reps,
      zones
    );

    return zones.map((zone) => ({
      id: zone.id,
      name: zone.name,
      minVelocity: zone.minVelocity,
      maxVelocity: zone.maxVelocity,
      color: zone.color,
      description: zone.description,
      repCount: distribution.get(zone.id) || 0,
    }));
  }
}
