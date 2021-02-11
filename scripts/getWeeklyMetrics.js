#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import TimeUtils from '../utils/TimeUtils.js';
import TestCase from '../models/testCase.js';
import TestExecution from '../models/testExecution.js';
import Kiwi from '../kiwi_connector/kiwi.js';
import TestExecutionStatus from '../models/testExecutionStatus.js';
import ConnectionError from '../models/errors/connectionError.js';

/* #region CLI Arg Settings */
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
/* #endregion */

const sourceDate = (args._[0] && TimeUtils.stringIsValidDate(args._[0])) ? new Date(args._[0]) : new Date();
const startDate = TimeUtils.startOfWeek(sourceDate);
// adjust for start of week
let weekStartOffset = args.weekStartIndex;
if (weekStartOffset > 3) {
	weekStartOffset -= 7;
}
startDate.setDate(startDate.getDate() + weekStartOffset);
const endDate = TimeUtils.weekAfter(startDate);

/* #region  Boxen Settings */
const BOXEN_DATE_SETTINGS = {
	borderStyle: 'classic', 
	padding: {top: 0, bottom: 0, left: 15, right: 16}
};

const BOXEN_ZERO_TESTEXEC_SETTINGS = {
	borderStyle: 'singleDouble',
	padding: { top: 0, bottom: 0, left: 7, right: 8 }
};

const BOXEN_TESTEXEC_SETTINGS = {
	padding: {
		'top': 1, 
		'bottom': 0, 
		'left': 3, 
		'right': 3
	}, 
	borderStyle: 'classic'
};

// eslint-disable-next-line no-unused-vars
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

const BOXEN_TESTCREATED_SETTINGS = {
	padding: {
		'top': 1, 
		'bottom': 0, 
		'left': 33, 
		'right': 32
	}, 
	borderStyle: 'classic'
};

const NAME_MAX_WIDTH = 10; // Used for padding user names

/* #endregion */

const executionResults = {};
const creationResults = {};
let outString = '';

//const dateBorderStyle = {topLeft : '', topRight: '', bottomLeft: '', bottomRight: '', horizontal: '-', vertical: '|'}

main();

async function main() {
	
	let execStatuses = null;
	let testExecutions = null;
	let testCasesCreated = null;
	try {
		await Kiwi.login();
		
		if (args.execution) {
			execStatuses = await TestExecutionStatus.filter({'name__in' : ['PASSED', 'FAILED', 'BLOCKED', 'WAIVED', 'ERROR']});
			testExecutions = await TestExecution.getByDate(startDate, endDate);
		}
		
		if(args.creation) {
			testCasesCreated = await TestCase.getByDateRange(startDate, endDate);
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
	
	if (args.execution && execStatuses && testExecutions) {
		await printTestExecutionMetrics(execStatuses, testExecutions);
	}
	
	if (args.creation && testCasesCreated) {
		// outString = chalk.cyan('TestCase creation metrics are not supported yet.  This feature is coming soon.');
		// console.log(boxen(outString, BOXEN_INVISIBLE_SETTINGS));
		await printTestCreationMetrics(testCasesCreated);
	}
}

async function printTestExecutionMetrics(execStats, testExecs) {
	
	outString = `TestExecution Metrics for Week of ${chalk.green(TimeUtils.dateToLocalString(sourceDate, false))}`;
	outString += `\n(${chalk.green(TimeUtils.dateToLocalString(startDate))} to ${chalk.green(TimeUtils.dateToLocalString(endDate))})`;
	console.log(boxen(outString, BOXEN_DATE_SETTINGS));

	// Handle case for 0 executions in specified week
	if (testExecs.length == 0) {
		outString = `No TestExecutions found for week of ${chalk.green(TimeUtils.dateToLocalString(startDate, false))} to ${chalk.green(TimeUtils.dateToLocalString(endDate, false))}`;
		console.log(boxen(outString, BOXEN_ZERO_TESTEXEC_SETTINGS));
		return;
	}
	
	testExecs.forEach(el => {
		const user = el.getTesterUsername();
		const status = el.getStatusName();
		upsertExecutionCount(user, status);
	});
	
	
	const statColors = {};
	execStats.forEach(stat => {
		statColors[stat.getName()] = stat.getColor();
	});
	
	outString = '';
	for (const [userName, userMetrics] of Object.entries(executionResults)) {
		outString += `${chalk.bold(userName.padStart(NAME_MAX_WIDTH, ' '))} : `;
		// Interate through metrics
		for (const [statName, statColor] of Object.entries(statColors)) {
			let statCount = userMetrics[statName] || 0;
			statCount = statCount.toString().padStart(3, '0');
			outString += `  ${chalk.bold.hex(statColor)(statName)}: ${chalk.hex(statColor)(statCount)}`;
		}
		//console.log(outString);
		outString += '\n';
	}
	console.log(boxen(outString, BOXEN_TESTEXEC_SETTINGS));
	
}

async function printTestCreationMetrics(testsCreated) {
	// Print Title Box
	outString = `TestCase Creation Metrics for Week of ${chalk.green(TimeUtils.dateToLocalString(sourceDate, false))}`;
	outString += `\n(${chalk.green(TimeUtils.dateToLocalString(startDate))} to ${chalk.green(TimeUtils.dateToLocalString(endDate))})`;
	console.log(boxen(outString, BOXEN_DATE_SETTINGS));
	
	// Handle case for 0 TCs created in specified week
	if (testsCreated.length == 0) {
		outString = `No Test Cases were created during ${chalk.green(TimeUtils.dateToLocalString(startDate, false))} to ${chalk.green(TimeUtils.dateToLocalString(endDate, false))}`;
		console.log(boxen(outString, BOXEN_ZERO_TESTEXEC_SETTINGS));
		return;
	}
	
	testsCreated.forEach(el => {
		const user = el.getAuthorName();
		upsertCreationCount(user);
	});
	outString = '';
	for (const [userName, userMetrics] of Object.entries(creationResults)) {
		outString += `${chalk.bold(userName.padStart(NAME_MAX_WIDTH, ' '))} : ${userMetrics}`;
		outString += '\n';
	}
	console.log(boxen(outString, BOXEN_TESTCREATED_SETTINGS));
}

function upsertCreationCount(user) {
	if(!(creationResults[user])) {
		creationResults[user] = 0;
	}
	creationResults[user] += 1;
}

function upsertExecutionCount(user, status) {
	
	// create new entry for user if not exists
	if (!(executionResults[user])) {
		executionResults[user] = {};
	}
	
	// create count for status if not exists
	if (!(executionResults[user][status])) {
		executionResults[user][status] = 0;
	}
	
	executionResults[user][status] += 1;
	
}

