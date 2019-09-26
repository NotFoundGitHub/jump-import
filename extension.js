const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const getAliasConfig = require("./lib/common/getAliasConfig")
const isExistFile = require("./lib/common/isExistFile");
const getCurrentAliasKey = require("./lib/common/getCurrentAliasKey");
const handleMockJson = require("./lib/common/handleMockJson");

// 简写配置
let config;

function provideDefinition(document, position, token) {
	const fileName = document.fileName;
	let workDir = path.dirname(fileName);
	// const word = document.getText(document.getWordRangeAtPosition(position));
	const line = document.lineAt(position);

	// 获得根目录
	let workDir1 = workDir.split(path.sep);
	let root = workDir1
		.slice(
			0,
			workDir1.indexOf("lib") !== -1
				? workDir1.indexOf("lib")
				: workDir1.indexOf("src") !== -1
					? workDir1.indexOf("src")
					: workDir1.indexOf("raw")!== -1
						? workDir1.indexOf("raw")
						: workDir1.indexOf("config")!== -1
							? workDir1.indexOf("config")
							: workDir1.indexOf("tool")
		)
		.join("/");
	console.log("root", root);
	let mode;

	// 判断是否存在别名配置，避免重复读取
	if (!config) {
		config = getAliasConfig(root)
	}
	aliasConfig = config.setting;
	mode = config.mode;


	console.log("line: ", line.text); // 当前光标所在行
	// 简写
	aliasConfig = {
		"@": "/src/",
		...aliasConfig
	}

	const methodArr = ["get", "post", "put", "delete"];
	// 文件后缀类型
	const extArr = [".js", ".vue", ".json", ".html"];


	let libPath = line.text;
	let alias = "lib";

	console.log("libPath: ", libPath); // 当前光标所在行

	// 获取import里面内容
	let target = /'(.+)'|"(.+)"|`(.+)`/gim.exec(libPath)[1];
	console.log("target: ", target);

	// pool/k12-cache-business/src/cache-course/common/constant
	let prefix = getCurrentAliasKey(target, aliasConfig);

	console.log("prefix: ", prefix);

	let content = (prefix ? target.replace(`${prefix}/`, `${aliasConfig[prefix]}`) : target).replace("{mode}", mode === "wap" ? "wap" : "web");

	// 针对mock数据处理
	if (/^\/api|^\/j |^\/p/.test(content)) {
		content = handleMockJson(root, line.text, content, methodArr);
	}
	console.log("content: ", content); // 当前光标所在行

	let destPath;
	if (content.split("/")[0].includes(".")) {
		destPath = path.resolve(workDir, content);
	} else {
		destPath = path.join(root, content);
	}

	console.log("destPath: ", destPath); // 当前光标所在行

	// 判断是否存在文件并进行添加后缀
	if (!isExistFile(destPath)) {
		extArr.some(item => {
			if (isExistFile(destPath + item)) {
				destPath = destPath + item;
				return true;
			}
		});
	}
	// 跳转文件
	if (fs.existsSync(destPath)) {
		return new vscode.Location(
			vscode.Uri.file(destPath),
			new vscode.Position(0, 0)
		);
	}
}

function activate(context) {
	let disposable = vscode.languages.registerDefinitionProvider(
		["javascript", "vue", "json", "html","markdown","scss", "sass", "css", "ftl", "typescript","FreeMarker"],
		{
			provideDefinition
		}
	)
	context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }

module.exports = {
	activate,
	deactivate
};
