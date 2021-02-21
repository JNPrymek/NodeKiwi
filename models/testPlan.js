import KiwiBase from './kiwiBase.js';
import TimeUtils from '../utils/TimeUtils.js';
import Product from './product.js';
import Version from './version.js';
import PlanType from './planType.js';

export default class TestPlan extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	getCreateDate() {
		return TimeUtils.serverStringToDate(this._source.create_date);
	}
	
	/* #region Summary Text */
	
	getName() {
		return this._source.name;
	}
	
	async setName(newName) {
		await this.update({'name' : newName});
	}
	
	getText() {
		return this._source.text;
	}
	
	async setText(newText) {
		await this.update({'text' : newText});
	}
	
	/* #endregion */
	
	/* #region Parent TestPlan */
	
	getParentPlanId() {
		return this._source.parent_id;
	}
	
	getParentPlanName() {
		return this._source.parent;
	}
	
	getParentPlan() {
		return TestPlan.getById(this._source.parent_id);
	}
	
	async setParentPlan(parent) {
		// TODO - implement
	}
	
	/* #endregion */
	
	/* #region Product Info */
	
	getProductId() {
		return this._source.product_id;
	}
	
	getProductName() {
		return this._source.product;
	}
	
	async getProduct() {
		return await Product.getById(this._source.product_id);
	}
	
	getProductVersionId() {
		return this._source.product_version_id;
	}
	
	getProductVersionName() {
		return this._source.product_version;
	}
	
	async getProductVersion() {
		return await Version.getById(this._source.product_version_id);
	}
	
	/* #endregion */
	
	/* #region Plan Type */
	
	getPlanTypeId() {
		return this._source.type_id;
	}
	
	getPlanTypeName() {
		return this._source.type;
	}
	
	async getPlanType() {
		return await PlanType.getById(this._source.type_id);
	}
	
	async setPlanType(newType) {
		// TODO - implement
	}
	
	/* #endregion */
}