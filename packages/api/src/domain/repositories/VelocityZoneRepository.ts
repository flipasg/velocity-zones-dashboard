import { VelocityZoneEntity } from '../entities/VelocityZoneEntity';

export abstract class VelocityZoneRepository {
  abstract findAllAsync(): Promise<VelocityZoneEntity[]>;
  abstract findByIdAsync(id: string): Promise<VelocityZoneEntity | null>;
  abstract saveAsync(zone: VelocityZoneEntity): Promise<VelocityZoneEntity>;
}
