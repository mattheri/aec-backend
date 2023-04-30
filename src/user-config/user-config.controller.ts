import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import { CreateUserConfigDto } from './dto/create-user-config.dto';
import { UpdateUserConfigDto } from './dto/update-user-config.dto';

@Controller('user-config')
export class UserConfigController {
  constructor(private readonly userConfigService: UserConfigService) {}

  @Post()
  create(@Body() createUserConfigDto: CreateUserConfigDto) {
    return this.userConfigService.create(createUserConfigDto);
  }

  @Get(':user')
  async findOne(@Param('user') user: string) {
    return this.userConfigService.findOne(user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserConfigDto: UpdateUserConfigDto,
  ) {
    console.log('updateUserConfigDto', updateUserConfigDto);
    return this.userConfigService.update(id, updateUserConfigDto);
  }
}
