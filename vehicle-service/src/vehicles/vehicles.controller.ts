import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
  } from '@nestjs/common';
  import { VehiclesService } from './vehicles.service';
  import { Vehicle } from './vehicle.entity';

  
  @Controller('vehicles')
  export class VehicleController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    @Get()
    findAll(): Promise<Vehicle[]> {
        return this.vehiclesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Vehicle> {
        return this.vehiclesService.findOne(id);
    }
    
    @Post()
    create(@Body() data: Partial<Vehicle>): Promise<Vehicle> {
        return this.vehiclesService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: Partial<Vehicle>): Promise<Vehicle> {
        return this.vehiclesService.update(id, data);
    }
        
    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.vehiclesService.delete(id);
    }
  }