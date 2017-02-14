//================================================
//格式化字符串
var slice = Array.prototype.slice
function toArray(a, i, j) {
    return slice.call(a, i || 0, j || a.length);
}

function isDefined(v) {
    return typeof v !== 'undefined';
}

function applyIf(o, c) {
    if (o) {
        for (var p in c) {
            //跳过已存在
            if (!isDefined(o[p])) {
                o[p] = c[p];
            }
        }
    }
    return o;
}

applyIf(String, {
    format: function(format) {
        var args = toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i) {
            return args[i];
        });
    }
});

function Carousel(carousel, options) {	//3d旋转木马
    var $carousel = carousel;	//父级
    var $spinner = carousel.find("#spinner");	//轴 
    var angle = 0;	//旋转角度
    var imgUrls = options.imgUrls;	//图片
    var numpics = imgUrls.length;	//图片总数
    
    var rotate = 360 / numpics;	//角度
    var start = 0;
    var current = 1;
    var $contentElements; //子元素
	this.numpics = numpics;	//图片数量
	
    this.initStyle=function() { //初始化样式
        //场景元素
        $carousel.css({
            "transform": "scale(0.3)",
            "position": "absolute",
            "left": "6.8rem",
			"top": "4.5rem"
        });
        //容器
        $spinner.css({
            "width": "2rem",
            "transform-style": "preserve-3d",
            "transition": "1s"
        })
    }
    function createStr(imgUrl) { //创建结构
        var str = '<div style="transform:rotateY({0}deg) translateZ({1}) scaleY(.9);position:absolute;">'
	        		+ '<img src="{2}" style="width:100%;height:100%;">'
	        		+ '</div>';
		return String.format(str,
            start,
            "1.2rem",
            imgUrl
        )
    }
    this.render=function() {	//绘制页面节点
        //创建内容
        var contentStr = '';
        $.each(imgUrls, function(index, url) {
            contentStr += createStr(url);
            start = start + rotate;	//0+120=120 120+120=240
        })
        $contentElements = $(contentStr);
        $spinner.append($contentElements)
    }
    
	this.selected = function() {
		var t = $carousel.find("img"),
			n = t.length;	
		var dfd=$.Deferred();
		
		t.transition({
			scale: 1.5
		}, 2e3, "linear",function(){
			//transition执行三次
			if(1===n){
			  dfd.resolve();
			}else{
			  return n--;
			}
		});
		return dfd;
	}
	this.destroy = function() {
		$contentElements.remove();
	} 
	this.reset = function() {
		var e = $carousel.find("img");
		e.css("transform","scale(1)" )
		$spinner.css("transform", "rotateY(0deg)")
	}

    
    var currIndex;	//旋转次数,游标,当前页码
    this.run = function(count) {	//运行旋转
    	var dfd=$.Deferred();
        currIndex = count;    //0 1 2
        angle = (count - 1) * rotate + 360;	//360 480 600
        $spinner
            .css("transform", "rotateY(-" + angle + "deg)")
            .one("transitionend", function() {
             	dfd.resolve();
            })
        return dfd;
    }
   
    this.playVideo = function(callback) {	//视频播放
        //索引从0开始
        var dfd=$.Deferred();
        var index = currIndex-1; 
        var element = element || $contentElements.eq(index)		
        var $video = $('<video preload="auto"  class="bounceIn" style="width:50%;height:50%;position:absolute;left:30%;top:35%;"></video>');
        $video.css({
            "position": "absolute",
            "z-index": "999"
        })
        //地址
        $video.attr('src', options.videoUrls[index]);
        //播放
        $video.on("loadeddata", function() {
            $video[0].play();
            callback&&callback();
        })
        //停止
        $video.on("ended", function() {        	
            $video[0].pause();
            //退出效果
            $video.addClass("bounceOut").one("animationend", function() {
                $video.remove();
         		dfd.resolve();
            })
        })
        $carousel.after($video);
        return dfd;
    }
}