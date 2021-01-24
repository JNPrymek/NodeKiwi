import KiwiBase from './kiwiBase.js';

export default class Tag extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	getName() {
		return this._source.name;
	}
	
	async setName(name) {
		await this.update({'name' : name});
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}