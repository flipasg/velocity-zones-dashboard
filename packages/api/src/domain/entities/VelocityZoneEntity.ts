import { v4 as uuidv4 } from 'uuid';

// Internal domain interface - not exported to shared package
interface VelocityZoneEntityInterface {
  id: string;
  name: string;
  minVelocity: number;
  maxVelocity: number;
  color: string;
  description?: string;
}

export class VelocityZoneEntity implements VelocityZoneEntityInterface {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly minVelocity: number,
    public readonly maxVelocity: number,
    public readonly color: string,
    public readonly description?: string
  ) {}

  public static create(
    name: string,
    minVelocity: number,
    maxVelocity: number,
    color: string,
    description?: string
  ): VelocityZoneEntity {
    return new VelocityZoneEntity(
      uuidv4(),
      name,
      minVelocity,
      maxVelocity,
      color,
      description
    );
  }

  public static fromPersistence(
    id: string,
    name: string,
    minVelocity: number,
    maxVelocity: number,
    color: string,
    description?: string
  ): VelocityZoneEntity {
    return new VelocityZoneEntity(
      id,
      name,
      minVelocity,
      maxVelocity,
      color,
      description
    );
  }

  public containsVelocity(velocity: number): boolean {
    return velocity >= this.minVelocity && velocity <= this.maxVelocity;
  }

  public isValidRange(): boolean {
    return this.minVelocity < this.maxVelocity;
  }

  public overlapsWithRange(minVel: number, maxVel: number): boolean {
    return !(maxVel < this.minVelocity || minVel > this.maxVelocity);
  }
}
