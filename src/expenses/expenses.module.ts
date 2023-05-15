import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './expense.schema';
import { TimelineModule } from 'src/timeline/timeline.module';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService],
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    UsersModule,
    TimelineModule,
  ],
})
export class ExpensesModule {}
