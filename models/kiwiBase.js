import Kiwi from '../kiwi_connector/kiwi.js';
import ConnectionError from './errors/connectionError.js';
import DuplicateIdError from './errors/duplicateItemError.js';
import NoIdFoundError from './errors/noItemFoundError.js';

export default class KiwiBase {
	
	//static _className = '';
	
	constructor(source) {
		this._source = source;
	}
	
	// get internal class name for RPC method names
	static getClassName() {
		return this.name;
		//return this.constructor.name; // returns 'Function' when called from callServerFunction() method
		//return this._className;
	}
	
	static async callServerFunction(functionName, parameters) {
		let params = Array.isArray(parameters) ? parameters : [parameters];
		//console.log(`_className : ${this._className}`);
		//console.log(`getClassName() : ${this.getClassName()}`);
		let response =  await Kiwi.sendRpcMethod(`${this.getClassName()}.${functionName}`, params);
		
		if (response.error) {
			throw new Error(JSON.stringify(response.error));
		}
		
		if (response.result || response.result == null) {
			return response.result;
		} else {
			throw new ConnectionError('Kiwi - no results or error' + JSON.stringify(response));
		}
	}
	
	static async filter(filterDict = {}) {
		let results = await this.callServerFunction('filter', filterDict);
		let items = [];
		results.forEach( element => items.push(new this(element)));
		return items;
	}
	
	// static async _updateServerObj(id, updateDict) {
	// 	return  await this.callServerFunction('update', [id, updateDict]);
	// }
	
	async update(updateDict = {}) {
		const id = this._source.id;
		const newSource = await this.constructor.callServerFunction('update', [id, updateDict]);
		this._source = newSource;
	}
	
	static async _getSingleById(id) {
		this._assertValidId(id);
		
		const results = await this.filter({'id' : id});
		if (results.length == 0) {
			throw new NoIdFoundError(this.getClassName(), id);
		}
		if (results.length > 1) {
			throw new DuplicateIdError(this.getClassName(), id);
		}
		//return this(results[0]); // filter returns Class instances
		return results[0];
	}
	
	static async getById(ids) {
		if (typeof(ids) == 'number') {
			return await this._getSingleById(ids);
		}
		if (!Array.isArray(ids)) {
			throw new TypeError('IDs must be (positive integer) || (an array of positive integers)');
		}
		
		ids.forEach(element => this._assertValidId(element));
		
		return await this.filter({'id__in' : ids});
	}
	
	// return true if id contains a valid int ID number
	static _assertValidId(id) {
		if (typeof id !== 'number' || isNaN(id)) {
			throw new TypeError('ID must be of type Number');
		}
		if ( (!Number.isInteger(id) ) || (id < 1) ) {
			throw new RangeError('ID must be a positive integer');
		}
		return true;
	}
	
	static async getAll() {
		return await this.filter();
	}
	
	getId() {
		return this._source.id;
	}
	
	toString() {
		return `${this.constructor.name}-${this.getId()}`;
	}
}