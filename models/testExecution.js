import KiwiBase from './kiwiBase.js';
import TimeUtils from '../utils/TimeUtils.js';
import User from './user.js';
import Build from './build.js';

export default class TestExecution extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	getCloseDate() {
		return new Date(this._source.close_date + ' UTC');
	}
	
	getTestCaseId() {
		return this._source.case_id;
	}
	
	getTestCaseSummary() {
		return this._source.case;
	}
	
	getTestRunId() {
		return this._source.run_id;
	}
	
	getTestRunSummary() {
		return this._source.run;
	}
	
	getSortKey() {
		return this._source.sortkey;
	}
	
	// Assignee
	async getAssignee() {
		return await User.getById(this._source.assignee_id);
	}
	getAssigneeId() {
		return this._source.assignee_id;
	}
	getAssigneeUsername() {
		return this._source.assignee;
	}
	
	// Tester
	async getTester() {
		return await User.getById(this._source.tested_by_id);
	}
	getTesterId() {
		return this._source.tested_by_id;
	}
	getTesterUsername() {
		return this._source.tested_by;
	}
	
	// Build
	getBuildId() {
		return this._source.build_id;
	}
	getBuildName() {
		return this._source.build;
	}
	async getBuild() {
		return await Build.getById(this.getBuildId());
	}
	
	// Status
	async getStatus() {
		return null; //TODO - Implement Status class
		//return await Status.getById(this._source.status_id);
	}
	getStatusId() {
		return this._source.status_id;
	}
	getStatusName() {
		return this._source.status;
	}
	
	// History
	async getHistory() {
		// TODO - return custom objects
		return await TestExecution.callServerFunction('history', [this.getId()]);
	}
	
	static async getByDate(rangeStart = TimeUtils.today(), rangeEnd = TimeUtils.tomorrow()) {
		const start = TimeUtils.dateToUtcString(rangeStart);
		const end = TimeUtils.dateToUtcString(rangeEnd);
		
		return await TestExecution.filter({'close_date__range' : [start, end]});
	}
}
