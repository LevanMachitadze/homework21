import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Expenses {
  @Prop({ type: String })
  describtion: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Date })
  createdAt: Date;
}

export const expensesSchema = SchemaFactory.createForClass(Expenses);
