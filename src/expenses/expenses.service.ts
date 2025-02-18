import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expenses } from './schema/expense.schema';
import { User } from 'src/users/schema/users.schema';
import { faker } from '@faker-js/faker';

@Injectable()
export class ExpensesService implements OnModuleInit {
  constructor(
    @InjectModel('expenses') private expensesModel: Model<Expenses>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}

  onModuleInit() {
    // const expense = {
    //   describtion: faker.finance.transactionDescription(),
    //   amount: faker.finance.amount(),
    // };
    console.log('expense');
  }

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('user not found');
    const newExpense = await this.expensesModel.create({
      ...createExpenseDto,
      user: userId,
    });
    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { expenses: newExpense._id },
    });
    return newExpense;
  }

  findAll() {
    return this.expensesModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
