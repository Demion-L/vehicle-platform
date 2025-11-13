import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    ) {}

    async findAll(): Promise<Vehicle[]> {
        return this.vehicleRepo.find();
    }

    async findOne(id: number): Promise<Vehicle> {
        const vehicle = await this.vehicleRepo.findOne({ where: { id } });
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        return vehicle;
    }

    async create(data: Partial<Vehicle>): Promise<Vehicle> {
        return this.vehicleRepo.save(data);
    }

    async update(id: number, data: Partial<Vehicle>): Promise<Vehicle> {
        await this.vehicleRepo.update(id, data);
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        await this.vehicleRepo.delete(id);
    }

    async createBlankForUser(userId: number): Promise<Vehicle> {
        const blank = this.vehicleRepo.create({
            user_id: userId,
            make: 'Unknown',
            model: 'Unknown',
            year: 0,
        });
        return this.vehicleRepo.save(blank);
    }
}