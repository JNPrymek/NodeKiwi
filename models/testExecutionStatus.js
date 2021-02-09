import KiwiBase from './kiwiBase.js';
import { NoItemNameFoundError } from './errors/noItemFoundError.js';
import { DuplicateItemNameError } from './errors/duplicateItemError.js';

export default class TestExecutionStatus extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		const res = await this.filter({'name' : name});
		if (res.length == 1) {
			return res[0];
		}
		else if (res.length < 1) {
			throw new NoItemNameFoundError('TestExecutionStatus', name);
		}
		else {
			throw new DuplicateItemNameError('TestExecutionStatus', name);
		}
	}
	
	getName() {
		return this._source.name;
	}
	async setName(name) {
		await this.update({'name' : name });
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