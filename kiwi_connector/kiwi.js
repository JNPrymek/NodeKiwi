import RequestHandler from './requestHandler.js'
import KIWI_SETTINGS from '../config/tcms.js' 
import ConnectionError from '../models/errors/connectionError.js'
import LoginError from '../models/errors/loginError.js';

export default class Kiwi {
	
	static getJsonRpcUrl() {
		return `http${KIWI_SETTINGS.server_secure ? 's' : ''}://${KIWI_SETTINGS.url}${KIWI_SETTINGS.json_rpc}`;
	}
	
	static async sendRpcMethod(methodName, params = null) {
		const url = Kiwi.getJsonRpcUrl();
		const body = {
			'method' : methodName
		};
		if (params) {
			body.params = params;
		}
		
		//console.log(`Kiwi.sendRpcMethod to ${url}\nBody = \n${JSON.stringify(body)}`)
		
		const response = await RequestHandler.sendPost(url, body);
		
		if ( response.status != 200 || !response.data ) {
			throw new ConnectionError(`Bad response from ${url}`);
		}
		return response.data;
	}
	
	static async login(username = KIWI_SETTINGS.username, password = KIWI_SETTINGS.password) {
		const resData = await Kiwi.sendRpcMethod('Auth.login', [username, password]);
		
		if(resData.error) {
			throw new LoginError(`Error Code ${resData.error.code} - ${resData.error.message}`);
		}
		return resData.result;//.result;
    }
    
    static async logout() {
        return await Kiwi.sendRpcMethod('Auth.logout');
    }
}