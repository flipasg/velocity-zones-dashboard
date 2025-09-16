import { Request, Response } from 'express';
import { GetZonesUseCase } from '../../application/usecases/GetZonesUseCase';

export class VelocityZoneController {
  constructor(private readonly getVelocityZonesUseCase: GetZonesUseCase) {}

  public getZones = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.getVelocityZonesUseCase.executeAsync();
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getZoneById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const allZones = await this.getVelocityZonesUseCase.executeAsync();
      const zone = allZones.find((z) => z.id === id);

      if (!zone) {
        res.status(404).json({ message: 'Velocity zone not found' });
        return;
      }

      res.status(200).json(zone);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    console.error('VelocityZoneController error:', error);

    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      });
    } else {
      res.status(500).json({
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      });
    }
  }
}
