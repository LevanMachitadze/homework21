import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Expenses {
  @Prop({ type: String })
  describtion: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: mongoose.Schema.Types.ObjectId;
}

export const expensesSchema = SchemaFactory.createForClass(Expenses);
