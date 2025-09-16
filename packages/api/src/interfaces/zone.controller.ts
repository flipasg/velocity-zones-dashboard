import { ZoneResponseDto } from '@velocity-zones/shared';
import { Request, Response } from 'express';
import { GetZonesUseCase } from '../application/get-zones.use-case';

export class ZoneController {
  constructor(private getZonesUseCase: GetZonesUseCase) {}

  async getZones(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getZonesUseCase.execute();

      const response: ZoneResponseDto[] = result.zones.map(
        ({ zone, repCount }) => ({
          id: zone.id,
          name: zone.name,
          minVelocity: zone.minVelocity,
          maxVelocity: zone.maxVelocity,
          color: zone.color,
          description: zone.description,
          repCount,
        })
      );

      res.json(response);
    } catch {
      res.status(500).json({
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      });
    }
  }
}
