import KiwiNamed from './kiwiNamed.js';

export default class TestExecutionStatus extends KiwiNamed {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		return await super.getByName(name, 'TestExecutionStatus');
	}
	
	getWeight() {
		return this._source.weight;
	}
	
	async setWeight(weight) {
		await this.update({'weight' : weight });
	}
	
	getIcon() {
		return this._source.icon;
	}
	
	async setIcon(iconString) {
		await this.update({'icon' : iconString});
	}
	
	getColor() {
		return this._source.color;
	}
	
	async setColor(color) {
		await this.update({'color' : color});
	}
}