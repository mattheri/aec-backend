import { Controller, Get, Post, Body, Param, Delete, Query, ValidationPipe, Put, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { ObjectIdValidationPipe } from 'src/pipes/objectid.pipe';
import { UpdateManyExpenseDto } from './dto/update-many-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("many")
  createMany(@Body() createExpenseDto: CreateExpenseDto[]) {
    return this.expensesService.createMany(createExpenseDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.expensesService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(@Param('id', new ObjectIdValidationPipe()) id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  updateMany(@Body(new ObjectIdValidationPipe()) updateManyExpenseDto: UpdateManyExpenseDto[]) {
    return this.expensesService.updateMany(updateManyExpenseDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.expensesService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete()
  removeMany(@Body(new ObjectIdValidationPipe()) ids: string[]) {
    return this.expensesService.removeMany(ids);
  }
}
