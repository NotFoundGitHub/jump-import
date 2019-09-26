
const isExistFile = require("./isExistFile");
const path = require("path");

function handleMockJson(root,line,neiPath,methodArr=["get", "post", "put", "delete"]){
    // 存在某个值为空的话直接返回空
    if(!(root && line && neiPath)) return null;
    let method;

    // axios请求处理,axios.get(...), axios.post(...)
    let type = line.match(/\.([a-z]{3,6})\(/);
    type = (type && type[1]) || "";
    if (methodArr.includes(type)) {
        method = type;
    }
    // 动态路由处理 paper/{paperId}/
    neiPath = neiPath.split("/").map(w=>{
        if(/\{.+?\}/g.test(w)){
          return  w = `_/${w.replace(/\{|\}/g,'')}`
        }
        return w;
    }).join("/")

    // 轮流判断
    let libPath;
    if(!method){
        methodArr.some(method=>{
            tempPath = "/mock/api/" + method + neiPath + "/data.json";
            if(isExistFile(path.join(root,tempPath))){
                libPath = tempPath;   
                return true;
            }
        })
    }
    return libPath ||  "/mock/api/"+method+ neiPath + "/data.json";

}
module.exports = handleMockJson;