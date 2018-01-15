/**
 *
 * 小程序公用请求方法
 *
 * created by Wbz @2018.01.08
 *
 * 1. 调用方法：
 *      本文件输出一个对象{
 *          Post,
 *          Get,
 *      }
 *      调用时需实例化如下：
 *      new Post(url, param, callback, configs);
 * 2.参数说明：
 *      1) url: 请求地址url字符串;
 *      2) param: 请求参数，常为Obj类型;
 *      3) callback(res, configs) {}: 请求成功时（通信成功 && 业务成功）的回调函数
 *          a) res: 请求后的响应数据
 *          b) configs: 请求前后的自定义配置对象，包括如下属性：
 *              requestConfig: 请求配置
 *              programConfig: 程序配置
 *              resFn(res, callback, configs) {}: 通信成功回调
 *              errFn(err, url) {}: 通信失败回调
 *
 *      4) configs
 *
 */

import objectAssign from "./object-assign";

class Request {
	constructor() {
		this.request = this.request.bind(this);
		this.resFn = this.resFn.bind(this);
		this.errFn = this.errFn.bind(this);
	}

	// 请求方法
	request(method, url, param, callback, configs) {
		// 格式化请求数据
		const data = JSON.stringify(this.trim(param));
		configs = Object.assign(
			// 当没有传configs的时候，可以有默认值，防止报undefined
			{
				programConfig: {},
				requestConfig: {},
			},
			configs
		);

		// 请求配置
		// 合并headers对象
		const headers = Object.assign(
			{},
			configs.requestConfig.headers
		);
		const requestConfig = Object.assign(
			{},
			configs.requestConfig,
		);

		// 程序配置
		const programConfig = configs.programConfig;

		wx.request({
			url: url,
			data: data,
			header: headers,
			method: method,
			dataType: configs.requestConfig.dataType || 'json',
			responseType: configs.requestConfig.responseType || 'text',
			success: (res, statusCode, header) => {
				configs = objectAssign({}, configs, {
					statusCode: statusCode,
					resHeader: header,
				});
				configs.resFn? configs.resFn(res, callback, configs) : this.resFn(res, callback, configs);
			},
			fail: (err) => {
				configs.errFn? configs.errFn(err, url) : this.errFn(err, url);
			}
		})
	}

	// 成功回调
	resFn(res, callback, configs) {
		if (res.data.succeed) {
			callback(res.data, configs);
		} else {
			console.log(`${res} mini programs' common request method: %c 业务失败：${url}`, 'color: #ff0000')
			throw {
				type: 'business',
				info: res,
				errMsg: '业务失败'
			}
		}
	}

	// 失败回调
	errFn(err, url) {
		console.log(`mini programs' common request method: %c 通信失败：${url}`, 'color: #ff0000', err);
		throw {
			type: 'http',
			info: err,
			errMsg: '通信失败'
		}
	}

	// 消除空格
	trim(param) {
		for (let k in param) {
			if (typeof param[k] == 'string') {
				param[k] = param[k].trim();
			}
		}
		return param;
	}

}

class Post extends Request {
	constructor(url, param, callback, configs) {
		super();
		super.request('post', url, param, callback, configs)
	}
}

class Get extends Request {
	constructor(url, param, callback, configs) {
		super();
		super.request('get', url, param, callback, configs)
	}
}

export default {
	Post,
	Get,
};