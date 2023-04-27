import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Income } from './incomes.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { IncomeErrorCodes, IncomeQueryFilter } from './entities/income.entity';
import { UpdateManyIncomeDto } from './dto/update-many-expense.dto';
import { Income as IncomeEntity } from './entities/income.entity';
import { UserErrorCodes } from 'src/users/interfaces/users.interfaces';

@Injectable()
export class IncomesService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    private userService: UsersService,
  ) {}

  async create(createIncomeDto: CreateIncomeDto) {
    if (!createIncomeDto.user)
      throw new HttpException(
        UserErrorCodes.NO_ID_PROVIDED,
        HttpStatus.BAD_REQUEST,
      );
    if (!(await this.userService.exists({ _id: createIncomeDto.user })))
      throw new HttpException(
        UserErrorCodes.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    const income = (await this.incomeModel.create(createIncomeDto))?.toObject();
    if (!income)
      throw new HttpException(
        'Error creating income',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return new IncomeEntity(income);
  }

  async createMany(createIncomeDto: CreateIncomeDto[]) {
    if (
      !createIncomeDto.some(
        async (e) => await this.userService.exists({ _id: e.user }),
      )
    )
      throw new HttpException(
        UserErrorCodes.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    return (await this.incomeModel.create(createIncomeDto)).map(
      (e) => new IncomeEntity(e.toObject()),
    );
  }

  async findAll(user: string, { limit, offset, sort }: IncomeQueryFilter) {
    if (!(await this.userService.exists({ _id: user }))) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const query = this.incomeModel.find<Income>({ user, archived: false });
    if (limit) query.limit(limit);
    if (offset) query.skip(offset);
    if (sort) {
      const [field, order] = sort.split(':');
      if (order === 'asc') query.sort({ [field]: 1 });
      else query.sort({ [field]: -1 });
    }

    return (await query.exec()).map((e) => new IncomeEntity(e.toObject()));
  }

  async findOne(id: string) {
    const income = (await this.incomeModel.findById(id).exec())?.toObject();
    if (!income)
      throw new HttpException(
        IncomeErrorCodes.INCOME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    return new IncomeEntity(income);
  }

  async update(id: string, updateIncomeDto: UpdateIncomeDto) {
    const income = (
      await this.incomeModel
        .findByIdAndUpdate(id, updateIncomeDto, { new: true })
        .exec()
    )?.toObject();
    if (!income)
      throw new HttpException(
        IncomeErrorCodes.INCOME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    return new IncomeEntity(income);
  }

  async updateMany(updateManyIncomeDto: UpdateManyIncomeDto[]) {
    return Promise.all(
      updateManyIncomeDto.map(async (i) => {
        const exists = await this.incomeModel.exists({ _id: i._id });
        if (!exists)
          throw new HttpException(
            IncomeErrorCodes.INCOME_NOT_FOUND,
            HttpStatus.NOT_FOUND,
          );

        const income = (
          await this.incomeModel
            .findByIdAndUpdate(i._id, i, { new: true })
            .exec()
        ).toObject();
        return new IncomeEntity(income);
      }),
    );
  }

  async remove(id: string) {
    const exists = await this.incomeModel.exists({ _id: id });
    if (!exists)
      throw new HttpException(
        IncomeErrorCodes.INCOME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    const income = (
      await this.incomeModel
        .findByIdAndUpdate(id, { archived: true }, { new: true })
        .exec()
    ).toObject();
    return new IncomeEntity(income);
  }

  async removeMany(ids: string[]) {
    return Promise.all(
      ids.map(async (id) => {
        const exists = await this.incomeModel.exists({ _id: id });
        if (!exists)
          throw new HttpException(
            IncomeErrorCodes.INCOME_NOT_FOUND,
            HttpStatus.NOT_FOUND,
          );

        const income = (
          await this.incomeModel
            .findByIdAndUpdate(id, { archived: true }, { new: true })
            .exec()
        ).toObject();
        return new IncomeEntity(income);
      }),
    );
  }
}
