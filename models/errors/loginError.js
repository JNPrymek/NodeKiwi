
export default class LoginError extends Error {
	constructor(message) {
		super(message);
		
		// Assign the error name to be the class name
		this.name = this.constructor.name;
		
		Error.captureStackTrace(this, this.constructor);
	}
}
