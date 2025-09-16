// Domain entities and value objects
export interface Rep {
  id: string;
  exerciseId: string;
  velocity: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
}

export interface VelocityZone {
  id: string;
  name: string;
  minVelocity: number;
  maxVelocity: number;
  color: string;
  description?: string;
}

// API DTOs
export interface CreateRepDto {
  exerciseId: string;
  velocity: number;
  metadata?: Record<string, unknown>;
}

export interface RepResponseDto {
  id: string;
  exerciseId: string;
  velocity: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ZoneResponseDto {
  id: string;
  name: string;
  minVelocity: number;
  maxVelocity: number;
  color: string;
  description?: string;
  repCount: number;
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
