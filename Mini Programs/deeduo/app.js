//app.js
import pop from './common/js/toast'
import objectAssign from "./common/js/object-assign"
import $http from './common/js/https'
import api from './config/api'
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);

		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				const url = api.test;
				const param = {};
				const configs = {
					resFn: (res, callback, configs) => {
						callback(res.data, configs)
					}
				};
				const callback = (data) => {
					this.globalData.motto = data.data;
				};
				try {
					$http.get(url, param, callback, configs);
				}
				catch(err) {
					alert(err.errMsg)
				}
			}
		});
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					});
				}
			}
		})
	},
	globalData: {
		userInfo: null,
		// 变量 || 对象
		motto: '',
		api: api,
		// 方法
		// 双向绑定数据方法
		duplexBind(e) {
			let obj = {};
			obj[e.currentTarget.dataset.model] = e.detail.value;
			this.setData(obj)
		},
		// 弹窗方法
		pop: pop,
		// 合并对象方法
		objectAssign: objectAssign,
		// 请求方法
		$http: $http,
	},
});