import KiwiNamed from './kiwiNamed.js';

export default class PlanType extends KiwiNamed {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		return super.getByName(name, 'PlanType');
	}
	
	getDescription() {
		return this._source.description;
	}
	
	async setDescription(newDescription) {
		await this.update({'description' : newDescription});
	}
}