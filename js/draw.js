var cFather = document.getElementsByClassName('bg_canvas')[0];
var c       = document.getElementById("myCanvas");
var ctx     = c.getContext("2d");
var c2       = document.getElementById("myCanvas2");
var ctx2     = c2.getContext("2d");
var ss =document.getElementById('ss');
var myTools = document.getElementById("my_tools");
var saveBtn = document.getElementById("save");
var tagName;
var slider = document.getElementById("scale-range");
var scale  = slider.value;

var imageData = ctx.getImageData( 0 , 0 , 1210 , 500 )
var pixelData = imageData.data
 
var drawTool = document.getElementsByClassName("sMenu");
// console.log(drawTool[0]);

var oX,oY       = 0;//起始坐标
var eraserScale = 10;

var width_stroke;

ctx.strokeStyle = "black";
ctx.lineWidth   = 1;
ctx.font        = "30px";


// 底下钮
/**
 * [reset description]重置
 * @return {[type]} [description]
 */
function reset() {
	var reLineWidth = ctx.lineWidth;
	var reFillStyle = ctx.fillStyle;
	console.log(reLineWidth);
	console.log(reFillStyle);
	document.getElementById("myCanvas").width = document.getElementById("myCanvas").width;
	document.getElementById("myCanvas2").width = document.getElementById("myCanvas2").width;
	ctx.strokeStyle = reFillStyle;
	ctx.fillStyle   = reFillStyle;
	ctx2.strokeStyle = reFillStyle;
	ctx2.fillStyle   = reFillStyle;
	ctx.lineWidth = reLineWidth;
	ctx2.lineWidth = reLineWidth;
}


/**
 * [positonOver description]：显示鼠标移动的坐标
 * @param  {[type]} event [description]：js事件参数
 */
var bottomButton = document.getElementsByTagName("button");
bottomButton[0].onclick = function() {
	reset();
}
bottomButton[1].onclick = function() {
	canvasPosition();
}
function canvasPosition () {
	var mousePot = document.getElementById('mouse_div');
		mousePot.style.display = 'block';
	c.onmousemove = function(event) {
		var x = event.offsetX;
		var y = event.offsetY;
		mousePot.style.top     = y  + 'px';
		mousePot.style.left    = x  + 20 + 'px';
		mousePot.innerHTML     = "(" + x + "," + y + ")";
		c.onmouseout = function (event) {
			mousePot.style.display = "none";
			console.log("dispear");
		}
		c.onmouseclick = function (event) {
			mousePot.style.display = "none";
		}
	}
}






// [画笔工具]
/**
 * [oY description] 自由画笔
 * @type {Number}
 */
tagName = myTools.children[0].children[0];
tagName.onclick = function() {
	freeBrush();
}

	ctx.fillStyle="white";
	ctx.fillRect(0,0,1210,500);
function freeBrush() {	
	var flage       = false;//绘图开关

	var tmpX , tmpY ;
	var linePostion = [];  

	ctx.lineJoin = "round" ;

	c.onmousedown = function (event) {

	    c2.style.display = "block";
	    
	    console.log("haha");
		// ctx2.beginPath();
		oX = event.offsetX;
		oY = event.offsetY;
	    linePostion.push({x: oX, y: oY});
	    
		ctx2.moveTo(oX,oY);
		var flag_freeBrush = 1;

		c2.onmousemove = function (event) {
			if(flag_freeBrush){
				ctx2.lineTo(event.offsetX,event.offsetY);
				ctx2.stroke();
				tmpX = event.offsetX;
			    tmpY = event.offsetY;
			    linePostion.push({x: tmpX, y: tmpY});
			}		
		}

		c2.onmouseup = function (event) {

// ctx.moveTo(oX,oY);
			flag_freeBrush = 0;
			smooth(linePostion);
			ctx2.clearRect(0,0,1210,500);
			c2.style.display = "none";
		}

		c2.onmouseout = function (event) {
			flag_freeBrush = 0;
			smooth(linePostion);
			ctx2.clearRect(0,0,1210,500);
			c2.style.display = "none";
		}
	}     	
}
//柔化算法
function smooth(linePostion) {
	ctx.beginPath();
	ctx.moveTo(linePostion[0].x, linePostion[0].y);
	
	for (var i = 1; i < linePostion.length - 2; i++) {
		var c = (linePostion[i].x + linePostion[i + 1].x) / 2;
		var d = (linePostion[i].y + linePostion[i + 1].y) / 2;
		
		ctx.quadraticCurveTo(linePostion[i].x, linePostion[i].y, c, d);
	}
	
	ctx.quadraticCurveTo(linePostion[i].x,linePostion[i].y,
						 linePostion[i + 1].x,linePostion[i + 1].y);
	ctx.stroke();
	linePostion = [];
}




