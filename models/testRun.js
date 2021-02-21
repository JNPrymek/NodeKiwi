import KiwiBase from './kiwiBase.js';
import TimeUtils from '../utils/TimeUtils.js';
import User from './user.js';
import Build from './build.js';
import Version from './version.js';
import Tag from './tag.js';

export default class TestRun extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	/* #region Start & End Dates */
	getStartDate() {
		return TimeUtils.serverStringToDate(this._source.start_date);
	}
	
	getEndDate() {
		return TimeUtils.serverStringToDate(this._source.stop_date);
	}
	
	getStopDate() {
		return this.getEndDate();
	}
	
	async setEndDate(newDate) {
		await this.update({'stop_date' : newDate});
	}
	
	async setStopDate(newDate) {
		await this.setEndDate(newDate);
	}
	
	/* #endregion */
	
	/* #region Open/Close TestRun */
	
	async close(closeDate = TimeUtils.now()) {
		await this.setEndDate(closeDate);
	}
	
	async open() {
		await this.setEndDate(null);
	}
	
	/* #endregion */
	
	/* #region Summary/Title */
	
	getSummary() {
		return this._source.summary;
	}
	
	async setSummary(newSummary) {
		await this.update({'summary' : newSummary});
	}
	
	getTitle() {
		return this.getSummary();
	}
	
	async setTitle(newTitle) {
		await this.setSummary(newTitle);
	}
	
	/* #endregion */
	
	/* #region Notes */
	
	getNotes() {
		return this._source.notes;
	}
	
	async setNotes(notes) {
		await this.update({'notes' : notes});
	}
	
	/* #endregion */
	
	/* #region Build */
	
	getBuildId() {
		return this._source.build_id;
	}
	
	getBuildName() {
		return this._source.build;
	}
	
	async getBuild() {
		return await Build.getById(this._source.build_id);
	}
	
	// TODO - set Build (Obj, ID, Name)
	
	/* #endregion */
	
	/* #region Default Tester */
	
	getDefaultTesterId() {
		return this._source.default_tester_id;
	}
	
	getDefaultTesterName() {
		return this._source.default_tester;
	}
	
	async getDefaultTester() {
		return await User.getById(this._source.default_tester_id);
	}
	
	// TODO - set Default Tester (Obj, ID, Name)
	
	/* #endregion */
	
	/* #region Manager */
	
	getManagerId() {
		return this._source.manager_id;
	}
	
	getManagerName() {
		return this._source.manager;
	}
	
	async getManager() {
		return await User.getById(this._source.manager_id);
	}
	
	// TODO - set Manager (Obj, ID, Name)
	
	/* #endregion */
	
	/* #region Test Plan */
	
	getTestPlanId() {
		return this._source.plan_id;
	}
	
	getTestPlanName() {
		return this._source.plan;
	}
	
	async getTestPlan() {  // TODO - Implement Test Plan Class
		return null;
		//return await TestPlan.getById(this._source.plan_id);
	}
	
	/* #endregion */
	
	/* #region Product Version */
	
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
	
	/* #region Tags */
	
	async getTags() {
		return await Tag.getById(this._source.tag);
	}
	
	// TODO - add/remove tag (uses specific method)
	
	/* #endregion */
	
	/* #region CC List */
	
	// TODO - implement CC list (need test data)
	
	/* #endregion */
}