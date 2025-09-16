import { VelocityZone } from '../domain/entities';
import { VelocityZoneRepository } from '../domain/repositories';

export class InMemoryVelocityZoneRepository implements VelocityZoneRepository {
  private zones: VelocityZone[] = [
    VelocityZone.create(
      'Strength',
      0.0,
      0.3,
      '#ff4444',
      'Heavy resistance training zone'
    ),
    VelocityZone.create('Power', 0.3, 0.6, '#ffaa00', 'Power development zone'),
    VelocityZone.create(
      'Speed-Strength',
      0.6,
      1.0,
      '#44ff44',
      'Speed-strength development zone'
    ),
    VelocityZone.create('Speed', 1.0, 2.0, '#4444ff', 'Maximum speed zone'),
  ];

  async findAll(): Promise<VelocityZone[]> {
    return [...this.zones];
  }
}
