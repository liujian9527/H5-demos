
function PageB(element, callback){  //旋转木马
	var $boy=element.find('.christmas-boy');
	var $girl=element.find('.girl');
	var $carousel = element.find("#carousel");
	var boyAction = {
		walk:function(){//走路
			var dfd = $.Deferred();
            $boy.transition({
                "right": "4.5rem"
            }, 4000, "linear", function() {
                dfd.resolve()
            });
            return dfd;
		},
		stopWalk:function(){//停止走路
			$boy.removeClass("boy-walk")
			$boy.addClass("boy-stand");
		},
		runWalk:function(){//继续走路
			$boy.addClass('walk-run')
		},		
		unwrapp:function(){//解开包裹
			var dfd = $.Deferred();
            $boy.addClass("boy-unwrapp");
            $boy.removeClass("boy-stand");
            $boy.one('animationend', function() {
                dfd.resolve();
            })
            return dfd;
		},	
        strip: function(count) {//脱衣动作 1-3
            $boy.addClass("boy-strip-" + count).removeClass("boy-unwrapp");
        },
        hug: function() {//人物用拥抱  重叠问题处理
            $boy.addClass("boy-hug").one('animationend', function() {
                $(".christmas-boy-head").show();
            })
        }
	}
	var girlAction={
		standUp:function(){
			var dfd=$.Deferred();
			setTimeout(function(){
				$girl.addClass('girl-standUp')
			},200)
			setTimeout(function(){
                $girl.addClass("girl-throwBook");
                $('.cat').addClass('cat-book')
                dfd.resolve()
            },500)
            return dfd;
		},
		walk: function() {//小女孩走路
            var dfd = $.Deferred();
			$girl.addClass("girl-walk");
			$girl.transition({
			        "left": "4.5rem"
			}, 4000, "linear", function() {
			        dfd.resolve()
			 })
			 return dfd;
		},
        stopWalk: function() {//停止走路
            $girl.addClass("walk-stop")
                .removeClass("girl-standUp")
                .removeClass("girl-walk")
                .removeClass("girl-throwBook")
                .addClass("girl-stand")
        },        
        reset:function(){
        	$girl.removeClass("girl-choose")
        },
        choose: function() {//选择3d

        	var dfd=$.Deferred();
            $girl.addClass("girl-choose").removeClass("walk-stop");
            $girl.one('animationend', function() {
         		dfd.resolve();
            })
            return dfd;
        },
        weepWalk: function() {//泪奔
        	var dfd=$.Deferred(); 
            $girl.addClass("girl-weep");
            $girl.transition({
                "left": "7rem"
            }, 1000, "linear", function() {
                $girl.addClass("walk-stop").removeClass("girl-weep")
                dfd.resolve();
            })
            return dfd;
        },
        hug: function() {//拥抱
            $girl.addClass("girl-hug").addClass("walk-run");
        }
	}
	//3d旋转
    var carousel=new Carousel($carousel, {
	        imgUrls: [
	            "images/carousel/1.png",
	            "images/carousel/2.png",
	            "images/carousel/3.png"
	        ],
	        videoUrls: [
	            "images/carousel/1.mp4",
	            "images/carousel/2.mp4",
	            "images/carousel/3.mp4"
	        ]
	   });
	//boy走路→目的地→停止走路→girl起身（站起 抛书）→girl走路→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→
	var obj=callback;
	boyAction.walk()
	.then(function(){
		boyAction.stopWalk();
	})
	.then(function(){
	    return girlAction.standUp()
	})
	.then(function(){
        return girlAction.stopWalk();
    })
	.then(function(){
        return girlAction.walk();
    })
	.then(function(){
		girlAction.stopWalk();
        return boyAction.unwrapp();
    })
	.then(function(){
		carousel.initStyle();
		carousel.render();
		return carousel.run(1);
	})
	.then(function(){
		return girlAction.choose()
	})
	.then(function(){
		return carousel.selected();
	})
	.then(function(){
		return carousel.playVideo(function(){
			setTimeout(function(){
				boyAction.strip(1);
				carousel.reset();
				girlAction.reset();
			},1000)
		})
	})
	.then(function(){
		return carousel.run(2);
	})
	.then(function(){
		return girlAction.choose()
	})
	.then(function(){
		return carousel.selected();
	})
	.then(function(){
		return carousel.playVideo(function(){
			setTimeout(function(){
				boyAction.strip(2);
				carousel.reset();
				girlAction.reset();
			},1000)
		})
	})
	.then(function(){
		return carousel.run(3);
	})
	.then(function(){
		return girlAction.choose()
	})
	.then(function(){
		return carousel.selected();
	})
	.then(function(){
		return carousel.playVideo(function(){
			setTimeout(function(){
				boyAction.strip(3);
				carousel.reset();
				girlAction.reset();
			},1000)
		})
	})
	.then(function(){
		carousel.destroy();
		return girlAction.weepWalk();
	})
	.then(function(){
		girlAction.hug();
		boyAction.hug();
		obj&&obj();
	})
}





















//模拟执行时间
//	setTimeout(function() {
//
//		callback()
//
//	}, 1000)