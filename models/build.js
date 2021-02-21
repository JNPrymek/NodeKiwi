import KiwiNamed from './kiwiNamed.js';

export default class Build extends KiwiNamed {
	
	constructor(source) {
		super(source);
	}
	
	static async getByName(name) {
		return await super.getByName(name, 'Build');
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