#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import yargs from 'yargs';

import TimeUtils from "../utils/TimeUtils.js";
import TestExecution from '../models/testExecution.js';
import Kiwi from "../kiwi_connector/kiwi.js";
import TestExecutionStatus from '../models/testExecutionStatus.js';

// DEV ONLY ignore SSL Certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const todayDateString = TimeUtils.dateToLocalString(TimeUtils.today(), false);

let args = 
	yargs(process.argv.slice(2))
	.scriptName('getWeeklyMetrics')
	.usage('Usage: $0 -d [anchorDate] -w [weekStartIndex]')
	.describe('anchorDate', 'Any date within the week of metrics.  Used to calculate start/end of date range.')
	.default('anchorDate', todayDateString)
	.alias('d', 'anchorDate')
	.option('weekStartIndex', {
		alias: 'w',
		demandOption: false,
		default: 0,
		choices: [0, 1, 2, 3, 4, 5, 6],
		describe: 'Index of first day of week.  Sun=0, Mon=1, Tues=2 ...',
		type: 'number'
	})
	.alias('h', 'help')
	.argv;

const sourceDate = new Date(args.anchorDate);
const startDate = TimeUtils.startOfWeek(sourceDate);
// adjust for start of week
const weekStartOffset = args.weekStartIndex;
if (weekStartOffset > 3) {
	weekStartOffset -= 7;
}
startDate.setDate(startDate.getDate() + weekStartOffset);
const endDate = TimeUtils.weekAfter(startDate);

const BOXEN_DATE_SETTINGS = {borderStyle: 'classic', 
							padding: {top: 0, bottom: 0, left: 15, right: 16}};
const BOXEN_ZERO_TESTEXEC_SETTINGS = {
	borderStyle: 'singleDouble',
	padding: { top: 0, bottom: 0, left: 7, right: 8 }
};
const NAME_MAX_WIDTH = 10;

const results = {};
let outString = '';

//const dateBorderStyle = {topLeft : '', topRight: '', bottomLeft: '', bottomRight: '', horizontal: '-', vertical: '|'}

main();

async function main() {
	await Kiwi.login();
	outString = `TestExecution Metrics for Week of ${chalk.green(TimeUtils.dateToLocalString(sourceDate, false))}`;
	outString += `\n(${chalk.green(TimeUtils.dateToLocalString(startDate))} to ${chalk.green(TimeUtils.dateToLocalString(endDate))})`
	console.log(boxen(outString, BOXEN_DATE_SETTINGS));
	

	const ex = await TestExecution.getByDate(startDate, endDate);
	// Handle case for 0 executions in specified week
	if (ex.length == 0) {
		outString = `No TestExecutions found for week of ${chalk.green(TimeUtils.dateToLocalString(startDate, false))} to ${chalk.green(TimeUtils.dateToLocalString(endDate, false))}`;
		console.log(boxen(outString, BOXEN_ZERO_TESTEXEC_SETTINGS));
		return;
	}
	
	ex.forEach(el => {
		const user = el.getTesterUsername();
		const status = el.getStatusName();
		upsertExecutionCount(user, status);
	});
	
	//const stats = await TestExecutionStatus.getAll();
	const stats = await TestExecutionStatus.filter({'name__in' : ['PASSED', 'FAILED', 'BLOCKED', 'WAIVED', 'ERROR']});
	
	const statColors = {};
	stats.forEach(stat => {
		statColors[stat.getName()] = stat.getColor();
	});
	
	outString = '';
	for (const [userName, userMetrics] of Object.entries(results)) {
		outString += `${chalk.bold(userName.padStart(NAME_MAX_WIDTH, ' '))} : `;
		//console.log(userName);
		//console.log(userMetrics);
		// Interate through metrics
		for (const [statName, statColor] of Object.entries(statColors)) {
			let statCount = userMetrics[statName] || 0;
			statCount = statCount.toString().padStart(3, '0');
			outString += `  ${chalk.bold.hex(statColor)(statName)}: ${chalk.hex(statColor)(statCount)}`
		}
		//console.log(outString);
		outString += '\n';
	}
	console.log(boxen(outString, {padding: {'top': 1, 'bottom': 0, 'left': 3, 'right': 3}, borderStyle: 'classic'}));
}

function upsertExecutionCount(user, status) {
	// create new entry for user if not exists
	if (!(results.hasOwnProperty(user))) {
		results[user] = {};
	}
	
	// create count for status if not exists
	if (!(results[user]).hasOwnProperty(status)) {
		results[user][status] = 0;
	}
	
	results[user][status] += 1;
	
}

