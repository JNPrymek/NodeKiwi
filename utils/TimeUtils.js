
export default class TimeUtils {
	
	static serverStringToDate(rawString) {
		return new Date(`${rawString} UTC`);
	}

	static dateToUtcString(date, includeTimeZone = false) {
		this._assertDate(date);

		const day = this._padNumber(date.getUTCDate());
		const month = this._padNumber(date.getUTCMonth() + 1);
		const year = date.getUTCFullYear();
		const hour = this._padNumber(date.getUTCHours());
		const min = this._padNumber(date.getUTCMinutes());
		const sec = this._padNumber(date.getUTCSeconds());
		const timeZone = (includeTimeZone ? ' UTC' : '');

		return `${year}-${month}-${day} ${hour}:${min}:${sec}${timeZone}`;
	}
	
	static dateToLocalString(date, includeTime = true) {
		this._assertDate(date);
		
		const day = this._padNumber(date.getDate());
		const month = this._padNumber(date.getMonth() + 1);
		const year = date.getFullYear();
		const hour = this._padNumber(date.getHours());
		const min = this._padNumber(date.getMinutes());
		const sec = this._padNumber(date.getSeconds());
		if (includeTime) {
			return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
		}
		else {
			return `${year}-${month}-${day}`;
		}
		
	}

	static _padNumber(num, digits = 2) {
		return String(num).padStart(digits, '0');
	}
	
	static _assertDate(date) {
		if (!(date instanceof Date)) {
			throw new TypeError('date must be of type Date');
		}
	}

	// get current time
	static now() {
		return new Date(Date.now());
	}

	// get time of 0:00:00 am today
	static today() {
		const now = this.now();
		now.setHours(0, 0, 0, 0);
		return now;
	}
	
	static tomorrow() {
		const tomorrow = this.today();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow;
	}
	
	static weekAfter(source, multiWeeks = 1) {
		this._assertDate(source);
		const weekLater = new Date(source);
		weekLater.setDate(weekLater.getDate() + (7 * multiWeeks));
		return weekLater;
	}
	
	static weekBefore(source, multiWeeks = 1) {
		this._assertDate(source);
		const weekEarler = new Date(source);
		weekEarler.setDate(weekEarler.getDate() - (7 * multiWeeks));
		return weekEarler;
	}
	
	// Get 0:00:00 of Sunday morning
	static startOfWeek(source, firstDayIndex = 0) {
		this._assertDate(source);
		
		const weekStart = new Date(source);
		const sourceDay = source.getDay();
		const diff = (sourceDay >= firstDayIndex) ? (sourceDay - firstDayIndex) : (6 - weekStart);
		weekStart.setDate(source.getDate() - diff);
		weekStart.setHours(0, 0, 0, 0);
		
		return weekStart;
	}
	
	static stringIsValidDate(string) {
		const date = new Date(string);
		return Boolean(+date);
	}
}
