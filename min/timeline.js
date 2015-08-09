!function(t,e,i){"use strict";t.TimeLine=t.TimeLine||{},TimeLine=function(){var i=function(i){this.timeLineColor="#000",this.timeLineBorderWidth="2px",this.timeLineHeight="15px",this.venders=["webkit","moz","o","ms"],"string"==typeof i?(this.content=e(i),this.selector=i):"object"==typeof i?(this.content=e(i.selector),this.selector=i.selector,this.timeLineColor=i.color||"#000",this.timeLineBorderWidth=i.border||"2px",this.timeLineHeight=i.height/2+"px"||"15px"):console.warn("illegal init"),this.len=this.content.find("> div").length,this.prevWindowWidth=t.innerWidth,this.touchObject={},this.createLine(),this.fillDots(),this.renderTimeLine(),this.styleLine(),this.wrapContent(),this.initCarouselItem(),this.bindWindowResize(),this.bindDotClickEvent(),this.bindYearClickEvent(),this.bindSwipe()};return i}(),TimeLine.prototype.createLine=function(){var t=this,i=t.content.find("> div"),n="",r="";t.timeLineHtml="";var o;t.yearObj=[];var s="timeline-item-";i.each(function(i,n){e(n).attr("id",s+i),t.yearObj.push({year:e(n).data("year"),quarter:e(n).data("quarter"),id:s+i})});try{Array.prototype.sort(t.yearObj,function(t,e){return t.year!=e.year||"undefined"==typeof t.quarter||"undefined"==typeof e.quarter?t.year-e.year:t.quarter-e.quarter})}catch(a){console.warn("Timeline sort: "+a.message)}e.each(t.yearObj,function(t,e){if(o!==e.year){n+='<li data-year="'+e.year+'"><label>'+e.year+"</label></li>";for(var i=1;4>=i;i++)r+='<li data-year="'+e.year+'" data-quarter="'+i+'"></li>';o=e.year}}),t.timeLineHtml+='<ul class="timeline-upper">'+n+"</ul>",t.timeLineHtml+='<ul class="timeline-lower">'+r+'<li class="timeline-trangle"></li></ul>',t.timeLineDom=e(t.timeLineHtml)},TimeLine.prototype.fillDots=function(){var t=this.timeLineDom;e.each(this.yearObj,function(e,i){var n=t.find('li[data-year="'+i.year+'"][data-quarter="'+i.quarter+'"]');n.html(n.html()+'<div data-id="'+i.id+'" data-num="'+e+'" class="circle '+(0===e?"active":"")+' left"></div>')}),this.timeLineDom=t},TimeLine.prototype.wrapContent=function(){var i=this.content.find(".card"),n=i.width();i.css({width:n+"px",display:"inline-block","vertical-align":"top","float":"left"});var r=this.len*e(".card").width()+(this.len+1)*t.screen.width/5,o="transition: transform 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93), left 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93);";this.venders.forEach(function(t){o+="-"+t+"-transition: -"+t+"-transform 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93), left 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93);"});var s='<div class="outter-wrap" style="width: 100%; overflow: hidden;"><div class="inner-wrap" style="width:'+r+"px;"+o+'">'+e(this.content).html()+'<div style="clear:both;"></div></div><div>';this.content.html(s)},TimeLine.prototype.initCarouselItem=function(){var t=this.content.find(".card");this.cardInitWidth=t.outerWidth(),this.calculateCarouselWidth(),this.offsetLeft=0,this.adjustPosition(this.offsetLeft),this.currentIndex=0},TimeLine.prototype.calculateCarouselWidth=function(){var e=this.content.parent().find(".timeline-upper"),i=e.outerWidth(),n=Math.min(i,this.cardInitWidth);this.itemMagrin=t.innerWidth-n,this.itemPeriodWidth=n+this.itemMagrin,this.adjustCarouselItemWidth(n,this.itemMagrin/2)},TimeLine.prototype.bindWindowResize=function(){var i=this;e(t).resize(function(){t.innerWidth!==i.prevWindowWidth&&i.resizeCarouselItem(i),i.prevWindowWidth=t.innerWidth})},TimeLine.prototype.resizeCarouselItem=function(){this.calculateCarouselWidth(),this.calculatePostion(this.currentIndex)},TimeLine.prototype.adjustCarouselItemWidth=function(t,e){var i=this.content.find(".card"),n=this.content.find(".inner-wrap");i.css({width:t,margin:"0 "+e+"px "}),n.width((t+2*e)*this.len+100+"px")},TimeLine.prototype.bindDotClickEvent=function(){var t=this.content.parent().find(".timeline-lower"),i=this;t.on("click touchstart",".circle",function(){var t=e(this).data("num");i.currentIndex=t,i.calculatePostion(t)})},TimeLine.prototype.bindYearClickEvent=function(){var t=this.content.parent(),i=t.find(".timeline-upper"),n=t.find(".timeline-lower"),r=this;i.on("click touchstart","li",function(){n.find(".circle.active").removeClass("active");var t=e(this).data("year"),i=n.find('li[data-year="'+t+'"] .circle').first();if(!i.length)return!1;var o=i.data("num");r.currentIndex=o,r.calculatePostion(o),i.addClass("active")})},TimeLine.prototype.calculatePostion=function(t){this.adjustPosition(0-t*this.itemPeriodWidth,t)},TimeLine.prototype.getCurPosition=function(t){return 0-t*this.itemPeriodWidth},TimeLine.prototype.adjustPosition=function(t,e){var n=this.content.find(".inner-wrap"),r=this.content.parent();self.animating=!0,n.css({"-webkit-transform":"translate3d("+t+"px, 0px, 0px)",transform:"translate3d("+t+"px, 0px, 0px)"}),e!==i&&(r.find(".circle.active").removeClass("active"),r.find('.circle[data-num="'+e+'"]').addClass("active"))},TimeLine.prototype.renderTimeLine=function(){this.content.before(this.timeLineDom)},TimeLine.prototype.nextItem=function(){this.currentIndex<this.len-1?(this.currentIndex++,this.calculatePostion(this.currentIndex)):this.calculatePostion(this.currentIndex)},TimeLine.prototype.prevItem=function(){this.currentIndex>0?(this.currentIndex--,this.calculatePostion(this.currentIndex)):this.calculatePostion(this.currentIndex)},TimeLine.prototype.styleLine=function(){var t=this.content.parent(),e=t.find(".timeline-upper li"),i=t.find(".timeline-lower li:not(.timeline-trangle)"),n=e.length;e.css({"border-left":this.timeLineBorderWidth+" "+this.timeLineColor+" solid","border-bottom":this.timeLineBorderWidth+" "+this.timeLineColor+" solid","margin-left":"-"+this.timeLineBorderWidth,display:"inline-block",width:100/n+"%",height:"15px"}),t.find(".timeline-upper").css({"margin-top":"40px","margin-bottom":"0",width:"90%"}).find("label").css({color:this.timeLineColor,margin:"0 0 2px 2px"}),t.find(".timeline-lower").css({position:"relative","margin-bottom":"35px","margin-top":"-1px",width:"90%"}),i.css({"border-left":this.timeLineBorderWidth+" "+this.timeLineColor+" solid","border-top":this.timeLineBorderWidth+" "+this.timeLineColor+" solid","margin-left":"-"+this.timeLineBorderWidth,display:"inline-block",width:25/n+"%",height:"15px"}),t.find(".timeline-trangle").css({display:"inline-block",position:"absolute",width:0,height:0,"border-top":this.timeLineHeight+" solid transparent","border-bottom":this.timeLineHeight+" solid transparent","border-left":this.timeLineHeight+" solid "+this.timeLineColor,"list-style":"none",right:"-15px",top:"-"+this.timeLineHeight}),t.find(".circle").css({margin:"3px 2px 0 3px",position:"relative",background:this.timeLineColor,width:"10px",height:"10px","border-radius":"20px"})},TimeLine.prototype.bindSwipe=function(){var t=this;t.content.on("touchstart mousedown",{action:"start"},t.swipeHandler.bind(this)),t.content.on("touchmove mousemove",{action:"move"},t.swipeHandler.bind(this)),t.content.on("touchend mouseup",{action:"end"},t.swipeHandler.bind(this)),t.content.on("touchcancel mouseleave",{action:"end"},t.swipeHandler.bind(this))},TimeLine.prototype.swipeDirection=function(){var t,e,i,n,r=this;return t=r.touchObject.startX-r.touchObject.curX,e=r.touchObject.startY-r.touchObject.curY,i=Math.atan2(e,t),n=Math.round(180*i/Math.PI),0>n&&(n=360-Math.abs(n)),45>=n&&n>=0?"left":360>=n&&n>=315?"left":n>=135&&225>=n?"right":"vertical"},TimeLine.prototype.swipeHandler=function(e){var n=this;if(-1===e.type.indexOf("mouse"))switch(n.touchObject.fingerCount=e.originalEvent&&e.originalEvent.touches!==i?e.originalEvent.touches.length:1,n.touchObject.minSwipe=t.innerWidth/8,e.data.action){case"start":n.swipeStart(e);break;case"move":n.swipeMove(e);break;case"end":n.swipeEnd(e)}},TimeLine.prototype.swipeMove=function(t){var e,n,r,o,s,a=this;return s=t.originalEvent!==i?t.originalEvent.touches:null,!a.dragging||s&&1!==s.length?!1:(e=a.getCurPosition(a.currentIndex),a.touchObject.curX=s!==i?s[0].pageX:t.clientX,a.touchObject.curY=s!==i?s[0].pageY:t.clientY,a.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(a.touchObject.curX-a.touchObject.startX,2))),n=a.swipeDirection(),"vertical"!==n?(t.originalEvent!==i&&a.touchObject.swipeLength>4&&t.preventDefault(),o=a.touchObject.curX>a.touchObject.startX?1:-1,r=a.touchObject.swipeLength,a.touchObject.edgeHit=!1,(0===a.currentIndex&&"right"===n||a.currentIndex>=a.len-1&&"left"===n)&&(r=.35*a.touchObject.swipeLength,a.touchObject.edgeHit=!0),a.swipeLeft=e+r*o,a.animating===!0?(a.swipeLeft=null,!1):void a.adjustPosition(a.swipeLeft)):void 0)},TimeLine.prototype.swipeStart=function(t){var e,n=this;return 1!==n.touchObject.fingerCount?(n.touchObject={},!1):(n.content.find(".inner-wrap").css({transition:"none","-webkit-transition":"none"}),t.originalEvent!==i&&t.originalEvent.touches!==i&&(e=t.originalEvent.touches[0]),n.touchObject.startX=n.touchObject.curX=e!==i?e.pageX:t.clientX,n.touchObject.startY=n.touchObject.curY=e!==i?e.pageY:t.clientY,void(n.dragging=!0))},TimeLine.prototype.swipeEnd=function(){var t=this;if(t.dragging=!1,t.content.find(".inner-wrap").css({transition:"transform 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93), left 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93)","-webkit-transition":"-webkit-transform 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93), left 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93)"}),t.touchObject.curX===i)return!1;if(t.touchObject.swipeLength>=t.touchObject.minSwipe)switch(t.swipeDirection()){case"left":t.nextItem();break;case"right":t.prevItem();break;case"vertical":t.calculatePostion(t.currentIndex)}else t.touchObject.startX!==t.touchObject.curX&&(t.touchObject={}),t.calculatePostion(t.currentIndex)}}(window,jQuery);