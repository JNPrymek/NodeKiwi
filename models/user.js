import KiwiBase from './kiwiBase.js';
import TimeUtils from '../utils/TimeUtils.js';
import { NoUsernameFoundError } from './errors/noItemFoundError.js';
import { DuplicateUsernameError } from './errors/duplicateItemError.js';

export default class User extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	static async getByUserName(name) {
		let res = await this.filter({'username' : name});
		if (res.length == 1) {
			return res[0];
		}
		else if (res.length < 1) {
			throw new NoUsernameFoundError(name);
		} 
		else {
			throw new DuplicateUsernameError(name);
		}
	}
	
	getUserName() {
		return this._source.username;
	}
	
	getFirstName() {
		return this._source.first_name;
	}
	
	getLastName() {
		return this._source.last_name;
	}
	
	getFullName() {
		return `${this.getFirstName()} ${this.getLastName()}`
	}
	
	getLastLogin() {
		return TimeUtils.dateToUtcString(this._source.last_login);
	}
	
	getJoinDate() {
		return TimeUtils.dateToUtcString(this._source.date_joined);
	}
	
	getIsStaff() {
		return this._source.is_staff;
	}
	
	getIsActive() {
		return this._source.is_active;
	}
	
	getIsSuperUser() {
		return this._source.is_superuser;
	}
}