
function BoyWalk(){

	var container=$('#content'); 
	// 页面可视区域
	var visualWidth = container.width();
	var visualHeight = container.height();	
	// 获取数据
	var getValue=function(className){
		var $ele=$(''+className+'');
		// 走路的路线坐标
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
	
	// 暂停走路
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

    // 恢复走路
    function restoreWalk() {
        $boy.removeClass('pauseWalk');
    }

    // css3的动作变化
    function slowWalk() {
        $boy.addClass('slowWalk');
    }
    
	// 计算移动距离  x y 比例
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
			function(){
				dfdPlay.resolve(); // 动画完成
			}
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
	
	//var disX=calculateDist('x',0.6);
	//var disY=calculateDist('y',0.5);
	//walkRun(15000,disX,disY);
	
	
	//走进商店
	function walkToShop(runTime){
		var defer=$.Deferred();
		var doorObj = $('.door');
		//门坐标
		var offsetDoor = doorObj.offset().left;
		//小孩当前坐标
		var offsetBoy= $boy.offset();
		var boyOffetLeft = offsetBoy.left;
		
		console.log(offsetDoor)
		console.log(boyOffetLeft)
	}
	
	
    return {
        // 开始走路
        walkTo: function(time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX)
            var distY = calculateDist('y', proportionY)
            return walkRun(time, distX, distY);		/* return 获取Deferred对象  执行后续then操作 */
        },
        // 停止走路
        stopWalk: function() {
            pauseWalk();
        }
    }

}


///////////
//灯动画 //
///////////
var lamp = {
    elem: $('.b_background'),
    bright: function() {
        this.elem.addClass('lamp-bright');
    },
    dark: function() {
        this.elem.removeClass('lamp-bright');
    }
};
	
openDoor().then(function(){
	lamp.bright();
});
shutDoor().then(function(){
	lamp.dark();
});


function doorAction(left, right, time) {
    var $door = $('.door');
    var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;
    // 等待开门完成
    var complete = function() {
        if (count == 1) {
            defer.resolve();
            return;
        }
        count--;
    };
    doorLeft.animate({
        'left': left
    }, time, complete);
    doorRight.animate({
        'left': right
    }, time, complete);
    return defer;
}

// 开门
function openDoor() {
    return doorAction('-50%', '100%', 2000);
}
// 关门
function shutDoor() {
    return doorAction('0%', '50%', 2000);
}