/**
 * [line description] 直线工具 注释部分为法二（带直线跟随，但是只能画一条）
 * @return {[type]} [description]
 */
tagName = myTools.children[1].children[0];
tagName.onclick = function() {
	line();
}
tagName = myTools.children[1].children[1].children[0];
tagName.onclick = function(){
	line_width_thin();
}
tagName = myTools.children[1].children[1].children[1];
tagName.onclick = function(){
	line_width_med();
}
tagName = myTools.children[1].children[1].children[2];
tagName.onclick = function(){
	line_width_thick();
}

function line() {
	var oX,oY       = 0;//起始坐标
	var flage       = 0;//绘图开关
	var dx,dy;
	function drawLine(ox,oy,dx,dy) {
		ctx2.clearRect(0,0,1210,500);
		ctx2.beginPath();
		ctx2.moveTo(oX,oY);
		ctx2.lineTo(dx,dy);
		ctx2.stroke(); 
	}
	c.onmousedown = function (event) {
		oX = event.offsetX;
		oY = event.offsetY;
		flage = 1;
		c2.style.display = "block"; 

		c2.onmousemove = function (event) {
			if (flage) {
				drawLine(oX, oY,event.offsetX,event.offsetY);
				dx = event.offsetX;
			    dy = event.offsetY;
			}
		}
		c2.onmouseup = function (event) {
			c2.style.display = "none";
			flage = 0;
			drawLowLine (oX,oY,dx,dy,ctx);
		}
		function drawLowLine (oX,oY,dx,dy,canvas) {
			canvas.beginPath();
			canvas.moveTo(oX,oY);
			canvas.lineTo(dx,dy);
			canvas.stroke();
		}
	}
}
//改变线粗细
function line_width_thin () {
	ctx.lineWidth = 1;
	ctx2.lineWidth = 1;
	line();
}
function line_width_med () {
	ctx.lineWidth = 5;
	ctx2.lineWidth = 5;
	line();
}
function line_width_thick () {
	ctx.lineWidth = 10;
	ctx2.lineWidth = 10;
	line();
}




/**
 * [graphingRectangle description] 绘制图形
 * @return {[type]} [description]
 */
//绘制矩形

