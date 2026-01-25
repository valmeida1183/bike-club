import { Category } from '../../../models/category.model';
import { Gender } from '../../../models/gender.model';

export class Bike {
	constructor(
		public id: number,
		public categoryId: number,
		public description: string,
		public frameSize: number,
		public genderCode: string,
		public model: string,
		public rimSize: number,
		public price: number,
		public gears: number,
		public image: string,
		public category: Category,
		public gender: Gender,
	) {}
}
