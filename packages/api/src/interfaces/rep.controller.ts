import { CreateRepDto, RepResponseDto } from '@velocity-zones/shared';
import { Request, Response } from 'express';
import { CreateRepUseCase } from '../application/create-rep.use-case';

export class RepController {
  constructor(private createRepUseCase: CreateRepUseCase) {}

  async createRep(req: Request, res: Response): Promise<void> {
    try {
      const createRepDto: CreateRepDto = req.body;

      const result = await this.createRepUseCase.execute({
        exerciseId: createRepDto.exerciseId,
        velocity: createRepDto.velocity,
        metadata: createRepDto.metadata,
      });

      const response: RepResponseDto = {
        id: result.rep.id,
        exerciseId: result.rep.exerciseId,
        velocity: result.rep.velocity,
        timestamp: result.rep.timestamp.toISOString(),
        metadata: result.rep.metadata,
      };

      res.status(201).json(response);
    } catch {
      res.status(500).json({
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      });
    }
  }
}
