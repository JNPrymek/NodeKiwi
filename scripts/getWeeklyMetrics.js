#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import TimeUtils from '../utils/TimeUtils.js';
import TestExecution from '../models/testExecution.js';
import Kiwi from '../kiwi_connector/kiwi.js';
import TestExecutionStatus from '../models/testExecutionStatus.js';
import ConnectionError from '../models/errors/connectionError.js';

let args = 
	yargs(hideBin(process.argv))
		.scriptName('getWeeklyMetrics')
		.usage('Usage: $0 [anchorDate] -w [weekStartIndex]')
		.option('weekStartIndex', {
			alias: 'w',
			demandOption: false,
			default: 0,
			choices: [0, 1, 2, 3, 4, 5, 6],
			describe: 'Index of first day of week.  Sun=0, Mon=1, Tues=2 ...',
			type: 'number'
		})
		.option('execution', {
			alias: ['e', 'r', 'run'],
			demandOption: false,
			type: 'boolean',
			describe: 'Display TestExecution data'
		})
		.option('creation', {
			alias: ['c', 'a', 'addition', 'create'],
			demandOption: false,
			type: 'boolean',
			describe: 'Display TestCase creation data'
		})
		.string('_')
		.alias('h', 'help')
		.check((argv, options) => { // eslint-disable-line no-unused-vars
			// Must specify at least one of: Creation (-c), Execution (-e)
			return argv.creation || argv.execution;
		})
		.argv;

const sourceDate = (args._[0] && TimeUtils.stringIsValidDate(args._[0])) ? new Date(args._[0]) : new Date();
const startDate = TimeUtils.startOfWeek(sourceDate);
// adjust for start of week
let weekStartOffset = args.weekStartIndex;
if (weekStartOffset > 3) {
	weekStartOffset -= 7;
}
startDate.setDate(startDate.getDate() + weekStartOffset);
const endDate = TimeUtils.weekAfter(startDate);

// Boxen Settings
const BOXEN_DATE_SETTINGS = {
	borderStyle: 'classic', 
	padding: {top: 0, bottom: 0, left: 15, right: 16}
};

const BOXEN_ZERO_TESTEXEC_SETTINGS = {
	borderStyle: 'singleDouble',
	padding: { top: 0, bottom: 0, left: 7, right: 8 }
};
const BOXEN_INVISIBLE_SETTINGS = {
	borderStyle: {
		topLeft: ' ',
		topRight: ' ',
		bottomLeft: ' ',
		bottomRight: ' ',
		horizontal: ' ',
		vertical: ' '
	},
	padding : { top: 0, bottom: 0, left: 3, right: 3 }
};

const NAME_MAX_WIDTH = 10; // Used for padding user names

const results = {};
let outString = '';

//const dateBorderStyle = {topLeft : '', topRight: '', bottomLeft: '', bottomRight: '', horizontal: '-', vertical: '|'}

main();

async function main() {
	
	let stats = null;
	let ex = null;
	try {
		await Kiwi.login();
		if (args.execution) {
			stats = await TestExecutionStatus.filter({'name__in' : ['PASSED', 'FAILED', 'BLOCKED', 'WAIVED', 'ERROR']});
			ex = await TestExecution.getByDate(startDate, endDate);
		}
		await Kiwi.logout();
	}
	catch (err) {
		let errMsg = '';
		if (err instanceof ConnectionError) {
			errMsg += 'Program aborted due to network error';
		}
		else {
			errMsg += 'Program aborted due to unrecognized error';
		}
		errMsg += '\n' + err.message;
		console.log(chalk.red(errMsg));
		process.exit(1);
	}
	
	if (args.execution && stats && ex) {
		await printTestExecutionMetrics(stats, ex);
	}
	
	if (args.creation) {
		outString = chalk.cyan('TestCase creation metrics are not supported yet.  This feature is coming soon.');
		console.log(boxen(outString, BOXEN_INVISIBLE_SETTINGS));
	}
}

async function printTestExecutionMetrics(stats, ex) {
	
	outString = `TestExecution Metrics for Week of ${chalk.green(TimeUtils.dateToLocalString(sourceDate, false))}`;
	outString += `\n(${chalk.green(TimeUtils.dateToLocalString(startDate))} to ${chalk.green(TimeUtils.dateToLocalString(endDate))})`;
	console.log(boxen(outString, BOXEN_DATE_SETTINGS));

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
			outString += `  ${chalk.bold.hex(statColor)(statName)}: ${chalk.hex(statColor)(statCount)}`;
		}
		//console.log(outString);
		outString += '\n';
	}
	console.log(boxen(outString, {padding: {'top': 1, 'bottom': 0, 'left': 3, 'right': 3}, borderStyle: 'classic'}));
	
}

/* eslint-disable no-prototype-builtins */
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

