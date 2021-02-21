# Node Kiwi Tools

## About
A Node JS library for interacting with Kiwi TCMS.
This library uses Kiwi's JSON-RPC API


## Usage

### Getting Started
1. Install [Node JS](https://nodejs.org).
2. Install and enable [Node Version Manager](https://github.com/nvm-sh/nvm).  If your system is running Node v14, you can skip this step.
3. Export [Environment Variables](#Environment-Variables) to your shell session (I recommend adding them to your `~/.bashrc` or `~/.bash_profile` files).
4. Open a command prompt in the project root directory.  This documentation uses the `bash` shell, so you may have to convert sytax if you use a different shell.
5. Run `nvm use` to switch to the expected Node version.
6. Run `npm install` to install dependencies.

#### Environment Variables
The following variables must be added to your shell session.
|	Variable	|	Default Value (If Not Set)	|	Description	|
|	:---		|	:--:			|	:---		|
|	KIWI_URL	|	`localhost:80`	|	URL of your Kiwi server.	|
|	KIWI_USERNAME	|	`''`	|	Login Credential.  Actions performed via API calls will rely on this user's permissions.	|
|	KIWI_PASSWORD	|	`''`	|	Login Credential	|
|	KIWI_SSL	|	`false`	|	Set to `true` (case insensitive) to enable SSL / HTTPS.	|
|	NODE_TLS_REJECT_UNAUTHORIZED	|	N/A	|	**For Development Only** - Set to `0` to allow Node to ignore self-signed or invalid SSL certificates.	|

---

### Getting weekly test execution metrics
`scripts/getWeeklyMetrics.js` provides a summary of test execution results for all users in a given week.  The default starting day of a week is Sunday.  
Usage:
```
getWeeklyMetrics -a  -e [anchorDate] -w [weekStartIndex]
	Arguments:
		anchorDate				Any date within the week for which you want metrics.
								Defaults to current date (local time).
	Options:
		-w, --weekStartIndex	Index of first day of week.  Sun=0, Mon=1, Tues=2...
		-e, -r, --execution		Display TestExecution Metrics (pass/fail/etc) for the specified week
		-a, -c, --creation		Display TestCase Creation Metrics for the specified week
		
```

Note:  By default, Kiwi stores all times in UTC.  This script auto-converts from local time to UTC, and assumes all input is given in the same timezone as the current local system time.

---

## Links
Documentation for Kiwi TCMS can be found [here](https://kiwitcms.readthedocs.org).  
Check out the [Kiwi TCMS Github Repo](https://github.com/kiwitcms/kiwi) for issues, bug reports, and more.  
