import KiwiBase from './kiwiBase.js';

export default class PlanType extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	getName() {
		return this._source.name;
	}
	
	async setName(newName) {
		await this.update({'name' : newName});
	}
	
	getDescription() {
		return this._source.description;
	}
	
	async setDescription(newDescription) {
		await this.update({'description' : newDescription});
	}
}