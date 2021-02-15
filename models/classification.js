import KiwiNamed from './kiwiNamed.js';

export default class Classification extends KiwiNamed {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		return await super.getByName(name, 'Classification');
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}