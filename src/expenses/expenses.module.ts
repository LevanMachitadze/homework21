import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { expensesSchema } from './schema/expense.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'expenses', schema: expensesSchema }]),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