tagName = myTools.children[2].children[1].children[0];
tagName.onclick = function(){
	graphingSquare ();
}
tagName = myTools.children[2].children[1].children[1];
tagName.onclick = function(){
	graphingRectangle ();
}
tagName = myTools.children[2].children[1].children[2];
tagName.onclick = function(){
	graphingCircle ();
}
function graphingRectangle () {
	 c.onmousedown = function (event) {
		oX = event.offsetX;
		oY = event.offsetY;
		c2.style.display = "block"; 
		c2.onmousemove = function(event) {
			ctx2.clearRect(0,0,1210,500);
			ctx.beginPath();
			rectangle_width  = event.offsetX - oX;
			rectangle_height = event.offsetY- oY;
			ctx2.strokeRect(oX,oY,rectangle_width,rectangle_height);
		}
		c2.onmouseup = function (event) {
			ctx.beginPath();
			rectangle_width  = event.offsetX - oX;
			rectangle_height = event.offsetY- oY;
			ctx.strokeRect(oX,oY,rectangle_width,rectangle_height);
			ctx.save();
			c2.style.display = "none";
		}
	}
}
//绘制圆形
function graphingCircle () {
	c.onmousedown = function (event) {
		oX = event.offsetX;
		oY = event.offsetY;
		c2.style.display = "block";
		c2.onmousemove = function(event) {
			ctx2.clearRect(0,0,1210,500);
			ctx2.beginPath();
			var circle_width  = event.offsetX - oX;
			var circle_height = event.offsetY- oY;
			var circle_r = Math.max(circle_width,circle_height);
			ctx2.arc(event.offsetX,event.offsetY,circle_r,0,2*Math.PI);
			ctx2.stroke();
		}
		c2.onmouseup = function (event) {
			ctx.beginPath();
			var circle_width  = event.offsetX - oX;
			var circle_height = event.offsetY- oY;
			var circle_r = Math.max(circle_width,circle_height);
			ctx.arc(event.offsetX,event.offsetY,circle_r,0,2*Math.PI);
			ctx.stroke();
			c2.style.display = "none";
		}
	}
}
//绘制正方形
function graphingSquare () {
	c.onmousedown = function (event) {
		oX = event.offsetX;
		oY = event.offsetY;
		c2.style.display = "block";
		c2.onmousemove = function(event) {
			ctx2.clearRect(0,0,1210,500);
			ctx2.beginPath();
			rectangle_width  = event.offsetX - oX;
			rectangle_height = event.offsetY- oY;
			if(rectangle_height > rectangle_width)
				rectangle_width = rectangle_height;
			ctx2.strokeRect(oX,oY,rectangle_width,rectangle_width);;
		}
		c2.onmouseup = function (event) {
			ctx.beginPath();
			rectangle_width  = event.offsetX - oX;
			rectangle_height = event.offsetY- oY;
			if(rectangle_height > rectangle_width)
				rectangle_width = rectangle_height;
			ctx.strokeRect(oX,oY,rectangle_width,rectangle_width);
			ctx.save();
			c2.style.display = "none";
		}
	}
}



/**
 * [onmousedown description] 填入文字
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */

tagName = myTools.children[3].children[0];
tagName.onclick = function(){
	texting();
}
tagName = myTools.children[3].children[1].children[0];
tagName.onclick = function(){
	textFont_small();
}
tagName = myTools.children[3].children[1].children[1];
tagName.onclick = function(){
	textFont_med();
}
tagName = myTools.children[3].children[1].children[2];
tagName.onclick = function(){
	textFont_big();
}
function texting () {
	c.onmousedown = function (event) {
		oX = event.offsetX;
		oY = event.offsetY;
		var ctx_text = window.prompt('输入填充的文字');
		if(ctx_text == null) return false; 
	    ctx.fillText(ctx_text,oX,oY);
	}
	ctx.save();
}
//改变字体大小
function textFont_small () {
	ctx.font = "30px Arial";
	texting();
}
function textFont_med () {
	ctx.font = "45px Arial";
	texting();
}
function textFont_big () {
	ctx.font = "60px Arial";
	texting();
}



    


/**
 * [onmousedown description]  灌色工具（问题啊，只能灌色目前路径的图形）
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */

tagName = myTools.children[4].children[1].children[0];
tagName.onclick = function(){
	colorChange_red();
}
tagName = myTools.children[4].children[1].children[1];
tagName.onclick = function(){
	colorChange_green();
}
tagName = myTools.children[4].children[1].children[2];
tagName.onclick = function(){
	colorChange_blue();
}
tagName = myTools.children[4].children[1].children[3];
tagName.onclick = function(){
	colorChange_yellow();
}
tagName = myTools.children[4].children[1].children[4];
tagName.onclick = function(){
	colorChange_white();
}
tagName = myTools.children[4].children[1].children[5];
tagName.onclick = function(){
	colorChange_black();
}

