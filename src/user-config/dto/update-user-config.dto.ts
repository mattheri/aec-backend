import { PartialType } from '@nestjs/swagger';
import { CreateUserConfigDto } from './create-user-config.dto';

export class UpdateUserConfigDto extends PartialType(CreateUserConfigDto) {}
