// Shared Response DTOs - Used by both API and Web packages
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

export interface ExerciseResponseDto {
  id: string;
  name: string;
  description?: string;
}

// Shared Request DTOs - Used by both API and Web packages
export interface CreateRepDto {
  exerciseId: string;
  velocity: number;
  metadata?: Record<string, unknown>;
}

export interface CreateExerciseDto {
  name: string;
  description?: string;
}

// Shared Query DTOs - Used by both API and Web packages
export interface GetRepsQuery {
  exerciseId?: string;
  startDate?: Date;
  endDate?: Date;
  zoneId?: string;
  limit?: number;
  offset?: number;
}

export interface GetZonesQuery {
  includeRepCount?: boolean;
}

// Shared Error types - Used by both API and Web packages
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}
