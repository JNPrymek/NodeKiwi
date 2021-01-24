export default class NoIdFoundError extends Error {
	constructor(itemType, id) {
		super(`No ${itemType} found for ID ${id}`);
		
		// Assign the error name to be the class name
		this.name = this.constructor.name;
		
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NoItemNameFoundError extends Error {
	constructor(itemType, name) {
		super(`No ${itemType} found for name ${name}`);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NoUsernameFoundError extends Error {
	constructor(name) {
		super(`No User found for username ${name}`);
		
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}