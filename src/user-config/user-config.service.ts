import { Injectable } from '@nestjs/common';
import { CreateUserConfigDto } from './dto/create-user-config.dto';
import { UpdateUserConfigDto } from './dto/update-user-config.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserConfig } from './user-config.schema';
import { Model } from 'mongoose';
import { UserConfig as UserConfigEntity } from './entities/user-config.entity';

@Injectable()
export class UserConfigService {
  constructor(
    @InjectModel(UserConfig.name)
    private readonly userConfigModel: Model<UserConfig>,
  ) {}

  async create(createUserConfigDto: CreateUserConfigDto) {
    const createdUserConfig = new this.userConfigModel(createUserConfigDto);
    const config = await createdUserConfig.save();

    return new UserConfigEntity(config.toObject());
  }

  async findOne(user: string) {
    const doc = await this.userConfigModel.find({ user }).exec();
    if (!doc) return null;

    const config = doc[0].toObject();
    return new UserConfigEntity(config);
  }

  async update(id: string, updateUserConfigDto: UpdateUserConfigDto) {
    const doc = await this.userConfigModel
      .findByIdAndUpdate(id, updateUserConfigDto, { new: true })
      .exec();
    if (!doc) return null;

    const config = doc.toObject();
    return new UserConfigEntity(config);
  }

  async remove(user: string) {
    const doc = await this.userConfigModel.findOneAndDelete({ user }).exec();
    if (!doc) return null;

    const config = doc.toObject();
    return new UserConfigEntity(config);
  }
}
