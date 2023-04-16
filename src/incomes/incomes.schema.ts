import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IncomeRecursion } from './entities/income.entity';

@Schema({ timestamps: true })
export class Income extends Document {
	@Prop({ default: "" })
	description: string;

	@Prop({ required: true })
	amount: number;

	@Prop({ default: Date.now() })
	date: number;

	@Prop({ default: false })
	isRecurring: boolean;

	@Prop({ type: Object })
	recursion: IncomeRecursion;

	@Prop({ default: false })
	archived: boolean;

	@Prop({ required: true })
	user: string;

	@Prop({ default: Date.now() })
	createdAt: Date;

	@Prop({ default: Date.now() })
	updatedAt: Date;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);