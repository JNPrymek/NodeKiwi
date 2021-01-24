
import chalk from 'chalk';
import boxen from 'boxen';

import TimeUtils from "../utils/TimeUtils.js";
import TestExecution from '../models/testExecution.js';
import Kiwi from "../kiwi_connector/kiwi.js";
import TestExecutionStatus from '../models/testExecutionStatus.js';

// DEV ONLY ignore SSL Certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sourceDate = new Date();
const startDate = TimeUtils.startOfWeek(sourceDate);
const endDate = TimeUtils.weekAfter(startDate);

const results = {};
let outString = '';

//const dateBorderStyle = {topLeft : '', topRight: '', bottomLeft: '', bottomRight: '', horizontal: '-', vertical: '|'}

main();

async function main() {
	await Kiwi.login();
	outString = `Getting TestExecution Data for week of ${chalk.green(TimeUtils.dateToLocalString(sourceDate))}`;
	outString += `\n(${chalk.green(TimeUtils.dateToLocalString(startDate))} to ${chalk.green(TimeUtils.dateToLocalString(endDate))})`
	console.log(boxen(outString, {borderStyle: 'classic'}));
	

	const ex = await TestExecution.getByDate(startDate, endDate);
	
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
	
	//find length of longest user name
	const userNames = Object.keys(results);
	let userNameMaxLength = 0;
	userNames.forEach(name => {
		if (name.length > userNameMaxLength) {
			userNameMaxLength = name.length;
		}
	})
	
	outString = '';
	for (const [userName, userMetrics] of Object.entries(results)) {
		outString += `${chalk.bold(userName.padStart(userNameMaxLength, ' '))} : `;
		//console.log(userName);
		//console.log(userMetrics);
		// Interate through metrics
		for (const [statName, statColor] of Object.entries(statColors)) {
			let statCount = userMetrics[statName] || 0;
			statCount = statCount.toString().padStart(2, '0');
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

