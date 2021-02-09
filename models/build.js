import { DuplicateItemNameError } from './errors/duplicateItemError.js';
import { NoItemNameFoundError } from './errors/noItemFoundError.js';
import KiwiBase from './kiwiBase.js';

export default class Build extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		const res = await this.filter({'name' : name});
		if (res.length == 1) {
			return res[0];
		}
		else if (res.length < 1) {
			throw new NoItemNameFoundError('Build', name);
		}
		else {
			throw new DuplicateItemNameError('Build', name);
		}
	}
	
	getName() {
		return this._source.name;
	}
	
	async setName(name) {
		await this.update({'name' : name});
	}
	
	getVersion() {
		return this._source.version;
	}
	
	getActive() {
		return this._source.is_active;
	}
	
	async setActive(active = true) {
		await this.update({'is_active' : active});
	}
}