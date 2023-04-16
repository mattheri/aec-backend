import { Controller, Get, Post, Body, Param, Delete, Put, Query, ValidationPipe, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { ObjectIdValidationPipe } from 'src/pipes/objectid.pipe';
import { UpdateManyIncomeDto } from './dto/update-many-expense.dto';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto) {
    return this.incomesService.create(createIncomeDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("many")
  createMany(@Body() createIncomeDto: CreateIncomeDto[]) {
    return this.incomesService.createMany(createIncomeDto);
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
    return this.incomesService.findAll(user, query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.incomesService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(@Param('id', new ObjectIdValidationPipe()) id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomesService.update(id, updateIncomeDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  updateMany(@Body(new ObjectIdValidationPipe()) updateManyIncomeDto: UpdateManyIncomeDto[]) {
    return this.incomesService.updateMany(updateManyIncomeDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.incomesService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete()
  removeMany(@Body(new ObjectIdValidationPipe()) ids: string[]) {
    return this.incomesService.removeMany(ids);
  }
}
