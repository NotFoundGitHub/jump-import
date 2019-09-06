// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

const path = require("path");
const fs = require("fs");

function isExistFile(file) {
    try {
        fs.accessSync(file, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function provideDefinition(document, position, token) {
    const fileName = document.fileName;
    let workDir = path.dirname(fileName);
    const word = document.getText(document.getWordRangeAtPosition(position));
    const line = document.lineAt(position);

    console.log("fileName: ", fileName); // 当前文件完整路径
    console.log("line: ", line.text); // 当前光标所在行
    // 简写
    let aliasConf = {
        "@": "src",
        pool: "lib"
    };
    // 文件后缀类型
    let extArr = [".js", ".vue", ".json", ".html"];
    let libPath = line.text;
    let alias = "lib";

    // 后缀判断
    if (libPath.includes("pool")) {
        alias = "pool";
    } else if (libPath.includes("@")) {
        alias = "@";
    }
    // 获取import里面内容
    libPath = libPath
        .match(/'(.+)'|"(.+)"|`(.+)`/gim)[0]
        .replace(/\'|\"|\`/gim, "")
        .replace(`${alias}`, `${aliasConf[alias]}`);
    console.log("libPath: ", libPath); // 当前光标所在行
    let methodArr = ['get', 'post', 'put', 'delete']
    let method = 'get'
    // 针对mock数据处理
    if (/^\/api|^\/j/.test(libPath)) {
        let temp = line.text.match(/\.([a-z]{3,6})\(/);
        temp = temp&&temp[1] || '';
        if (methodArr.includes(temp)) {
            method = temp
        }

        libPath = "mock/api/" + method + '/' + libPath + "/data.json";

    }

    let workDir1 = workDir.split(path.sep);
    workDir = workDir1.slice(0, workDir1.indexOf("lib")!==-1?workDir1.indexOf("lib"):workDir1.indexOf("src")!==-1?workDir1.indexOf("src"):workDir1.indexOf("raw")).join("/");
    let destPath = path.resolve(workDir, libPath);
    // 判断是否存在文件并进行添加后缀
    extArr.some(item => {
        if (isExistFile(destPath + item)) {
            destPath = destPath + item;
            return true;
        } else if (isExistFile(destPath)) {
            return true;
        }
        return false;
    });

    console.log("destPath: ", destPath);
    if (fs.existsSync(destPath)) {
        // new vscode.Position(0, 0) 表示跳转到某个文件的第一行第一列
        return new vscode.Location(
            vscode.Uri.file(destPath),
            new vscode.Position(0, 0)
        );
    }
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "extension.helloWorld",
        function () {
            // The code you place here will be executed every time your command is executed

            // Display a message box to the user
            vscode.window.showInformationMessage("Hello World!");
        }
    );

    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            ["vue", 'javascript', 'json', 'html'],
            {
                provideDefinition
            })
    );

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
};
