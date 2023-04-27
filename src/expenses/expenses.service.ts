import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './expense.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { ExpenseQueryFilter } from './entities/expense.entity';
import { UpdateManyExpenseDto } from './dto/update-many-expense.dto';
import { UserErrorCodes } from 'src/users/interfaces/users.interfaces';
import { Expense as ExpenseEntity } from './entities/expense.entity';
import { ExpenseErrorCodes } from './interfaces/expense.interface';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private readonly userService: UsersService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    if (!createExpenseDto.user)
      throw new HttpException(
        UserErrorCodes.NO_ID_PROVIDED,
        HttpStatus.BAD_REQUEST,
      );
    if (!(await this.userService.exists({ _id: createExpenseDto.user })))
      throw new HttpException(
        UserErrorCodes.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    const expense = (
      await this.expenseModel.create(createExpenseDto)
    )?.toObject();

    if (!expense)
      throw new HttpException(
        'Error creating expense',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return new ExpenseEntity(expense);
  }

  async createMany(createExpenseDto: CreateExpenseDto[]) {
    if (
      !createExpenseDto.some(
        async (e) => await this.userService.exists({ _id: e.user }),
      )
    )
      throw new HttpException(
        UserErrorCodes.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    const expenses = await this.expenseModel.create(createExpenseDto);

    return expenses.map((e) => new ExpenseEntity(e.toObject()));
  }

  async findAll(user: string, { limit, offset, sort }: ExpenseQueryFilter) {
    if (!(await this.userService.exists({ _id: user }))) {
      throw new HttpException(
        UserErrorCodes.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const query = this.expenseModel.find({ user, archived: false });
    if (limit) query.limit(limit);
    if (offset) query.skip(offset);
    if (sort) {
      const [field, order] = sort.split(':');
      if (order === 'asc') query.sort({ [field]: 1 });
      else query.sort({ [field]: -1 });
    }

    return (await query.exec()).map((e) => new ExpenseEntity(e.toObject()));
  }

  async findOne(id: string) {
    const expense = (await this.expenseModel.findById(id).exec())?.toObject();
    if (!expense)
      throw new HttpException(
        ExpenseErrorCodes.EXPENSE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    return new ExpenseEntity(expense);
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = (
      await this.expenseModel
        .findByIdAndUpdate(id, updateExpenseDto, { new: true })
        .exec()
    )?.toObject();
    if (!expense)
      throw new HttpException(
        ExpenseErrorCodes.EXPENSE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    return new ExpenseEntity(expense);
  }

  updateMany(updateManyExpenseDto: UpdateManyExpenseDto[]) {
    return Promise.all(
      updateManyExpenseDto.map(async (e) => {
        const exists = await this.expenseModel.exists({ _id: e._id });
        if (!exists)
          throw new HttpException(
            ExpenseErrorCodes.EXPENSE_NOT_FOUND,
            HttpStatus.NOT_FOUND,
          );

        const expense = (
          await this.expenseModel
            .findByIdAndUpdate(e._id, e, { new: true })
            .exec()
        ).toObject();

        return new ExpenseEntity(expense);
      }),
    );
  }

  async remove(id: string) {
    const exists = await this.expenseModel.exists({ _id: id });
    if (!exists)
      throw new HttpException(
        ExpenseErrorCodes.EXPENSE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    const expense = (
      await this.expenseModel
        .findByIdAndUpdate(id, { archived: true }, { new: true })
        .exec()
    ).toObject();
    return new ExpenseEntity(expense);
  }

  async removeMany(ids: string[]) {
    return Promise.all(
      ids.map(async (id) => {
        const exists = await this.expenseModel.exists({ _id: id });
        if (!exists)
          throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);

        const expense = (
          await this.expenseModel
            .findByIdAndUpdate(id, { archived: true }, { new: true })
            .exec()
        ).toObject();
        return new ExpenseEntity(expense);
      }),
    );
  }
}
