import objectAssign from "./object-assign";
import pop from "./toast";
// 项目外的文件无法引入
// import request from "../../../../../../trunk/Src/APEC_FE_Framework/Mini Programs/JS/request"
import request from "./request"

const defaultConfigs = {
	// 默认请求配置
	requestConfig: {
		headers: {
			// 'x-auth-token': sessionStorage.getItem('token'),
			// 'source-type': 'web',   // 管理后台
			// 'role-type': 'mgt', // PC端
			'Content-Type': 'application/json',
		}
	},
	// 默认请求成功函数
	resFn: (res, callback, configs) => {
		if (res.data.succeed) {
			callback(res.data, configs);
		} else {
			pop.toast.err(res.data.errMsg);
		}
	},
	// 默认请求失败函数
	errFn: (err, url) => {
		pop.modal({content: err.errMsg});
		console.log(`mini programs' common request method: %c 通信失败：${url}`, 'color: #ff0000', err);
	}
};


function post(url, param, callback, configs) {

	// 合并配置和程序配置
	configs = objectAssign({}, defaultConfigs, configs)

	new request.Post(url, param, callback, configs);
}
function get(url, param, callback, configs) {

	// 合并配置和程序配置
	configs = objectAssign({}, defaultConfigs, configs)

	new request.Get(url, param, callback, configs);
}

const $https = {
	post,
	get,
};

export default $https;