function colouring () {
	c.onmousedown = function (event) {
		ctx.fill();
	}
}
//改变颜色
function colorChange_red () {
	ctx.strokeStyle = "#ff0004";
	ctx.fillStyle   = "#ff0004";
	ctx2.strokeStyle = "#ff0004";
	ctx2.fillStyle   = "#ff0004";
}
function colorChange_yellow () {
	ctx.strokeStyle = "#fff000";
	ctx.fillStyle   = "#fff000";
	ctx2.strokeStyle = "#fff000";
	ctx2.fillStyle   = "#fff000";
}
function colorChange_green () {
	ctx.strokeStyle = "#2aff00";
	ctx.fillStyle   = "#2aff00";
	ctx2.strokeStyle = "#2aff00";
	ctx2.fillStyle   = "#2aff00";
}
function colorChange_blue () {
	ctx.strokeStyle = "#008aff";
	ctx.fillStyle   = "#008aff";
	ctx2.strokeStyle = "#008aff";
	ctx2.fillStyle   = "#008aff";
}
function colorChange_black () {
	ctx.strokeStyle = "#000";
	ctx.fillStyle   = "#000";
	ctx2.strokeStyle = "#000";
	ctx2.fillStyle   = "#000";
}
function colorChange_white () {
	ctx.strokeStyle = "#fff";
	ctx.fillStyle   = "#fff";
	ctx2.strokeStyle = "#fff";
	ctx2.fillStyle   = "#fff";
}





/**
 * [onmousedown description] 橡皮工具
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */

tagName = myTools.children[5].children[0];
tagName.onclick = function(){
	easer();
}
tagName = myTools.children[5].children[1].children[0];
tagName.onclick = function(){
	easerChange_small ();
}
tagName = myTools.children[5].children[1].children[1];
tagName.onclick = function(){
	easerChange_med ();
}
tagName = myTools.children[5].children[1].children[2];
tagName.onclick = function(){
	easerChange_big ();
}

function easer () {
	c.onmousedown = function (event) {
		oX = event.offsetX;
		oY = event.offsetY;
		var flag_freeBrush = 1;
		c.onmousemove = function (event) {
			if(flag_freeBrush){
				ctx.clearRect(oX,oY,eraserScale,eraserScale);
				oX = event.offsetX;
				oY = event.offsetY;
			}		
	    }
	    c.onmouseup = function (event) {
	    	flag_freeBrush = 0;
	    	ctx.save();
	    }
	}	
}	
// 改变橡皮大小
function easerChange_small () {
	eraserScale = 10;
	easer ();
}
function easerChange_med () {
	eraserScale = 20;
	easer ();
}
function easerChange_big () {
	eraserScale = 30;
	easer ();
}


/**
 * [magnifier description] 放大镜工具
 * @return {[type]} [description]
 */

tagName = myTools.children[6].children[0];
tagName.onclick = function(){
	magnifier();
}
function magnifier () {
	var tmpX,tmpY,imageWidth,imageHeight,sx,sy;
	var image1 = new Image();
	image1.src = c.toDataURL('image/png');
	console.log(image1);
	slider.onmousemove = function(){
		scale = slider.value;
		drawImageByScale( scale ,image1);
	}
	image1.onload = function() {
		drawImageByScale( scale ,image1);
	}
	function drawImageByScale ( scale ,image1){

		// image1.src = c.toDataURL('image/png');

		imageWidth  = 1210  * scale;
		imageHeight = 500 * scale;

		sx = 1210 / 2 - imageWidth / 2; 
		sy = 500 / 2 - imageHeight / 2;

	    ctx.clearRect(0 , 0 , 1210 , 500);
		ctx.drawImage (image1 , sx , sy , imageWidth , imageHeight);
	}
	//抓手工具
	c.onmousedown = function (event) {
		oX = event.offsetX;
		oY = event.offsetY;
		c.onmouseup = function (event) {
	    	tmpX = event.offsetX;
			tmpY = event.offsetY;

			sx += tmpX - oX; 
			sy += tmpY - oY;

			ctx.clearRect(0 , 0 , 1210 , 500);
			ctx.drawImage (image1 , sx , sy , imageWidth , imageHeight);
	    }
    }
    
}


/**
 * [onmousedown description] 滤镜工具
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */

