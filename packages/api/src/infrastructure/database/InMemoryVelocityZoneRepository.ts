import { VelocityZoneEntity } from '../../domain/entities/VelocityZoneEntity';
import { VelocityZoneRepository } from '../../domain/repositories/VelocityZoneRepository';

export class InMemoryVelocityZoneRepository extends VelocityZoneRepository {
  private zones: VelocityZoneEntity[] = [
    VelocityZoneEntity.create(
      'Strength',
      0.0,
      0.3,
      '#ff4444',
      'Heavy resistance training zone'
    ),
    VelocityZoneEntity.create(
      'Power',
      0.3,
      0.6,
      '#ffaa00',
      'Power development zone'
    ),
    VelocityZoneEntity.create(
      'Speed-Strength',
      0.6,
      1.0,
      '#44ff44',
      'Speed-strength development zone'
    ),
    VelocityZoneEntity.create(
      'Speed',
      1.0,
      2.0,
      '#4444ff',
      'Maximum speed zone'
    ),
  ];

  async findAllAsync(): Promise<VelocityZoneEntity[]> {
    return [...this.zones];
  }

  async findByIdAsync(id: string): Promise<VelocityZoneEntity | null> {
    return this.zones.find((zone) => zone.id === id) || null;
  }

  async saveAsync(zone: VelocityZoneEntity): Promise<VelocityZoneEntity> {
    this.zones.push(zone);
    return zone;
  }
}
