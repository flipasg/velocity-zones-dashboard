import { v4 as uuidv4 } from 'uuid';

export class Rep {
  constructor(
    public readonly id: string,
    public readonly exerciseId: string,
    public readonly velocity: number,
    public readonly timestamp: Date,
    public readonly metadata?: Record<string, unknown>
  ) {}

  static create(
    exerciseId: string,
    velocity: number,
    metadata?: Record<string, unknown>
  ): Rep {
    return new Rep(uuidv4(), exerciseId, velocity, new Date(), metadata);
  }
}

export class Exercise {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string
  ) {}

  static create(name: string, description?: string): Exercise {
    return new Exercise(uuidv4(), name, description);
  }
}

export class VelocityZone {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly minVelocity: number,
    public readonly maxVelocity: number,
    public readonly color: string,
    public readonly description?: string
  ) {}

  static create(
    name: string,
    minVelocity: number,
    maxVelocity: number,
    color: string,
    description?: string
  ): VelocityZone {
    return new VelocityZone(
      uuidv4(),
      name,
      minVelocity,
      maxVelocity,
      color,
      description
    );
  }

  containsVelocity(velocity: number): boolean {
    return velocity >= this.minVelocity && velocity <= this.maxVelocity;
  }
}
