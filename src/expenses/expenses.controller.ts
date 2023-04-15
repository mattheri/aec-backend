import { Controller, Get, Post, Body, Param, Delete, Query, ValidationPipe, Put, UseInterceptors } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { ObjectIdValidationPipe } from 'src/pipes/objectid.pipe';
import { UpdateManyExpenseDto } from './dto/update-many-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Post("many")
  createMany(@Body() createExpenseDto: CreateExpenseDto[]) {
    return this.expensesService.createMany(createExpenseDto);
  }

  @Get('all/:user')
  findAll(
    @Param('user', new ObjectIdValidationPipe()) user: string,
    @Query(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    })) query: FindAllQueryDto
  ) {
    return this.expensesService.findAll(user, query);
  }

  @Get(':id')
  findOne(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.expensesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', new ObjectIdValidationPipe()) id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Put()
  updateMany(@Body(new ObjectIdValidationPipe()) updateManyExpenseDto: UpdateManyExpenseDto[]) {
    return this.expensesService.updateMany(updateManyExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.expensesService.remove(id);
  }

  @Delete()
  removeMany(@Body(new ObjectIdValidationPipe()) ids: string[]) {
    return this.expensesService.removeMany(ids);
  }
}
