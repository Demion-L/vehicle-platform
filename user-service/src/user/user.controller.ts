import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() body: { name: string, email: string, password: string }) {
        return this.userService.createUser(body);
    }

    @Get()
    findAll() {
        return this.userService.getAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getById(id);
    }
    
    @Put(':id')
    update(@Param('id') id: string, @Body() body: { name: string, email: string, password: string }) {
        return this.userService.update(parseInt(id), body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.deleteUser(parseInt(id));
    }
}
