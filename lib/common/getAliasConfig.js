const path = require("path");
const fs = require("fs");
const isExistFile = require("./isExistFile");

// 获得别名配置
function getAliasConfig(root) {
	const ftlArr = ["/src/web/views/common/config.ftl", "/src/wap/views/common/config.ftl"];
	const releaseArr = ["/deploy/web/release.conf", "/deploy/wap/release.conf"];
	const webpackArr = ["/build/webpack.base.conf.js"];

	ftlPathArr = getFilePath(root, ftlArr)
	releasePathArr = getFilePath(root, releaseArr)

	const ftlSet = handleFtl(ftlPathArr);
	const releaseSet = handleRelease(releasePathArr)

	return {
		setting: { ...(ftlSet.setting), ...(releaseSet.setting) },
		mode:releaseSet.mode
	}
}

// 获得文件路径
function getFilePath(root, shortPathArr = []) {
	return shortPathArr.map(shortPath => path.join(root, shortPath))
}

// 处理config.ftl文件
function handleFtl(ftlPathArr = []) {
	let setting = {}
	ftlPathArr.map(ftlPath => {
		if (isExistFile(ftlPath)) {
			console.log("ftlPath yes",ftlPath)
			let config = fs.readFileSync(ftlPath, "utf8");
			let nejRoot = /nejRoot\s*=\s*\"(.+?)\"/img.exec(config);
			if (nejRoot) {
				nejRoot = nejRoot[1];
				let nejConfig = nejRoot.split("?")[1].split("&")
				nejConfig && nejConfig.map(alias => {
					alias = alias.split("=");
					let key = alias[0]
					let value = alias[1]
					setting[key] = value
				})
			}
		}
	})
	return {
		setting
	}
}

// 解析release.conf文件
function handleRelease(releasePathArr = []) {
	let setting = {}
	let mode;
	releasePathArr.map(releasePath => {
		if (isExistFile(releasePath)) {
			let releaseConfig = fs.readFileSync(releasePath, "utf8");
			let ALIAS_DICTIONARY = /ALIAS_DICTIONARY\s*=\s*({.+?})/.exec(releaseConfig)
			let NEJ_PARAMETERS = /NEJ_PARAMETERS\s*=\s*({.+?})/.exec(releaseConfig)
			if (ALIAS_DICTIONARY) {
				ALIAS_DICTIONARY = ALIAS_DICTIONARY[1];
				let config2 = JSON.parse(ALIAS_DICTIONARY)
				let nejConfig2 = config2["nejRoot"].split("?")[1].split("&")
				nejConfig2 && nejConfig2.map(alias => {
					alias = alias.split("=");
					let key = alias[0]
					let value = alias[1]
					setting[key] = value
				})
				setting = { ...setting, "csRoot": config2["csRoot"], "jsRoot": config2["jsRoot"] }
			}
			if (NEJ_PARAMETERS) {
				mode = JSON.parse(NEJ_PARAMETERS[1])["mode"]
			}
		}
	})
	return {
		setting,
		mode
	}

}

module.exports = getAliasConfig;