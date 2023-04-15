import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './expense.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { ExpenseQueryFilter } from './entities/expense.entity';
import { UpdateManyExpenseDto } from './dto/update-many-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private readonly userService: UsersService,
  ) { }

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    if (!createExpenseDto.user) throw new HttpException("User is required", HttpStatus.BAD_REQUEST);
    if (!await this.userService.exists({ _id: createExpenseDto.user })) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

    return this.expenseModel.create(createExpenseDto);
  }

  async createMany(createExpenseDto: CreateExpenseDto[]): Promise<Expense[]> {
    if (!createExpenseDto.some(async (e) => await this.userService.exists({ _id: e.user }))) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

    return this.expenseModel.create(createExpenseDto);
  }

  async findAll(
    user: string,
    { limit, offset, sort }: ExpenseQueryFilter,
  ) {
    if (!await this.userService.exists({ _id: user })) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const query = this.expenseModel.find<Expense>({ user, archived: false });
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
    return this.expenseModel.findById<Expense>(id).exec();
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseModel.findByIdAndUpdate<Expense>(id, updateExpenseDto, { new: true }).exec();
  }

  updateMany(updateManyExpenseDto: UpdateManyExpenseDto[]) {
    return Promise.all(updateManyExpenseDto.map(async (e) => {
      const expense = await this.expenseModel.findById<Expense>(e._id).exec();
      if (!expense) throw new HttpException("Expense not found", HttpStatus.NOT_FOUND);

      return this.expenseModel.findByIdAndUpdate<Expense>(e._id, e, { new: true }).exec();
    }));
  }

  async remove(id: string) {
    const expense = await this.expenseModel.findById<Expense>(id).exec();
    if (!expense) throw new HttpException("Expense not found", HttpStatus.NOT_FOUND);

    return this.expenseModel.findByIdAndUpdate<Expense>(id, { archived: true }, { new: true }).exec();
  }

  async removeMany(ids: string[]) {
    return Promise.all(ids.map(async (id) => {
      const expense = await this.expenseModel.findById<Expense>(id).exec();
      if (!expense) throw new HttpException("Expense not found", HttpStatus.NOT_FOUND);

      return this.expenseModel.findByIdAndUpdate<Expense>(id, { archived: true }, { new: true }).exec();
    }));
  }
}
