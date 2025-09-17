import type {
  ParamsDictionary,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express-serve-static-core';
import { GetZonesUseCase } from '../../application/usecases/GetZonesUseCase';

type Request = ExpressRequest<
  ParamsDictionary,
  any,
  any,
  Record<string, unknown>
>;
type Response = ExpressResponse;

export class VelocityZoneController {
  constructor(private readonly getVelocityZonesUseCase: GetZonesUseCase) {}

  /**
   * @swagger
   * /zones:
   *   get:
   *     summary: Get all velocity zones
   *     tags: [Velocity Zones]
   *     description: Retrieve all available velocity zones with their thresholds and colors
   *     responses:
   *       200:
   *         description: List of velocity zones
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/ZoneResponseDto'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  public getZones = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.getVelocityZonesUseCase.executeAsync();
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * @swagger
   * /zones/{id}:
   *   get:
   *     summary: Get velocity zone by ID
   *     tags: [Velocity Zones]
   *     description: Retrieve a specific velocity zone by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The velocity zone ID
   *     responses:
   *       200:
   *         description: Velocity zone details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ZoneResponseDto'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
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
