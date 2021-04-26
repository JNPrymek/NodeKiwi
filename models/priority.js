import KiwiBase from "./kiwiBase";

export default class Priority extends KiwiBase {
	
	constructor(source) {
		super(source);
	}
	
	/* #region Name */
	
	getName() {
		return this.getValue();
	}
	
	getValue() {
		return this._source.value;
	}
	
	/* #endregion */
	
	getActive() {
		return this._source.is_active;
	}
}