import { CreateRepDto, GetRepsQuery } from '@velocity-zones/shared';
import type {
  ParamsDictionary,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express-serve-static-core';
import { CreateRepUseCase } from '../../application/usecases/CreateRepUseCase';
import { GetRepsUseCase } from '../../application/usecases/GetRepsUseCase';

type Request = ExpressRequest<
  ParamsDictionary,
  any,
  any,
  Record<string, unknown>
>;
type Response = ExpressResponse;

export class RepController {
  constructor(
    private readonly createRepUseCase: CreateRepUseCase,
    private readonly getRepsUseCase: GetRepsUseCase
  ) {}

  /**
   * @swagger
   * /reps:
   *   post:
   *     summary: Create a new rep
   *     tags: [Reps]
   *     description: Create a new exercise repetition with velocity tracking
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRepDto'
   *     responses:
   *       201:
   *         description: Rep created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RepResponseDto'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  public createRep = async (req: Request, res: Response): Promise<void> => {
    try {
      const createRepDto: CreateRepDto = req.body;

      const result = await this.createRepUseCase.executeAsync(createRepDto);

      res.status(201).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * @swagger
   * /reps:
   *   get:
   *     summary: Get all reps
   *     tags: [Reps]
   *     description: Retrieve exercise repetitions with optional filtering
   *     parameters:
   *       - in: query
   *         name: exerciseId
   *         schema:
   *           type: string
   *         description: Filter by exercise ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by start date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by end date
   *       - in: query
   *         name: zoneId
   *         schema:
   *           type: string
   *         description: Filter by velocity zone ID
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Limit number of results
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           minimum: 0
   *         description: Offset for pagination
   *     responses:
   *       200:
   *         description: List of reps
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RepResponseDto'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
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

  /**
   * @swagger
   * /reps/{id}:
   *   get:
   *     summary: Get rep by ID
   *     tags: [Reps]
   *     description: Retrieve a specific exercise repetition by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The rep ID
   *     responses:
   *       200:
   *         description: Rep details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RepResponseDto'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
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
