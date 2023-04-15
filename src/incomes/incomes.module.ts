import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Income, IncomeSchema } from './incomes.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService],
  imports: [
    MongooseModule.forFeature([{ name: Income.name, schema: IncomeSchema }]),
    UsersModule,
  ]
})
export class IncomesModule { }
