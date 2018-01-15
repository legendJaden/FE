import objectAssign from "./object-assign";

const allOpt = {
	arrBase: ['title', 'mask', 'success', 'fail', 'complete'],
	arrLoading: [],
	arrToast: ['icon', 'image', 'duration'],
	arrModal: ['content', 'showCancel', 'cancelText', 'cancelColor', 'confirmText', 'confirmColor'],
	arrActionSheet: ['itemList', 'itemColor'],
};
// 格式化传参方法
function initOpt(options, keyList) {
	let obj = {};
	for (let key of keyList) {
		if (options[key] != undefined) {
			obj[key] = options[key];
		}
	}
	console.log(obj);
	return obj;
}

class Pop {
	constructor() {}

	run(type, options) {
		// 执行微信弹窗
		wx['show' + type](initOpt(options, allOpt.arrBase.concat(allOpt['arr' + type])))
	}
}

class Toast extends Pop {
	constructor(options) {
		super();
		if (typeof options == 'string') {
			options = {
				title: options,
			}
		}
		// 默认参数
		this.opt = {
			title: '',
			icon: 'success',
			duration: 1000,
		};
		if (options) {
			super.run('Toast', objectAssign({}, this.opt, options));
		}
	}
	// toast.suc
	suc(options) {
		if (typeof options == 'string') {
			options = {
				title: options,
			}
		}
		// 默认参数
		this.opt = {
			title: '',
			icon: 'success',
			duration: 1000,
		};
		super.run('Toast', objectAssign({}, this.opt, options));
	}
	// toast.err
	err(options) {
		if (typeof options == 'string') {
			options = {
				title: options,
			}
		}
		this.opt = {
			title: '',
			image: '../../imgs/err.png',
			duration: 1000,
		};
		super.run('Toast', objectAssign({}, this.opt, options));
	}
}

class Loading extends Pop {
	constructor(options) {
		super();
		if (typeof options == 'string') {
			options = {
				title: options,
			}
		}
		const opt = {};
		super.run('Loading', objectAssign({}, opt, options));
	}
}

class Modal extends Pop {
	constructor(options) {
		super();
		const opt = {
			title: '提示',
		};
		super.run('Modal', objectAssign({}, opt, options));
	}
}

class ActionSheet extends Pop {
	constructor(options) {
		super();
		const opt = {
			itemList: [],
		};
		super.run('ActionSheet', objectAssign({}, opt, options));
	}
}

const pop = {
	$toast: (options) => new Toast(options),
	toast: {
		suc: (options) => new Toast().suc(options),
		err: (options) => new Toast().err(options)
	},
	loading: (options) => new Loading(options),
	modal: (options) => new Modal(options),
	action: (options) => new ActionSheet(options),
};

export default pop;