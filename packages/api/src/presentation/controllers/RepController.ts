import { CreateRepDto, GetRepsQuery } from '@velocity-zones/shared';
import { Request, Response } from 'express';
import { CreateRepUseCase } from '../../application/usecases/CreateRepUseCase';
import { GetRepsUseCase } from '../../application/usecases/GetRepsUseCase';

export class RepController {
  constructor(
    private readonly createRepUseCase: CreateRepUseCase,
    private readonly getRepsUseCase: GetRepsUseCase
  ) {}

  public createRep = async (req: Request, res: Response): Promise<void> => {
    try {
      const createRepDto: CreateRepDto = req.body;

      const result = await this.createRepUseCase.executeAsync(createRepDto);

      res.status(201).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getReps = async (req: Request, res: Response): Promise<void> => {
    try {
      const query: GetRepsQuery = {
        exerciseId: req.query.exerciseId as string,
        startDate: req.query.startDate
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: req.query.endDate
          ? new Date(req.query.endDate as string)
          : undefined,
        zoneId: req.query.zoneId as string,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        offset: req.query.offset
          ? parseInt(req.query.offset as string)
          : undefined,
      };

      // Remove undefined values
      const cleanQuery = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== undefined)
      ) as GetRepsQuery;

      const result = await this.getRepsUseCase.executeAsync(
        Object.keys(cleanQuery).length > 0 ? cleanQuery : undefined
      );

      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getRepById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const query: GetRepsQuery = {};
      const allReps = await this.getRepsUseCase.executeAsync(query);
      const rep = allReps.find((r) => r.id === id);

      if (!rep) {
        res.status(404).json({ message: 'Rep not found' });
        return;
      }

      res.status(200).json(rep);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    console.error('RepController error:', error);

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
