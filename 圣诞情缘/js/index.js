/*
var observer=new Observer();
observer.publish('s');
//observer.unpublish('s')
observer.subscribe('s',function(){
	
})

var dfd=$.Deferred();
	dfd.resolve();
	return dfd;
*/

function changePage(ele,effect,callback){
	ele.addClass(effect)
		.one('animationend',function(){
			callback&&callback();
		})
}
var audioUrl={
			enable: true,
			playURL: 'music/scene.mp3',
			cycleURL: 'music/circulation.mp3' //循环
		}
function HtmlAudio(url,loop){
	var audio=new Audio(url);
	audio.autoplay=true;
	audio.loop=loop||false;
	audio.play();
	return {
		end:function(callback){
			audio.addEventListener('ended',function(){},false);
		}
	}	
}
/*
if (audioUrl.enable) {
	var audio1=HtmlAudio(audioUrl.playURL);
	audio1.end(function(){HtmlAudio(audioUrl.cycleURL)})	
}
*/
$(function(){
	Christmas();
})
var Christmas=function(){
	var $pageA=$('.page-a');
	var $pageB=$('.page-b');
	var $pageC=$('.page-c');
	var observer=new Observer();
	new PageA($pageA,function(){
		observer.publish('completeA');
	});
	
	observer.subscribe('completeA',function(){
		changePage($pageA, "effect-out", function() {
            observer.publish("pageB");
       })
	})
	observer.subscribe('pageB',function(){
		PageB($pageB,function(){
			observer.publish("completeB");
		})
	})
	observer.subscribe('completeB',function(){
		changePage($pageC, "effect-in", function(){
			observer.publish("pageC");
		})
	})
	observer.subscribe('pageC',function(){
		new PageC();
	})

}






















//	new PageA(function(){
//		observer.publish('complateA');
//	})
//	observer.subscribe('complateA',function(){
//		changePage($pageA,'effect-out',function(){
//			observer.publish('pageB');
//		})
//	})
//	observer.subscribe("pageB",function(){
//		new PageB(function(){
//			observer.publish('complateB');
//		})
//	})
//	observer.subscribe('complateB',function(){
//		changePage($pageC,'effect-in',function(){
//			observer.publish('pageC');
//		})
//	})
//	observer.subscribe('pageC',function(){
//		new PageC();
//	})	