tagName = myTools.children[7].children[1].children[0];
console.log(myTools.children[7].children[1].children[0]);
tagName.onclick = function(){
	// var t = getCanvasData();
	originalImg();
}
tagName = myTools.children[7].children[1].children[1];
tagName.onclick = function(){
	getCanvasData();
	greyEffect();
}
tagName = myTools.children[7].children[1].children[2];
tagName.onclick = function(){
	getCanvasData();
	blurEffect();
}
tagName = myTools.children[7].children[1].children[3];
tagName.onclick = function(){
	getCanvasData();
	mosaicEffect();
}
tagName = myTools.children[7].children[1].children[4];
tagName.onclick = function(){
	getCanvasData();
	reverseEffect();
}
tagName = myTools.children[7].children[1].children[5];
tagName.onclick = function(){
	getCanvasData();
	blackEffect();
}

function getCanvasData(){
	imageData = ctx.getImageData( 0 , 0 , 1210 , 500 );
    pixelData = imageData.data;
}
//滤镜-原图
function originalImg(){
	console.log("haha ");
	ctx.putImageData( imageData , 0 , 0 , 0 , 0 , 1210 , 500 );
}
//滤镜-灰度化
function greyEffect(){
	var tmpimageData = ctx.getImageData( 0 , 0 , 1210 , 500 );
    var tmppixelData = tmpimageData.data;

	for( var i = 0 ; i < 1210 * 500 ; i ++ ){

        var r = tmppixelData[i*4+0];
        var g = tmppixelData[i*4+1];
        var b = tmppixelData[i*4+2];

        var grey = r*0.3+g*0.59+b*0.11;

        tmppixelData[i*4+0] = grey;
        tmppixelData[i*4+1] = grey;
        tmppixelData[i*4+2] = grey;
    }
    ctx.putImageData( tmpimageData , 0 , 0 , 0 , 0 , 1210 , 500 );
}
//滤镜-黑白
function blackEffect(){

	var tmpimageData = ctx.getImageData( 0 , 0 , 1210 , 500 );
    var tmppixelData = tmpimageData.data;
    var bCoclor;

    for( var i = 0 ; i < 1210 * 1210 ; i ++ ){

        var r = tmppixelData[i*4+0];
        var g = tmppixelData[i*4+1];
        var b = tmppixelData[i*4+2];

        var grey = r*0.3+g*0.59+b*0.11;
        if(grey > 125){
            bCoclor = 255;
        }
        else{
            bCoclor = 0;
        }

        tmppixelData[i*4+0] = bCoclor;
        tmppixelData[i*4+1] = bCoclor;
        tmppixelData[i*4+2] = bCoclor;
    }

    ctx.putImageData( tmpimageData , 0 , 0 , 0 , 0 , 1210 , 500 );
}
//滤镜-反色
function reverseEffect(){

    var tmpimageData = ctx.getImageData( 0 , 0 , 1210 , 500 );
    var tmppixelData = tmpimageData.data
    for( var i = 0 ; i < 1210 * 500 ; i ++ ){

        var r = tmppixelData[i*4+0];
        var g = tmppixelData[i*4+1];
        var b = tmppixelData[i*4+2];

        tmppixelData[i*4+0] = 255 - r;
        tmppixelData[i*4+1] = 255 - g;
        tmppixelData[i*4+2] = 255 - b;
    }

    ctx.putImageData( tmpimageData , 0 , 0 , 0 , 0 , 1210 , 500 );
}
//滤镜-模糊
function blurEffect(){

    var tmpImageData = ctx.getImageData( 0 , 0 , 1210 , 500 );
    var tmpPixelData = tmpImageData.data;

    var tmp2ImageData = ctx.getImageData( 0 , 0 , 1210 , 500 );
    var tmp2PixelData = tmp2ImageData.data;

    var blurR = 3;
    var totalnum = (2*blurR + 1)*(2*blurR + 1);

    for( var i = blurR ; i < 500 - blurR ; i ++ )
        for( var j = blurR ; j < 1210 - blurR ; j ++ ){

            var totalr = 0 , totalg = 0 , totalb = 0
            for( var dx = -blurR ; dx <= blurR ; dx ++ )
                for( var dy = -blurR ; dy <= blurR ; dy ++ ){

                    var x = i + dx;
                    var y = j + dy;

                    var p = x*1210 + y;
                    totalr += tmpPixelData[p*4+0];
                    totalg += tmpPixelData[p*4+1];
                    totalb += tmpPixelData[p*4+2];
                }

            var p = i*1210 + j;
            tmp2PixelData[p*4+0] = totalr / totalnum;
            tmp2PixelData[p*4+1] = totalg / totalnum;
            tmp2PixelData[p*4+2] = totalb / totalnum;
        }

    ctx.putImageData( tmp2ImageData , 0 , 0 , 0 , 0 , 1210 , 500 );
}
//滤镜-马赛克
function mosaicEffect(){

    var tmpImageData = ctx.getImageData( 0 , 0 , 1210 , 500 );
    var tmpPixelData = tmpImageData.data;

    var tmp2ImageData = ctx.getImageData( 0 , 0 , 1210 , 500 );
    var tmp2PixelData = tmp2ImageData.data;

    var size = 16;
    var totalnum = size*size;
    for( var i = 0 ; i < 500 ; i += size )
        for( var j = 0 ; j < 1210 ; j += size ){

            var totalr = 0 , totalg = 0 , totalb = 0
            for( var dx = 0 ; dx < size ; dx ++ )
                for( var dy = 0 ; dy < size ; dy ++ ){

                    var x = i + dx;
                    var y = j + dy;

                    var p = x*1210 + y;
                    totalr += tmpPixelData[p*4+0];
                    totalg += tmpPixelData[p*4+1];
                    totalb += tmpPixelData[p*4+2];
                }

            var p = i*1210+j;
            var resr = totalr / totalnum;
            var resg = totalg / totalnum;
            var resb = totalb / totalnum;

            for( var dx = 0 ; dx < size ; dx ++ )
                for( var dy = 0 ; dy < size ; dy ++ ){

                    var x = i + dx;
                    var y = j + dy;

                    var p = x*1210 + y;
                    tmp2PixelData[p*4+0] = resr;
                    tmp2PixelData[p*4+1] = resg;
                    tmp2PixelData[p*4+2] = resb;
                }
    }

    ctx.putImageData( tmp2ImageData , 0 , 0 , 0 , 0 , 1210, 500 );

}




