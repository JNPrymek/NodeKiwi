import KiwiNamed from './kiwiNamed.js';
import Product from './product.js';

export default class Component extends KiwiNamed {
	
	constructor(source) {
		super(source);
		delete this._source.cases;
	}
	
	static async getByName(name) {
		return await super.getByName(name, 'Component');
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
	
	getDescription() {
		return this._source.description;
	}
	
	async setDescription(description) {
		await this.update({'description' : description});
	}
	
	async getProduct() {
		return await Product.getById(this._source.product_id);
	}
	
	toString() {
		return `${super.toString()} : ${this.getName()}`;
	}
	
}