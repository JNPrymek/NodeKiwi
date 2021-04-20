#!/usr/bin/env node

import Kiwi from '../kiwi_connector/kiwi.js';
import TimeUtils from '../utils/TimeUtils.js';

import Tag from '../models/tag.js';

main();


const today = TimeUtils.today();
const lastWeek = TimeUtils.weekBefore(today);

async function main(){
	await Kiwi.login();
	
	console.log('Tag.getById(1)');
	let tag1 = await Tag.getById(1);
	console.log(tag1);
	
	console.log('----------------------------');
	
	let tag2 = await Tag.filter({'case__isnull' : true});
	console.log(tag2);
	
	console.log('----------------------------');
	
	
	
	console.log('----------------------------');
	
	await Kiwi.logout();
}