import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  DefaultDateFilter,
  DefaultSort,
} from './interfaces/user-config.interface';

@Schema({ timestamps: true })
export class UserConfig extends Document {
  @Prop({ required: true, unique: true })
  user: string;

  @Prop({ default: 'dateDesc', type: String })
  defaultSort: DefaultSort;

  @Prop({ default: 'month', type: String })
  defaultDateFilter: DefaultDateFilter;
}

export const UserConfigSchema = SchemaFactory.createForClass(UserConfig);
