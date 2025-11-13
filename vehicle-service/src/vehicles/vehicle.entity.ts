import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 'Unknown' })
  make!: string;

  @Column({ default: 'Unknown' })
  model!: string;

  @Column({ nullable: true })
  year!: number;

  @Column({ nullable: true })
  user_id!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}