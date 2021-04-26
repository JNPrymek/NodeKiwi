#!/usr/bin/env node

import Kiwi from '../kiwi_connector/kiwi.js';
import TimeUtils from '../utils/TimeUtils.js';

import TestCase from '../models/testCase.js';
import TestPlan from '../models/testPlan.js';

main();

let my_tc = null;

const today = TimeUtils.today();
const lastWeek = TimeUtils.weekBefore(today);

async function main() {
	await Kiwi.login();
	
	console.log('TestPlan.getById(1)');
	let tp1 = await TestPlan.getById(1);
	console.log(tp1);
	
	console.log('----------------------------');
	
	console.log('TestPlan.getTestCases(sorted=false)');
	let tcs = await tp1.getTestCases(false);
	console.log(tcs);
	
	console.log('----------------------------');
	
	console.log('TestPlan.getTestCases(sorted=true)');
	tcs = await tp1.getTestCases();
	console.log(tcs);
	
	
	console.log('----------------------------');
	
	//console.log('TestPlan.getByTag()');
	
	
	
	console.log('----------------------------');
	
	
	
	await Kiwi.logout();
}