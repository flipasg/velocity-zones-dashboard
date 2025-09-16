import { VelocityZoneEntity } from '../../domain/entities/VelocityZoneEntity';
import { VelocityZoneRepository } from '../../domain/repositories/VelocityZoneRepository';
import { DatabaseConfig } from './DatabaseConfig';

export class PersistentVelocityZoneRepository extends VelocityZoneRepository {
  async findAllAsync(): Promise<VelocityZoneEntity[]> {
    const data = await DatabaseConfig.readData();
    
    return data.zones.map(zone => 
      VelocityZoneEntity.fromPersistence(
        zone.id,
        zone.name,
        zone.minVelocity,
        zone.maxVelocity,
        zone.color,
        zone.description
      )
    );
  }

  async findByIdAsync(id: string): Promise<VelocityZoneEntity | null> {
    const data = await DatabaseConfig.readData();
    const zone = data.zones.find(z => z.id === id);
    
    if (!zone) {
      return null;
    }

    return VelocityZoneEntity.fromPersistence(
      zone.id,
      zone.name,
      zone.minVelocity,
      zone.maxVelocity,
      zone.color,
      zone.description
    );
  }

  async saveAsync(zone: VelocityZoneEntity): Promise<VelocityZoneEntity> {
    const data = await DatabaseConfig.readData();
    
    const zoneData = {
      id: zone.id,
      name: zone.name,
      minVelocity: zone.minVelocity,
      maxVelocity: zone.maxVelocity,
      color: zone.color,
      description: zone.description
    };

    // Check if zone already exists
    const existingIndex = data.zones.findIndex(z => z.id === zone.id);
    if (existingIndex >= 0) {
      data.zones[existingIndex] = zoneData;
    } else {
      data.zones.push(zoneData);
    }

    await DatabaseConfig.writeData(data);
    return zone;
  }
}