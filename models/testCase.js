import KiwiBase from './kiwiBase.js';
import TimeUtils from '../utils/TimeUtils.js';
import User from './user.js';

export default class TestCase extends KiwiBase {
	
	//static _className = 'TestCase';
	
	constructor(source) {
		super(source);
	}
	
	getAutomation() {
		return this._source.is_automated;
	}
	async setAutomation(automation) {
		//const newSource = await TestCase._updateServerObj(this.getId(), {'is_automated' : automation});
		await this.update({'is_automated' : automation});
	}
	async setAutomated() {
		await this.setAutomation(true);
	}
	async setManual() {
		await this.setAutomation(false);
	}
	
	getAuthorId() {
		return this._source.author_id;
	}
	getAuthorName() {
		return this._source.author;
	}
	async getAuthor() {
		return await User.getById(this._source.author_id);
	}
	
	async setAuthor(newAuthor) {
		let author = null;
		if (typeof newAuthor === 'number') {
			author = await User.getById(newAuthor);
		} 
		else if (typeof newAuthor === 'string') {
			author = await User.getByUserName(newAuthor);
		}
		else if (newAuthor instanceof User) {
			author = newAuthor;
		}
		else {
			throw new TypeError('newAuthor must be of type int, string, or User');
		}
		
		await this.update({'author' : author.getId()});
	}
	
	getArgs() {
		return this._source.arguments;
	}
	async setArgs(args) {
		await this.update({'arguments' : args});
	}
	
	getExtraLink() {
		return this._source.extra_link;
	}
	async setExtraLink(link) {
		await this.update({'extra_link' : link});
	}
	
	getScript() {
		return this._source.script;
	}
	async setScript(script) {
		await this.update({'script' : script});
	}
	
	getCreationDate() {
		return new Date(this._source.create_date + ' UTC');
	}
	
	getSummary() {
		return this._source.summary;
	}
	getName() {
		return this.getSummary();
	}
	
	async setSummary(summary) {
		await this.update({'summary': summary});
	}
	async setName(name) {
		return await this.setSummary(name);
	}
	
	static async getByDateRange(rangeStart = TimeUtils.today(), rangeEnd = TimeUtils.tomorrow()) {
		const start = TimeUtils.dateToUtcString(rangeStart);
		const end = TimeUtils.dateToUtcString(rangeEnd);
		
		return await TestCase.filter({'create_date__range' : [start, end]});
	}
	
	toString() {
		return `${super.toString()} : ${this.getSummary()}`;
	}
	
}