//【关于二级菜单】
 /**
  * [showSecondMenu description] 显示/隐藏 二级菜单
  * @param  {[type]} Name [description]
  * @return {[type]}      [description]
  */
 function showSecondMenu(Name) { 	//显示层 
	 document.getElementById(Name).style.display = "block";
 } 
 function hiddenSecondMenu(Name)  { //隐藏层
	 document.getElementById(Name).style.display = "none"; 
 } 


for(var i = 0 ; i<drawTool.length;i++){
	(function (index) {
		// console.log(drawTool[i]);
		var changeName = "secondaryMenu_" + (i + 1);
		var scMenu = document.getElementById(changeName);
		// console.log(changeName);
		drawTool[i].onmousemove = function() {
			showSecondMenu(changeName); 
			scMenu.onmouseover = function () {
				showSecondMenu(this.id);
			}
		}
		drawTool[i].onmouseout = function () {
			hiddenSecondMenu(changeName);
			scMenu.onmouseout = function () {
				hiddenSecondMenu(this.id);
			}
		}
	})(i);
}


/**
 * [toolChange description] 点击画图工具，改变工具图片
 * @param  {[type]} ele [description] 位置
 * @return {[type]}     [description]
 */
function toolChange (ele) {
	var broforce = ele.parentNode.parentNode.previousSibling.previousSibling;
	var imgNow   = ele.children[0].getAttribute('src');
	// console.log(broforce);
    broforce.children[0].src = imgNow; 
}

// 给<li>下的<a>标签添加toolChange(this)函数
for (var n=1;n<7;n++){
	var sM = document.getElementById("secondaryMenu_" + n);
	(function (obj) {
		// console.log(obj);
		sMChild = obj.children;
		for (var i = 0; i < sMChild.length; i++) {
			(function (index) {
				// console.log(sMChild[index].children[0].children[0]);
				sMChild[index].children[0].onmouseup = function () {
					toolChange(this);
				}
			})(i);
		}
	})(sM);
}






