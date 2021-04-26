import KiwiNamed from './kiwiNamed.js';
import Product from './product.js';
import User from './user.js';

export default class Component extends KiwiNamed {
	
	constructor(source) {
		super(source);
		delete this._source.cases;
	}
	
	/* #region Static Server Methods */
	
	static async filter(filterDict = {}, excludeKeys = []) {
		// Exclude 'cases' property by default
		let exclude = [... excludeKeys];
		exclude.push('cases');
		return super.filter(filterDict, exclude);
	}
	
	static async getByName(name, excludeKeys) {
		return await super.getByName(name, excludeKeys, 'Component');
	}
	
	static async resolveToComponent(component) {
		let comp = null;
		if (component instanceof Component) {
			comp = component;
		}
		else if (typeof component === 'string') {
			comp = await this.getByName(component);
		}
		else if (this._assertValidId(component)) {
			comp = await this.getById(component);
		}
		
		if (comp == null) {
			throw new TypeError('Component can only be resolved from types Component, int, or string');
		}
		
		return comp;
	}
	
	/* #endregion */
	
	getDescription() {
		return this._source.description;
	}
	
	async setDescription(description) {
		await this.update({'description' : description});
	}
	
	async getProduct() {
		return await Product.getById(this._source.product);
	}
	
	/* #region User Info */
	
	getInitialOwnerId() {
		return this._source.initial_owner;
	}
	
	async getInitialOwner() {
		return await User.getById(this.getInitialOwnerId());
	}
	
	getInitialQaContactId() {
		return this._source.initial_qa_contact;
	}
	
	async getInitialQaContact() {
		return await User.getById(this.getInitialQaContactId());
	}
	
	/* #endregion */
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}