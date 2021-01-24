
export default {
	'url' : process.env.KIWI_URL || 'localhost:80',
	'server_secure' : process.env.KIWI_SSL ? (process.env.KIWI_SSL.toLowerCase() == 'true') : false,
	'username' : process.env.KIWI_USERNAME || '',
	'password' : process.env.KIWI_PASSWORD || '',
	'json_rpc' : '/json-rpc/'
}