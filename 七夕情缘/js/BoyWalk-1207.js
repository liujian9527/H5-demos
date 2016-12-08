$(function(){

	//横向布局1  
	var container=$('#content'); 
	var swipe=Swipe(container);
	//swipe.scrollTo($("#content").width() * 2, 5000);
	
	// 页面可视区域2
	var visualWidth = container.width();
	var visualHeight = container.height();	
	// 获取数据
	var getValue=function(className){
		var $ele=$(''+className+'');
		return {
			top: $ele.position().top,
			height: $ele.height()
		}
	};
	// 路的Y轴
	var pathY=function(){
		var data=getValue('.a_background_middle');
		return data.top+data.height/2;
	}();
	// 修正小男孩的正确位置
	var $boy = $("#boy");
    var boyHeight = $boy.height();
    $boy.css({
    	'top' : (pathY-boyHeight+25) + 'px'
    })
    
    ////////////////////////////////////////////////////////
	//===================动画处理============================//
	////////////////////////////////////////////////////////
	
	// 恢复走路
	function restoreWalk(){
		$boy.removeClass('pauseWalk');
	}
	// 普通慢走  css3的动作变化
	function slowWalk(){
		$boy.addClass('slowWalk');
	}
	// 计算移动距离 距离 比例
	function calculateDist(direction, proportion){ 
		return	(direction=='x'?visualWidth:visualHeight) * proportion ;
	}
	
	// 用transition做运动
	function stratRun(options, runTime){
		var dfdPlay = $.Deferred();
	    // 恢复走路
	    restoreWalk();
	    // 运动的属性
		$boy.animate(
			options,
			runTime,
			'linear',
			function(){}
		)
		
		return dfdPlay;
	}
	// 开始走路
	function walkRun(time, dist, disY) {
	    time = time || 3000;
	    // 脚动作
	    slowWalk();
	    // 开始走路
	    var d1 = stratRun({
	        'left': dist + 'px',
	        'top': disY ? disY : undefined
	    }, time);
	    return d1;
	}
	var disX=calculateDist('x',0.6);
	//var disY=calculateDist('y',0.5);
	walkRun(15000,disX);

})