import { GetRepsQuery } from '@velocity-zones/shared';
import { RepEntity } from '../entities/RepEntity';

export abstract class RepRepository {
  abstract saveAsync(rep: RepEntity): Promise<RepEntity>;
  abstract findByIdAsync(id: string): Promise<RepEntity | null>;
  abstract findAllAsync(): Promise<RepEntity[]>;
  abstract findByQueryAsync(query: GetRepsQuery): Promise<RepEntity[]>;
}
