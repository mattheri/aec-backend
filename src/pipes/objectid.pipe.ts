import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { Types } from "mongoose";

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (Array.isArray(value)) {
			const validArray = value.every((item) => Types.ObjectId.isValid(item));

			if (!validArray) throw new HttpException("Invalid Id", HttpStatus.BAD_REQUEST);

			return value;
		}

		const validObjectId = Types.ObjectId.isValid(value);

		if (!validObjectId) throw new HttpException("Invalid Id", HttpStatus.BAD_REQUEST)

		return value;
	}
}