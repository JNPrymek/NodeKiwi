export default class DuplicateIdError extends Error {
	constructor(itemType, id) {
		super(`Duplicate ${itemType} items found for ID ${id}`);
		
		// Assign the error name to be the class name
		this.name = this.constructor.name;
		
		Error.captureStackTrace(this, this.constructor);
	}
}

export class DuplicateItemNameError extends Error {
	constructor(itemType, name) {
		super(`Duplicate ${itemType} items found for name ${name}`);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class DuplicateUsernameError extends Error {
	constructor(name) {
		super(`Duplicate Users found for name ${name}`);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}