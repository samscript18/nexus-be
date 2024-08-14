import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const checkout_url = await this.userService.createUser(createUserDto);
    res.redirect(checkout_url);
  }

  @Get()
  findAll() {
    return this.userService.findUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUser(id);
  }
}
