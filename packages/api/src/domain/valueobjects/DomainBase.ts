export interface IDomainEvent {
  readonly occurredOn: Date;
  readonly eventType: string;
}

export interface IAggregateRoot {
  addDomainEvent(event: IDomainEvent): void;
  getDomainEvents(): IDomainEvent[];
  clearDomainEvents(): void;
}
