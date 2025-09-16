import { v4 as uuidv4 } from 'uuid';
import { IAggregateRoot, IDomainEvent } from '../valueobjects/DomainBase';

// Internal domain interfaces - not exported to shared package
interface RepEntityInterface {
  id: string;
  exerciseId: string;
  velocity: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

interface VelocityValueInterface {
  value: number;
  unit: string;
}

export class VelocityValue implements VelocityValueInterface {
  private constructor(
    public readonly value: number,
    public readonly unit: string = 'm/s'
  ) {
    this.validateVelocity(value);
  }

  public static create(value: number, unit: string = 'm/s'): VelocityValue {
    return new VelocityValue(value, unit);
  }

  private validateVelocity(value: number): void {
    if (value < 0) {
      throw new Error('Velocity cannot be negative');
    }
    if (value > 10) {
      throw new Error('Velocity exceeds maximum allowed value');
    }
  }

  public equals(other: VelocityValue): boolean {
    return this.value === other.value && this.unit === other.unit;
  }
}

export class RepCreatedEvent implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventType: string = 'RepCreated';

  constructor(
    public readonly repId: string,
    public readonly exerciseId: string,
    public readonly velocity: number
  ) {
    this.occurredOn = new Date();
  }
}

export class RepEntity implements RepEntityInterface, IAggregateRoot {
  private _domainEvents: IDomainEvent[] = [];

  private constructor(
    public readonly id: string,
    public readonly exerciseId: string,
    public readonly velocity: number,
    public readonly timestamp: Date,
    public readonly metadata?: Record<string, unknown>
  ) {}

  public static create(
    exerciseId: string,
    velocity: VelocityValue,
    metadata?: Record<string, unknown>
  ): RepEntity {
    const id = uuidv4();
    const rep = new RepEntity(
      id,
      exerciseId,
      velocity.value,
      new Date(),
      metadata
    );

    rep.addDomainEvent(new RepCreatedEvent(id, exerciseId, velocity.value));

    return rep;
  }

  public static fromPersistence(
    id: string,
    exerciseId: string,
    velocity: number,
    timestamp: Date,
    metadata?: Record<string, unknown>
  ): RepEntity {
    return new RepEntity(id, exerciseId, velocity, timestamp, metadata);
  }

  public getVelocityValue(): VelocityValue {
    return VelocityValue.create(this.velocity);
  }

  public updateMetadata(metadata: Record<string, unknown>): RepEntity {
    return new RepEntity(
      this.id,
      this.exerciseId,
      this.velocity,
      this.timestamp,
      { ...this.metadata, ...metadata }
    );
  }

  public addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  public getDomainEvents(): IDomainEvent[] {
    return [...this._domainEvents];
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
