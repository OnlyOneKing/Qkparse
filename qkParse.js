/**
 * by 王青松
 */

/**
 * utils函数引入
 **/
import showdown from './showdown.js';
import HtmlToJson from './html2json.js';
import device from '@system.device'
/**
 * 配置及公有属性
 **/
var realWindowWidth = 0;
var realWindowHeight = 0;
device.getInfo({
  success: function (res) {
    realWindowWidth = res.windowWidth
    realWindowHeight = res.windowHeight
  }
})

var tapFuntion = '';
/**
 * 主函数入口区
 **/
function qkParse(bindName = 'qkParseData', type = 'html', data = '<div class="color:red;">数据不能为空</div>', target, imagePadding, ispurchase, ishd, tapFun, parseAry = false, refresh = false) {
  tapFuntion = tapFun;
  var that = target;
  var transData = {};//存放转化后的数据
  if (type == 'html') {
    transData = HtmlToJson.html2json(data, bindName, ispurchase, ishd);
  } else if (type == 'md' || type == 'markdown') {
    var converter = new showdown.Converter();
    var html = converter.makeHtml(data);
    transData = HtmlToJson.html2json(html, bindName, ispurchase, ishd);
  }
  transData.view = {};
  transData.view.imagePadding = 0;
  if (typeof (imagePadding) != 'undefined') {
    transData.view.imagePadding = imagePadding
  }
  let bindData = {};

  if (parseAry) {
    if (!that.data[bindName]) that.data[bindName] = [];
    if (refresh) { that.data[bindName] = []; }
    that.data[bindName].push(transData);
    bindData[bindName] = that.data[bindName];
  } else {
    
    bindData[bindName] = transData;
  }
  let ardata = bindData.article
  that.article = ardata

  that.qkParseImgLoad = qkParseImgLoad;
  that.qkParseImgTap = qkParseImgTap;
}

// 图片点击事件
function qkParseImgTap(e) {
  var that = this;
  console.log("e.target.dataset", e.target.dataset.idx);
  var nowImgUrl = e.target.dataset.src;
  var tagFrom = e.target.dataset.from;
  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
    if (tapFuntion != '' && tapFuntion != undefined) {
      tapFuntion(e, nowImgUrl, this.data[tagFrom].imageUrls, e.target.dataset.idx);
    } 
  }
}

/**
 * 图片视觉宽高计算函数区 
 **/
function qkParseImgLoad(e) {
  console.log('sassasasa')
  var that = this;
  var tagFrom = e.target.dataset.from;
  var idx = e.target.dataset.idx;
  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
    calMoreImageInfo(e, idx, that, tagFrom)
  }
}
// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
  var temData = that.data[bindName];
  if (!temData || temData.images.length == 0) {
    return;
  }
  var temImages = temData.images;
  //因为无法获取view宽度 需要自定义padding进行计算，稍后处理
  var recal = qkAutoImageCal(e.detail.width, e.detail.height, that, bindName);
  var index = temImages[idx].index
  var key = `${bindName}`
  for (var i of index.split('.')) key += `.nodes[${i}]`
  var keyW = key + '.width'
  var keyH = key + '.height'
  that.setData({
    [keyW]: recal.imageWidth,
    [keyH]: recal.imageheight,
  })
}

// 计算视觉优先的图片宽高
function qkAutoImageCal(originalWidth, originalHeight, that, bindName) {
  //获取图片的原始长宽
  var windowWidth = 0, windowHeight = 0;
  var autoWidth = 0, autoHeight = 0;
  var results = {};
  var padding = that.data[bindName].view.imagePadding;
  windowWidth = realWindowWidth - 2 * padding;
  windowHeight = realWindowHeight;
  //判断按照那种方式进行缩放
  // console.log("windowWidth" + windowWidth);
  if (originalWidth > windowWidth) {//在图片width大于手机屏幕width时候
    autoWidth = windowWidth;
    // console.log("autoWidth" + autoWidth);
    autoHeight = (autoWidth * originalHeight) / originalWidth;
    // console.log("autoHeight" + autoHeight);
    results.imageWidth = autoWidth;
    results.imageheight = autoHeight;
  } else {//否则展示原来的数据
    results.imageWidth = originalWidth;
    results.imageheight = originalHeight;
  }
  return results;
}

function qkParseTemArray(temArrayName, bindNameReg, total, that) {
  var array = [];
  var temData = that.data;
  var obj = null;
  for (var i = 0; i < total; i++) {
    var simArr = temData[bindNameReg + i].nodes;
    array.push(simArr);
  }

  temArrayName = temArrayName || 'qkParseTemArray';
  obj = JSON.parse('{"' + temArrayName + '":""}');
  obj[temArrayName] = array;
  that.setData(obj);
}

/**
 * 配置emojis
 * 
 */

function emojisInit(reg = '', baseSrc = "/qkParse/emojis/", emojis) {
  HtmlToJson.emojisInit(reg, baseSrc, emojis);
}

module.exports = {
  qkParse: qkParse,
  qkParseTemArray: qkParseTemArray,
  emojisInit: emojisInit
}


