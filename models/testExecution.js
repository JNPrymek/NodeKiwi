import KiwiBase from './kiwiBase.js';
import TimeUtils from '../utils/TimeUtils.js';
import User from './user.js';
import Build from './build.js';
import TestExecutionStatus from './testExecutionStatus.js';

export default class TestExecution extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	getStopDate() {
		return TimeUtils.serverStringToDate(this._source.stop_date);
	}
	
	/* #region Test Case Info */
	
	getTestCaseId() {
		return this._source.case_id;
	}
	
	getTestCaseSummary() {
		return this._source.case;
	}
	
	/* #endregion */
	
	/* #region Test Run Info */
	
	getTestRunId() {
		return this._source.run_id;
	}
	
	getTestRunSummary() {
		return this._source.run;
	}
	
	getSortKey() {
		return this._source.sortkey;
	}
	
	/* #endregion */
	
	/* #region Assignee */
	
	async getAssignee() {
		return await User.getById(this.getAssigneeId());
	}
	
	getAssigneeId() {
		return this._source.assignee;
	}
	
	getAssigneeUsername() {
		return this._source.assignee__username;
	}
	
	/* #endregion */
	
	/* #region Tester */
	
	async getTester() {
		return await User.getById(this.getTesterId());
	}
	
	getTesterId() {
		return this._source.tested_by;
	}
	
	getTesterUsername() {
		return this._source.tested_by__username;
	}
	
	/* #endregion */
	
	/* #region Build */
	
	getBuildId() {
		return this._source.build;
	}
	
	getBuildName() {
		return this._source.build__name;
	}
	
	async getBuild() {
		return await Build.getById(this.getBuildId());
	}
	
	/* #endregion */
	
	/* #region Status */
	
	async getStatus() {
		return await TestExecutionStatus.getById(this.getStatusId());
	}
	
	getStatusId() {
		return this._source.status;
	}
	
	getStatusName() {
		return this._source.status__name;
	}
	
	/* #endregion */
	
	// History
	async getHistory() {
		// TODO - return custom objects
		return await TestExecution.callServerFunction('history', [this.getId()]);
	}
	
	static async getByDate(rangeStart = TimeUtils.today(), rangeEnd = TimeUtils.tomorrow()) {
		const start = TimeUtils.dateToUtcString(rangeStart);
		const end = TimeUtils.dateToUtcString(rangeEnd);
		
		return await TestExecution.filter({'stop_date__range' : [start, end]});
	}
}
