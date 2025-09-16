import { VelocityZone } from '../domain/entities';
import { RepRepository, VelocityZoneRepository } from '../domain/repositories';

export interface ZoneWithRepCount {
  zone: VelocityZone;
  repCount: number;
}

export interface GetZonesOutput {
  zones: ZoneWithRepCount[];
}

export class GetZonesUseCase {
  constructor(
    private zoneRepository: VelocityZoneRepository,
    private repRepository: RepRepository
  ) {}

  async execute(): Promise<GetZonesOutput> {
    const zones = await this.zoneRepository.findAll();
    const allReps = await this.repRepository.findAll();

    const zonesWithRepCounts = zones.map((zone) => {
      const repCount = allReps.filter((rep) =>
        zone.containsVelocity(rep.velocity)
      ).length;
      return { zone, repCount };
    });

    return { zones: zonesWithRepCounts };
  }
}
