$(function(){
	//横向布局
	var container=$('#content');
	var iWidth=container.width();
	var iHeight=container.height();

	var contentWarp=container.find('.content-warp');
	var slides=contentWarp.find('li');
	contentWarp.css({
		width:iWidth*slides.length,
		height:iHeight
	})
	slides.each(function(i,el){
		$(el).css({
			'width':iWidth,
			'height':iHeight
		})
	})
	
	
	//获取数据
	var getValue=function(className){
		var $ele=$(''+ className+'');
		return {
			height:$ele.height(),
			top:$ele.position().top
		};
	};
	
	//路的Y轴
	var pathY=function(){
		var data=getValue('.a_background_middle');
		return data.top+data.height/2
	}();
	
	var $boy = $("#boy");
    var boyHeight = $boy.height();

    // 修正小男孩的正确位置
    // 路的中间位置减去小孩的高度，25是一个修正值
    $boy.css({
        top: pathY - boyHeight + 25
    });
    
    $boy.animate({
	    'left': ($("#content").width()-400) + 'px',
	}, 50000, 'linear', function() {
		$boy.addClass('pauseWalk')
	});
	
	
	$('button').click(function(){
		contentWarp.css({
			'transition':'5000ms linear',
			'transform':'translate3d(-'+(iWidth*2)+'px,0px,0px)'
		})
	})
})



/*
    走路到页面的2/3的时候，主题页面开始滑动
    走路到1/2的时候，到了商店门口
    进出商店
    走路到1/4到了桥边
    走路到1/2到了桥上
 */