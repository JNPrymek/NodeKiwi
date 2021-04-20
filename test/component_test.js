#!/usr/bin/env node

import Kiwi from '../kiwi_connector/kiwi.js';
import TimeUtils from '../utils/TimeUtils.js';

import Component from '../models/component.js';

main();

let my_tc = null;

const today = TimeUtils.today();
const lastWeek = TimeUtils.weekBefore(today);

async function main(){
	await Kiwi.login();
	
	console.log('Component.getById(1)');
	let cp1 = await Component.getById(1);
	console.log(cp1);
	
	console.log('----------------------------');
	
	await Kiwi.logout();
}