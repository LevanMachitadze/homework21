import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  describtion: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
