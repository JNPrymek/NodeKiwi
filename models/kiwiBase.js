import Kiwi from '../kiwi_connector/kiwi.js';
import ConnectionError from './errors/connectionError.js';
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
	
	static async filter(filterDict = {}, excludeKeys = []) {
		let results = await this.callServerFunction('filter', filterDict);
		
		// remove excluded properties
		this.excludePropertiesFromList(results, excludeKeys);
		// remove duplicates from list (may have been unique with excluded properties)
		results = this.excludeDuplicatesFromList(results);
		let items = [];
		// remove excluded keys
		for (let i = 0; i < results.length; i++) {
			items.push(new this(results[i]));
		}
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
	
	static async _getSingleById(id, excludeKeys = []) {
		this._assertValidId(id);
		
		let results = await this.filter({'id' : id}, excludeKeys);
		
		if (results.length == 0) {
			throw new NoIdFoundError(this.getClassName(), id);
		}
		else {
			return results[0];
		}
	}
	
	static async getById(ids, excludeKeys = []) {
		if (typeof(ids) == 'number') {
			return await this._getSingleById(ids, excludeKeys);
		}
		if (!Array.isArray(ids)) {
			throw new TypeError('IDs must be (positive integer) || (an array of positive integers)');
		}
		
		ids.forEach(element => this._assertValidId(element));
		
		return await this.filter({'id__in' : ids}, excludeKeys);
	}
	
	static async getByIdRange(start, end, excludeKeys = []){
		this._assertValidId(start);
		this._assertValidId(end);
		
		// Request requires arguments to be in correct order
		if (end < start) {
			const temp = start;
			start = end;
			end = temp;
		}
		
		return await this.filter({'id__range' : [start, end]}, excludeKeys);
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
	
	static excludePropertiesFromList(itemList, excludeKeys) {
		if (!Array.isArray(itemList)) {
			throw new TypeError('itemList must be an array of Kiwi items');
		}
		if (!Array.isArray(excludeKeys)) {
			throw new TypeError('excludeKeys must be an array of strings');
		}
		
		// iterate through Kiwi items
		for (let i = 0; i < itemList.length; i++) {
			// iterate through excluded key names
			for (let e = 0; e < excludeKeys.length; e++) {
				// remove property from item
				delete (itemList[i])[excludeKeys[e]];
			}
		}
		return itemList;
	}
	
	// filter list of objects on the 'id' property and remove duplicates
	static excludeDuplicatesFromList(itemList, filterProp = 'id') {
		const unique =  itemList.filter( (obj, pos, arr) => {
			return arr.map(mapObj => mapObj[filterProp]).indexOf(obj[filterProp]) === pos;
		});
		return unique;
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