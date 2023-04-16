import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpenseRecursion } from './entities/expense.entity';

@Schema({ timestamps: true })
export class Expense extends Document {
	@Prop({ default: "" })
	description: string;

	@Prop({ required: true })
	amount: number;

	@Prop({ default: Date.now() })
	date: number;

	@Prop({ default: false })
	isRecurring: boolean;

	@Prop({ type: Object })
	recursion: ExpenseRecursion;

	@Prop({ default: false })
	archived: boolean;

	@Prop({ required: true })
	user: string;

	@Prop({ default: Date.now() })
	createdAt: Date;

	@Prop({ default: Date.now() })
	updatedAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);