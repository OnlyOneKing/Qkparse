# Qkparse
该项目可将富文本编辑的html转换为快应用的可视化解决方案


使用方法：

1.将该项目下载到自己的项目文件中
2.在<template>中导入并使用模板文件
<import name="wqs-content" src="../WxParse/wxParse.ux"></import>

<wqs-content node-data="{{article}}"></wqs-content>

3.在<script>中导入并使用js文件
var WxParse = require('../WxParse/WxParse.js')
  
  /**
* WxParse.wxParse(bindName , type, data, target,imagePadding)
* 1.bindName绑定的数据名(必填)
* 2.type可以为html或者md(必填)
* 3.data为传入的具体数据(必填)
* 4.target为Page对象,一般为this(必填)
* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
*/
var that = this;
WxParse.wxParse('article', 'html', article, that, 5);

4.在<style>中导入css文件
@import "../wqs/WxParse/wxParse.css";
  

