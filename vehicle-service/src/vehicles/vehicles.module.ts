import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehicleController } from './vehicles.controller';
import { Vehicle } from './vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}