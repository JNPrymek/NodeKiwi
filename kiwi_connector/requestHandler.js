import _ from 'lodash';
import Axios from 'axios';
import AxiosCookieJarSupport from 'axios-cookiejar-support';
import ToughCookie from 'tough-cookie';

import ConnectionError from '../models/errors/connectionError.js';

AxiosCookieJarSupport.default(Axios);

export default class RequestHandler {
	static cookieJar = new ToughCookie.CookieJar();
	
	static headersTemplate = {
		'Content-Type': 'application/json',
		'Accept': '*/*',
		'Cookie': 'temptest=1',
		'withCredentials': true
	};
	
	static bodyTemplate = {
		'id' : 'jsonrpc',
		'jsonrpc' : '2.0'
	};
	
	static printDefaults() {
		console.log('Head:  ' + JSON.stringify(this.headersTemplate));
		console.log('Body:  ' + JSON.stringify(this.bodyTemplate));
	}
    
	static async sendPost(url, body, headers =  {}) {
        
		// Create header & body objects using passed values and templates
		let sendBody = {};
		_.defaults(sendBody, body);
		_.defaults(sendBody, this.bodyTemplate);
        
		let sendHeaders = {};
		_.defaults(sendHeaders, headers);
		_.defaults(sendHeaders, this.headersTemplate);
        
		//Add cookies from cookie jar
		sendHeaders.Cookie = await this.cookieJar.getCookieString(url);
        
		//Send request & await response
		const response = await Axios
			.post(url, JSON.stringify(sendBody), {headers: sendHeaders})
			.catch(err => {
				const errMsg = `Network Error   ${err.errno} : ${err.code}`;
				throw new ConnectionError(errMsg);
			});
        
		// Save cookies if applicable
		const responseCookies = response.headers['set-cookie'];
		if (responseCookies != null)
		{
			responseCookies.forEach( resCookieString => {
				//console.log(resCookieString);
				this.cookieJar.setCookieSync(resCookieString, url);
			});
		}
        
		return response;
	}
}