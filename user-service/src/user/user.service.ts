import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ClientProxyFactory, Transport, ClientProxy, RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
    private client: ClientProxy;

    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private config: ConfigService,
    ) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.config.get<string>('RABBITMQ_URL')],
                queue: 'user_events',
                queueOptions: {
                    durable: true,
                },
            },
        } as RmqOptions)
    }

    async createUser(data: { name: string, email: string, password: string }): Promise<User> {
        try {const user = this.userRepo.create(data);
        await this.userRepo.save(user);

        // Send RabbitMQ message
        this.client.emit('USER_CREATED', {
            type: 'USER_CREATED',
            data: {
                id: user.id,
                email: user.email,
            },
        });
        return user;
    } catch(error) {
        console.error(`Failed to create user: ${error}`);
        throw error;
    }
}

    async getAll(): Promise<User[]> {
        return this.userRepo.find();
    }

    async getById(id: number): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } }) as User;
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.getById(id);
        await this.userRepo.remove(user);
    }

    async update(id: number, data: Partial<User>): Promise<User> {
        await this.userRepo.update(id, data);
        return this.getById(id);
    }
}


