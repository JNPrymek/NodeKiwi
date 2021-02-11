# Node Kiwi Tools

## About
A Node JS library for interacting with Kiwi TCMS.
This library uses Kiwi's JSON-RPC API


## Usage

### Getting Started
1. Install [Node JS](https://nodejs.org).
2. Install and enable [Node Version Manager](https://github.com/nvm-sh/nvm).
3. Open a command prompt in the project root directory.  This documentation uses the `bash` shell, so you may have to convert sytax if you use a different shell.
4. Run `nvm use` to switch to the expected Node version.
5. Run `npm install` to install dependencies.

### Getting weekly test execution metrics
`scripts/getWeeklyMetrics.js` provides a summary of test execution results for all users in a given week.  The default starting day of a week is Sunday.  
Usage:
```
getWeeklyMetrics  < -c | -e > [anchorDate] -w [weekStartIndex]
	Arguments:
		anchorDate				Any date within the week for which you want metrics.
								Defaults to current date (local time).
	Options:
		-w, --weekStartIndex	Index of first day of week.  Sun=0, Mon=1, Tues=2...
		-e, -r, --execution		Display TestExecution Metrics (pass/fail/etc) for the specified week
		-c, -a, --creation		Display TestCase Creation Metrics for the specified week
		
```

Note:  By default, Kiwi stores all times in UTC.  This script auto-converts from local time to UTC, and assumes all input is given in the same timezone as the current local system time.

---

## Links
Documentation for Kiwi can be found [here](https://kiwitcms.readthedocs.org).  
Check out the [Kiwi TCMS Github Repo](https://github.com/kiwitcms/kiwi) for issues, bug reports, and more.  
