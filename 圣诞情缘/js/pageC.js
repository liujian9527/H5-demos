function PageC(){
	var me=this;
	this.$window   = $(".page-c .window");
	this.$deer = $('.deer')
    this.$leftWin  = this.$window.find(".window-left");
    this.$rightWin = this.$window.find(".window-right");
    this.$sceneBg  = this.$window.find(".window-scene-bg");
    this.$closeBg  = this.$window.find(".window-close-bg");
    this.$sceneBg.transition({
        opacity: 0,
    }, 3000);
    this.$closeBg.css("transform", "translateZ(0)")
    this.$closeBg.transition({
        opacity: 1
    }, 5000);
    var closeW=this.closeWindow();
   		closeW.then(function(){
	    	Snowflake("snowflake");
   			me.run();
   		})
    	
}

PageC.prototype.closeWindow=function(){
	var defer=$.Deferred();
	var count = 2;
	var complete = function() {
		if(count == 1) {
			defer.resolve();
			return
		}
		count--
	};
    this.$leftWin.addClass("close").one("animationend", function() {
            complete()
        })
    this.$rightWin.addClass("close").one("animationend", function() {
            complete()
        })
    return defer;
}
PageC.prototype.next=function(option){
	var dfd=$.Deferred();
	this.$deer.transition(
		option.style,
		option.time,
		'linear',
		function(){
			dfd.resolve();
		}
	)
	return dfd;
}
PageC.prototype.run = function() {
	var me=this;
	this.$deer.addClass("deer-animate");
	me.next({
		time: 5e3,
		style: {
			bottom: "4rem",
			right: "-6rem",
			scale: "1"
		}
	})
	.then(function() {
		return me.next({
			time: 100,
			style: {
				rotateY: "-180",
				scale: "0.8"
			}
		})
	})
	.then(function() {
		return me.next({
			time: 1e4,
			style: {
				bottom: "8rem",
				right: "15rem",
				scale: "0.2"
			}
		})
	})
};


/*
function snowflake(){
	var sonwEle=document.getElementById('snowflake');	//获取画布
	var canvasContext=sonwEle.getContext('2d');	//绘制环境
	//步骤 beginPath()→
	canvasContext.beginPath();
	canvasContext.fillStyle = "rgba(255, 255, 255, 0.8)";
	canvasContext.arc(100,100,50,0,Math.PI*2,true)
	canvasContext.closePath();
	canvasContext.fill();
	
}*/
