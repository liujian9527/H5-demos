/*
 *页面布局
 *  container visualWidth visualHeight
 * 	swipe(container)  swipe.scrollTo(x,speed)
 *boyWalk
 * boy位置  
 *  boyWidth boyHeight 
 *  getValue(className) 
 *  pathY 
 *  boy.top
 * boy动作 	
 *	暂停走路 pauseWalk()
 *  恢复走路 restoreWalk()
 *  走路动画 slowWalk() 
 * boy移动
 *  计算比例移动距离 calculateDist(direction, proportion)
 *  c3做运动 stratRun(options, runTime)
 *  开始走路 walkRun(time, dist, disY)
 **/
var QiXi = function() {
	var confi = {
		setTime: {
			walkToThird: 6000,
			walkToMiddle: 6500,
			walkToEnd: 6500,
			walkTobridge: 2000,
			bridgeWalk: 2000,
			walkToShop: 1500,
			walkOutShop: 1500,
			openDoorTime: 800,
			closeDoorTime: 500,
			waitRotate: 850,
			waitFlower: 800
		},
		audio: {
			enable: true,
			playURL: 'music/happy.wav',
			cycleURL: 'music/circulation.wav' //循环
		},
		snowflakeURL: [
			'snowflake1.png',
			'snowflake2.png',
			'snowflake3.png',
			'snowflake4.png',
			'snowflake5.png',
			'snowflake6.png'
		]
	}
	
	var container = $('#content');
	var swipe = Swipe(container);
	var visualWidth = container.width();
	var visualHeight = container.height();
	var instanceX;

	function scrollTo(time, proportionX) { // 页面滚动到指定的位置
		var distX = visualWidth * proportionX;
		swipe.scrollTo(distX, time)
	}
	var getValue = function(className) {
		var $elem = $("" + className + "");
		return {
			height: $elem.height(),
			top: $elem.position().top
		}
	};
	var pathY = function() { //路Y轴
		var data = getValue('.a_background_middle');
		return data.top + data.height / 2;
	}();
	var bridgeY = function() { // 桥的Y轴
		var data = getValue('.c_background_middle');
		return data.top;
	}();
	var bird = {
		elem: $(".bird"),
		fly: function() {
			this.elem.addClass('birdFly')
			this.elem.transition({
				right: container.width()
			}, 15000, 'linear');
		}
	};

	var girl = {
		elem: $(".girl"),
		getHeight: function() {
			return this.elem.height()
		},
		rotate: function() {
			this.elem.addClass("girl-rotate")
		},
		setOffset: function() {
			this.elem.css({
				left: visualWidth / 2,
				top: bridgeY - this.getHeight()
			})
		},
		getOffset: function() {
			return this.elem.offset()
		},
		getWidth: function() {
			return this.elem.width()
		}
	};
	var logo = {
		elem: $('.logo'),
		run: function() {
			this.elem.addClass('logolightSpeedIn')
				.on('animationend', function() {
					$(this).addClass('logoshake').off();
				});
		}
	};

	var boy = BoyWalk();
	boy.walkTo(confi.setTime.walkToThird, 0.6)
	.then(function() {
		scrollTo(confi.setTime.walkToMiddle, 1);
		return boy.walkTo(confi.setTime.walkToMiddle, 0.5);
	})
	.then(function() {
		bird.fly()
	})
	.then(function() {
		boy.stopWalk();
		return BoyToShop(boy);
	})
	.then(function() {
		girl.setOffset();
		scrollTo(confi.setTime.walkToEnd, 2);
		return boy.walkTo(confi.setTime.walkToEnd, 0.15);
	})
	.then(function() {
		return boy.walkTo(confi.setTime.walkTobridge, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
	})
	.then(function() {
		var proportionX = (girl.getOffset().left - boy.getWidth() - instanceX + girl.getWidth() / 5) / visualWidth;
		return boy.walkTo(confi.setTime.bridgeWalk, proportionX)
	})
	.then(function() {
		boy.resetOriginal();
		setTimeout(function() {
			girl.rotate();
			boy.rotate(function() {
				logo.run();
				snowflake();
			})
		}, confi.setTime.waitRotate)
	});

	function BoyWalk() {
		var $boy = $("#boy");
		var boyWidth = $boy.width();
		var boyHeight = $boy.height();
		//boy位置
		$boy.css({
			'top': pathY - boyHeight + 25
		});

		function pauseWalk() { // 暂停走路
			$boy.addClass('pauseWalk');
		}

		function restoreWalk() { // 恢复走路
			$boy.removeClass('pauseWalk');
		}

		function slowWalk() { // css3的动作变化
			$boy.addClass('slowWalk');
		}

		function calculateDist(direction, proportion) { // 计算移动距离  x y 比例
			return(direction == 'x' ? visualWidth : visualHeight) * proportion;
		}

		function stratRun(options, runTime) { // 恢复走路-走
			var dfdPlay = $.Deferred();
			restoreWalk(); // 恢复走路
			// 运动的属性
			$boy.transition(
				options,
				runTime,
				'linear',
				function() {
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

		function walkToShop(runTime) {
			var defer = $.Deferred();
			var doorObj = $('.door');
			// 门的坐标
			var offsetDoor = doorObj.offset();
			var doorOffsetLeft = offsetDoor.left;
			// 小孩当前的坐标
			var offsetBoy = $boy.offset();
			var boyOffetLeft = offsetBoy.left;
			// 当前需要移动的坐标  小男孩到商店从门口到店里的距离
			instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);
			// 开始走路
			var walkPlay = stratRun({
				transform: "translateX(" + instanceX + "px),scale(0.3,0.3)",
				opacity: 0.1
			}, 2000);

			// 走路完毕
			walkPlay.done(function() {
				$boy.css({
					opacity: 0
				})
				defer.resolve();
			})
			return defer;
		}
		// 走出店
		function walkOutShop(runTime) {
			var defer = $.Deferred();
			restoreWalk();
			//开始走路
			var walkPlay = stratRun({
				transform: 'translateX(' + instanceX + 'px),scale(1,1)',
				opacity: 1
			}, runTime);
			//走路完毕
			walkPlay.done(function() {
				defer.resolve();
			});
			return defer;
		}

		function talkFlower() { //取花-延时	
			var defer = $.Deferred();
			setTimeout(function() {
				$boy.addClass('slowFlolerWalk');
				defer.resolve();
			}, 1000)
			return defer;
		}

		return {
			walkTo: function(time, proportionX, proportionY) {
				var distX = calculateDist('x', proportionX)
				var distY = calculateDist('y', proportionY)
				return walkRun(time, distX, distY);
			},
			toShop: function() { // 走进商店
				return walkToShop.apply(null, arguments);
			},
			outShop: function() { // 走出商店
				return walkOutShop.apply(null, arguments);
			},
			stopWalk: function() { // 停止走路
				pauseWalk();
			},
			getWidth: function() { // 获取男孩的宽度
				return $boy.width();
			},
			resetOriginal: function() { // 复位初始状态
				this.stopWalk();
				$boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
			},
			rotate: function(callback) { // 转身动作
				restoreWalk();
				$boy.addClass('boy-rotate');
				// 监听转身完毕
				if(callback) {
					$boy.on('animationend', function() {
						callback();
						$(this).off();
					})
				}
			},
			talkFlower: function() { // 取花
				$boy.addClass('slowFlolerWalk');
			}
		}

	}

	//////////////////////商店///////////////////////////////
	var BoyToShop = function(boyObj) {
		var defer = $.Deferred();
		var $door = $(".door");
		var doorLeft = $(".door-left");
		var doorRight = $(".door-right");

		function doorAction(left, right, time) {
			var defer = $.Deferred();
			var count = 2;
			var complete = function() {
				if(count == 1) {
					defer.resolve();
					return
				}
				count--
			};
			doorLeft.transition({
				"left": left
			}, time, complete);
			doorRight.transition({
				"left": right
			}, time, complete);
			return defer
		}

		function openDoor(time) {
			return doorAction("-50%", "100%", time)
		}

		function closeDoor(time) {
			return doorAction("0%", "50%", time)
		}

		function talkFlower() {
			var defer = $.Deferred();
			boyObj.talkFlower();
			setTimeout(function() {
				defer.resolve()
			}, confi.setTime.waitFlower);
			return defer
		}
		var lamp = { //灯动画
			elem: $('.b_background'),
			bright: function() {
				this.elem.hide();
			},
			dark: function() {
				this.elem.show();
			}
		};
		var waitOpen = openDoor(confi.setTime.openDoorTime);
		waitOpen.then(function() {
			lamp.bright();
			return boyObj.toShop($door, confi.setTime.walkToShop)
		}).then(function() {
			return talkFlower()
		}).then(function() {
			return boyObj.outShop(confi.setTime.walkOutShop)
		}).then(function() {
			closeDoor(confi.setTime.closeDoorTime);
			lamp.dark();
			defer.resolve()
		});
		return defer
	};
	//////////////////////雪花///////////////////////////////	
	function snowflake() {
		var $flakeContainer = $('#snowflake'); //雪花容器
		function getImgName() { //随机背景
			return confi.snowflakeURL[Math.floor(Math.random() * 6)]
		};

		function creatSnowBox() { //创建一个雪花元素
			var Url = getImgName();
			return $('<div class="snowbox" />').css({
				'width': 41,
				'height': 41,
				'position': 'absolute',
				'top': 0,
				'backgroundSize': 'cover',
				'zIndex': 10000,
				'backgroundImage': 'url(images/snowflake/' + Url + ')',
			}).addClass('snowRoll');
		};

		setInterval(function() { //开始飘雪
			//运动轨迹
			var startPositionLeft = Math.random() * visualWidth - 100,
				startOpacity = 1,
				endPositionTop = visualHeight - 40;
			endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
				duration = visualHeight * 10 + Math.random() * 5000;
			// 随机透明度，不小于0.5
			var randomStart = Math.random();
			randomStart = randomStart < 0.5 ? startOpacity : randomStart;
			// 创建一个雪花
			var $flake = creatSnowBox();
			$flake.css({
				'left': startPositionLeft,
				'opacity': randomStart
			});
			// 加入到容器
			$flakeContainer.append($flake);
			$flake.transition({
				top: endPositionTop,
				left: endPositionLeft,
				opacity: 0.7
			}, duration, 'ease-out', function() {
				$(this).remove()
			})
		}, 200)
	}
	
	//背景音乐
	function HtmlAudio(url,isloop){
		var audio= new Audio(url);
		audio.autoplay=true;
		audio.loop= isloop || false;
		audio.play();
		return {
			end:function(callback){
				audio.addEventListener('ended',function(){
					callback()
				},false)
			}
		};
	}
//	if (confi.audio.enable) {
//		var audio1=HtmlAudio(confi.audio.playURL);
//		audio1.end(function(){HtmlAudio(confi.audio.cycleURL)})	
//	}
	
}
$(function() {
	QiXi();
})
