import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
	@Prop({ required: true, unique: true })
	username: string;

	@Prop()
	name: string;

	@Prop()
	last_name: string;

	@Prop({ required: true })
	hash: string;

	@Prop({ default: Date.now })
	createdAt: Date;

	@Prop({ default: Date.now })
	updatedAt: Date;

	@Prop()
	refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);