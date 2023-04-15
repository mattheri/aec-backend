import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Income } from './incomes.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { IncomeQueryFilter } from './entities/income.entity';
import { UpdateManyIncomeDto } from './dto/update-many-expense.dto';

@Injectable()
export class IncomesService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    private userService: UsersService,
  ) { }

  async create(createIncomeDto: CreateIncomeDto): Promise<Income> {
    if (!createIncomeDto.user) throw new HttpException("User is required", HttpStatus.BAD_REQUEST);
    if (!await this.userService.exists({ _id: createIncomeDto.user })) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

    return this.incomeModel.create(createIncomeDto);
  }

  async createMany(createIncomeDto: CreateIncomeDto[]): Promise<Income[]> {
    if (!createIncomeDto.some(async (e) => await this.userService.exists({ _id: e.user }))) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

    return this.incomeModel.create(createIncomeDto);
  }

  async findAll(
    user: string,
    { limit, offset, sort }: IncomeQueryFilter,
  ) {
    if (!await this.userService.exists({ _id: user })) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const query = this.incomeModel.find<Income>({ user, archived: false });
    if (limit) query.limit(limit);
    if (offset) query.skip(offset);
    if (sort) {
      const [field, order] = sort.split(":");
      if (order === "asc") query.sort({ [field]: 1 });
      else query.sort({ [field]: -1 });
    }

    return query.exec();
  }

  findOne(id: string) {
    return this.incomeModel.findById<Income>(id).exec();
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    return this.incomeModel.findByIdAndUpdate<Income>(id, updateIncomeDto, { new: true }).exec();
  }

  updateMany(updateManyIncomeDto: UpdateManyIncomeDto[]) {
    return Promise.all(updateManyIncomeDto.map(async (e) => {
      const Income = await this.incomeModel.findById<Income>(e._id).exec();
      if (!Income) throw new HttpException("Income not found", HttpStatus.NOT_FOUND);

      return this.incomeModel.findByIdAndUpdate<Income>(e._id, e, { new: true }).exec();
    }));
  }

  async remove(id: string) {
    const Income = await this.incomeModel.findById<Income>(id).exec();
    if (!Income) throw new HttpException("Income not found", HttpStatus.NOT_FOUND);

    return this.incomeModel.findByIdAndUpdate<Income>(id, { archived: true }, { new: true }).exec();
  }

  async removeMany(ids: string[]) {
    return Promise.all(ids.map(async (id) => {
      const Income = await this.incomeModel.findById<Income>(id).exec();
      if (!Income) throw new HttpException("Income not found", HttpStatus.NOT_FOUND);

      return this.incomeModel.findByIdAndUpdate<Income>(id, { archived: true }, { new: true }).exec();
    }));
  }
}
