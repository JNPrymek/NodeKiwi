import KiwiBase from './kiwiBase.js';
import { NoItemNameFoundError } from './errors/noItemFoundError.js';

export default class KiwiNamed extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name, excludeKeys = [], className = 'KiwiNamed') {
		const res = await this.filter({'name' : name}, excludeKeys);
		
		if (res.length < 1) {
			throw new NoItemNameFoundError(className, name);
		}
		else {
			return res[0];
		}
	}
	
	getName() {
		return this._source.name;
	}
	
	async setName(name) {
		await this.update({'name' : name});
	}
	
	
}