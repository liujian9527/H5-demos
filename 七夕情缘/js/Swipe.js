/////////
//页面滑动 //
/////////

/**
 * 两部分
 * 1.页面布局
 * 		根据容器尺寸 获取活动页面大小
 * 2.监控完成与移动
 * 
 * 面向对象
 * 内部定义一个Swipe工厂方法，内部会产生一个swipe的滑动对象，暴露了scrollTo的接口
*/


function Swipe(container){
	//获取第一个子节点 
	var el=container.find(':first');  //ul
	
	//滑动对象
	var swipe={};
	
	//li页面数量
	var slides = el.find(">");
	//获取容器尺寸
	var iWidth=container.width();
	var iHeight=container.height();
	
	//设置li页面总宽度
	el.css({
		'width': (iWidth*slides.length) + 'px',
		'height': iHeight + 'px'
	});
	
	//设置每一个页面li的宽度
	slides.each(function(i,el){
		$(el).css({
			'width': iWidth + 'px',
			'height': iHeight + 'px'
		})
	})
	
	//监控完成与移动
	swipe.scrollTo=function(x,speed){ //x轴移动、 时间
		//执行运动
		el.css({
            'transition-timing-function' : 'linear',
            'transition-duration'        : speed + 'ms',
            'transform'                  : 'translate3d(-' + x + 'px,0px,0px)'
       });
       console.log(this)    //Swipe(container)
	   return this;	   		//方便链式调用 Swipe(container).scrollTo().scrollTo();
	}
	
	return swipe;
}