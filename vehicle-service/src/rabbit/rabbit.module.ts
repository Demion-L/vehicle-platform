import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [VehiclesModule],
  providers: [RabbitService],
})
export class RabbitModule {}
