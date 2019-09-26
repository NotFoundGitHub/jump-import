const fs = require("fs");
// 判断是否存在文件
function isExistFile(file) {
	try {
		fs.accessSync(file, fs.constants.F_OK);
		return true;
	} catch (error) {
		return false;
	}
}
module.exports = isExistFile;
