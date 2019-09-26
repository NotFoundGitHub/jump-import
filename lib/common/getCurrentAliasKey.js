// 获得路径前缀
function getCurrentAliasKey(target, conf) {
    // let target = /'(.+)'|"(.+)"|`(.+)`/gim.exec(line)[1];
    let key = target.split("/").shift();
    if (!target.match(/^\./) && conf[key]) {
        return key;
    }
    return '';
}

module.exports = getCurrentAliasKey;