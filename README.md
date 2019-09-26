
# jump-import &#x1F644;

## 前言(feihua)： 
能ctrl自己跳转的，绝对不一个一个文件夹去找，老夫写代码从来都是 **一把梭**

亲亲，下载了本插件最好看一下演示&#x1F642;

佛系修bug，请尽管提，改了算我输 &#x1F642;

## 功能(feature)：跳转代码插件

好了，我支持自定义了，开心了吧，举个栗子&#x1F447;
```javascript
    {
        // settings.json
        // 配置自定义的别名 路径前后带上斜杠/
        "jump.alias": {
            "wap":"/src/wap/javascript/"
        },
    }
```


&#x1F642; 支持网易nej工程，vue工程

&#x1F642; 支持import内容中路径的跳转，尤其还增加了{mode}解析

&#x1F642; 支持各种奇奇怪怪的缩写&#x1F60F;，eg. pool @ pro util开头的

&#x1F642; 它还支持nei 里面那些data.json的跳转，只需要点击接口，无论你是/user/{userId}还是别的花里胡哨的，老夫跳转从来都是一把梭&#x1F606;

&#x1F642; 最普通的 . ../ 跳转我就不说了吧

&#x1F642;  跳转的原理就是根据你的release.conf配置来的，所以= =



## 使用方法 &#x1F34E;
1. 按住Ctrl不放，鼠标左键点击 &#x1F680;的一下就到你想去的地方
2. 重复步骤 1

## 重点说明！！！！ &#x1F913;
1. 如果你发现跳转不了，首先找一下自己的问题
2. 有时候一行有多个导入，define里面的包都写在一行，对不起，本插件只支持单行的，所以没办法跳了？？ 不，你可以把这一行单独拎出来，然后一回车就好了&#x1F632;
3. 跳转的原理就是根据引号里面的字符串来的，怎么操作就靠你脑洞大开了&#x1F61B;

## 演示&#x1F61D;
1. 反正按Ctrl就对了，支持pool,pro，@只要你定义了，它都能跳

![img](https://raw.githubusercontent.com/NotFoundGitHub/jump-import/master/res/img/test1.gif)

2. 无论你是常规方式还是axios，都可以跳转

![img](https://raw.githubusercontent.com/NotFoundGitHub/jump-import/master/res/img/test2.gif)

3. 如果遇到define里面定义了很长的，可以回车一下，单独拎出来

![img](https://raw.githubusercontent.com/NotFoundGitHub/jump-import/master/res/img/test3.gif)
