#!/usr/bin/env node

import Kiwi from '../kiwi_connector/kiwi.js';
import TimeUtils from '../utils/TimeUtils.js';

import TestCase from '../models/testCase.js';

main();

let my_tc = null;

const today = TimeUtils.today();
const lastWeek = TimeUtils.weekBefore(today);

async function main() {
	await Kiwi.login();
	
	console.log('TestCase.getById(1)');
	let tc1 = await TestCase.getById(1);
	console.log('TC-1', tc1);
	
	console.log('----------------------------');
	console.log('TestCase.getByDateRange()')
	my_tc = await TestCase.getByDateRange(lastWeek, today);
	console.log(my_tc);
	
	console.log('----------------------------');
	
	console.log('TestCase.getByComponent(5)');
	my_tc = await TestCase.getByComponent(5);
	console.log(my_tc);
	
	console.log('----------------------------');
	
	console.log('TestCase.getByTag(1)');
	my_tc = await TestCase.getByTag(1); 
	console.log(my_tc);
	
	console.log('----------------------------');
	
	console.log('TC1.getTags()');
	let tc1Tags = await tc1.getTags();
	console.log(tc1Tags)
	
	
	await Kiwi.logout();
}