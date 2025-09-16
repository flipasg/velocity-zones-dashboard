import { VelocityZoneEntity } from '../entities/VelocityZoneEntity';

export class RepDomainService {
  public static calculateZoneDistribution(
    reps: Array<{ velocity: number }>,
    zones: VelocityZoneEntity[]
  ): Map<string, number> {
    const distribution = new Map<string, number>();

    // Initialize all zones with 0 count
    zones.forEach((zone) => distribution.set(zone.id, 0));

    // Count reps in each zone
    reps.forEach((rep) => {
      const zone = this.findZoneForVelocity(rep.velocity, zones);
      if (zone) {
        const currentCount = distribution.get(zone.id) || 0;
        distribution.set(zone.id, currentCount + 1);
      }
    });

    return distribution;
  }

  private static findZoneForVelocity(
    velocity: number,
    zones: VelocityZoneEntity[]
  ): VelocityZoneEntity | null {
    return (
      zones.find(
        (zone) => velocity >= zone.minVelocity && velocity <= zone.maxVelocity
      ) || null
    );
  }
}
