import KiwiBase from './kiwiBase.js';
import TimeUtils from '../utils/TimeUtils.js';
import Product from './product.js';
import Version from './version.js';
import PlanType from './planType.js';
import TestCase from './testCase.js';

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
	
	/* #region Test Cases */
	
	async getTestCases(sorted=true) {
		// Return TCs in order of TC ID
		let unsortedCaseList = await TestCase.getById(this._source.cases);
		if(!sorted) {
			return unsortedCaseList;
		}
		
		// Get SortKeys
		let sortKeys = await TestCase.callServerFunction('sortkeys', {'plan' : this.getId()});
		
		// Save Cases to object
		let caseListObj = {};
		unsortedCaseList.forEach( element => {
			caseListObj[(element.getId().toString())] = element;
		});
		
		let sortedCaseList = [];
		
		// Iterate over sort keys, in sort order (key = TC ID, val = sort order)
		for (const [key, value] of Object.entries(sortKeys).sort(
			(a, b) => {
				const keyA = parseInt(a[1]);
				const keyB = parseInt(b[1]);
				if (keyA < keyB) {
					return -1;
				}
				if (keyB < keyA) {
					return 1;
				}
				return 0;
			}
		)) {
			// Add TC from object to sorted list
			sortedCaseList.push(caseListObj[key]);
		}
		
		// Return TCs in order of sort keys
		return sortedCaseList;
	}
	
	/* #endregion */
}