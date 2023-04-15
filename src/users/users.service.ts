import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneUserArguments, UserErrorCodes } from './interfaces/users.interfaces';
import { EncryptionService } from 'src/encryption/encryption.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from "./interfaces/users.interfaces";
import { User as UserEntity } from "./entities/user.entity";
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    private readonly encryptionService: EncryptionService,
    @InjectModel(UserEntity.name) private userModel: Model<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await this.encryptionService.hash(createUserDto.password);
    const user = (await this.userModel.create({ ...createUserDto, hash })).toObject();

    return new UserEntity(user);
  }

  async findOne({ username, _id }: FindOneUserArguments) {
    if (!username && !_id) throw new HttpException(UserErrorCodes.NO_ID_OR_USERNAME, HttpStatus.BAD_REQUEST);
    if (username) {
      const user = await this.userModel.find({ username }).exec().then(user => user[0].toObject());

      return new UserEntity(user);
    }

    const user = (await this.userModel.findById(_id).exec()).toObject();

    return new UserEntity(user);
  }

  async update(query: FindOneUserArguments, updateUserDto: UpdateUserDto) {
    if (!query.username && !query._id) throw new HttpException(UserErrorCodes.NO_ID_OR_USERNAME, HttpStatus.BAD_REQUEST);
    const user = (await this.userModel.findOneAndUpdate(query, updateUserDto, { new: true })).toObject();
    return new UserEntity(user);
  }

  async exists(query: FindOneUserArguments) {
    try {
      if (!query.username && !query._id) throw new HttpException(UserErrorCodes.NO_ID_OR_USERNAME, HttpStatus.BAD_REQUEST);
      return this.userModel.exists(query);
    } catch (e) {
      throw new HttpException(UserErrorCodes.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async findOneWithHash({ username, _id }: FindOneUserArguments) {
    if (!username && !_id) throw new HttpException(UserErrorCodes.NO_ID_OR_USERNAME, HttpStatus.BAD_REQUEST);
    if (username) {
      const user = await this.userModel.find({ username }).exec().then(user => user[0].toObject());
      return user;
    }

    const user = (await this.userModel.findById(_id).exec()).toObject();
    return user;
  }


}
