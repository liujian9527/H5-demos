function PageA(element,callback){
	this.$root=element;
	this.$boy=element.find(".chs-boy");
	//窗户
    this.$window = element.find(".window");    
    this.$leftWin  = this.$window.find(".window-left")
    this.$rightWin = this.$window.find(".window-right")
    
	this.run(callback);
}
PageA.prototype.stopWalk=function(){
	 this.$boy.removeClass("chs-boy-deer");
}
PageA.prototype.next=function(option){
	var dfd=$.Deferred();
	this.$boy.transition(
		option.style,
		option.time,
		'linear',
		function(){
			dfd.resolve();
		}
	)
	return dfd;
	
}
PageA.prototype.openWindow=function(){
	 var dfd=$.Deferred();
	 var count = 2;
	 var complete = function() {
		if(count == 1) {
			dfd.resolve();
			return
		}
		count--
	 };
	 this.$leftWin.addClass("window-transition").addClass("hover").one("transitionend",function(){
	 	$(this).removeClass("window-transition");
	 	complete();
	 });
	 this.$rightWin.addClass("window-transition").addClass("hover").one("transitionend",function(){
	 	$(this).removeClass("window-transition");
	 	complete();
	 });
	 return dfd;
}
PageA.prototype.run=function(callback){
	var me=this;
	me.next
	({
        "time": 5000,
        "style": {
            "top": "4rem",
            "right": "16rem",
            "scale": "1.2"
        }
    })
	.then(function(){
    	return me.next({
            "time":500,
            "style": {
               "rotateY" : "-180",
               "scale": "1.5"
            }
        })
    }).then(function(){
    	return me.next({
    		"time": 7000,
            "style": {
                "top"   :"7.8rem",
                "right" : "1.2rem"
            }
    	})
    })
    .then(function(){
        me.stopWalk();
        return me.openWindow();
    })
    .then(function(){
    	callback&&callback();
    })
}















