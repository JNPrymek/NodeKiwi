import KiwiBase from './kiwiBase.js';
import TimeUtils from '../utils/TimeUtils.js';
import User from './user.js';
import Tag from './tag.js';
import Component from './component.js';

export default class TestCase extends KiwiBase {
	
	//static _className = 'TestCase';
	
	constructor(source) {
		super(source);
	}
	
	/* #region Static Server Methods */
	
	static async getByDateRange(rangeStart = TimeUtils.today(), rangeEnd = TimeUtils.tomorrow()) {
		const start = TimeUtils.dateToUtcString(rangeStart);
		const end = TimeUtils.dateToUtcString(rangeEnd);
		
		return await TestCase.filter({'create_date__range' : [start, end]});
	}
	
	static async getByTag(tag) {
		const t = await Tag.resolveToTag(tag);
		return TestCase.filter({'tag__in' : [t.getId()]});
	}
	
	static async getByComponent(component) {
		
		let comp = await Component.resolveToComponent(component);
		return TestCase.filter({'component__in' : [comp.getId()]});
	}
	
	/* #endregion */
	
	/* #region Automation */
	
	getAutomation() {
		return this._source.is_automated;
	}
	
	async setAutomation(automation) {
		await this.update({'is_automated' : automation});
	}
	
	async setAutomated() {
		await this.setAutomation(true);
	}
	
	async setManual() {
		await this.setAutomation(false);
	}
	
	/* #endregion */
	
	/* #region Author */
	
	getAuthorId() {
		return this._source.author;
	}
	
	getAuthorName() {
		return this._source.author__username;
	}
	
	async getAuthor() {
		return await User.getById(this.getAuthorId());
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
	
	/* #endregion */
	
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
	
	/* #region Summary */
	
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
	
	/* #endregion */
	
	/* #region Tags */
	
	async getTags() {
		return Tag.filter({'case__in' : [this.getId()]});
	}
	
	async addTag(tag) {
		const t = await Tag.resolveToTag(tag);
		await TestCase.callServerFunction('add_tag', [this.getId(), t.getName()]);
		await this.update();
	}
	
	async removeTag(tag) {
		const t = await Tag.resolveToTag(tag);
		await TestCase.callServerFunction('remove_tag', [this.getId(), t.getName()]);
		await this.update();
	}
	
	/* #endregion */
	
	/* #region Components */
	
	async getComponents() {
		return await Component.filter({'cases__in' : [this.getId()]});
	}
	
	async addComponent(component) {
		const comp = await Component.resolveToComponent(component);
		await TestCase.callServerFunction('add_component', [this.getId(), comp.getName()]);
		await this.update();
	}
	
	// Note - Kiwi's API has inconsistent standards, due to needs of the Web UI.
	// Adding component uses string name, but removing requires int ID
	async removeComponent(component) {
		const comp = await Component.resolveToComponent(component);
		await TestCase.callServerFunction('remove_component', [this.getId(), comp.getId()]);
		await this.update();
	}
	
	/* #endregion */
	
	/* #region Priority */
	
	getPriorityId() {
		return this._source.priority;
	}
	
	getPriority() {
		return this._source.priority__value;
	}
	
	/* #endregion */
	
	toString() {
		return `${super.toString()} : ${this.getSummary()}`;
	}
	
}