/*
 Version: 0.0.1
  Author: Xinyi Dong
 Website: http://www.dangoeric.com
    Repo: http://github.com/eric-dango/timeline
*/

(function(window, $, undefined) {
  'use strict';
  window.TimeLine = window.TimeLine || {};

  TimeLine = (function() {
    var TimeLine = function(options) {
      this.timeLineColor = '#000';
      this.timeLineBorderWidth = '2px';
      this.timeLineHeight = '15px';
      this.venders = ['webkit', 'moz', 'o', 'ms'];
      if(typeof options === 'string') {
        this.content = $(options);
        this.selector = options;
      } else if(typeof options === 'object') {
        this.content = $(options.selector);
        this.selector = options.selector;
        this.timeLineColor = options.color || '#000';
        this.timeLineBorderWidth = options.border || '2px';
        this.timeLineHeight = (options.height/2 + 'px') || '15px';
      } else {
        console.warn('illegal init');
      }

      this.len = this.content.find('> div').length;
      this.prevWindowWidth = window.innerWidth;
      this.touchObject = {};

      //init timeline
      this.createLine();
      this.fillDots();
      this.renderTimeLine();
      this.styleLine();

      //init carousel
      this.wrapContent();
      this.initCarouselItem();
    
      // bind events
      this.bindWindowResize();
      this.bindDotClickEvent();
      this.bindYearClickEvent();
      this.bindSwipe();
    };
    return TimeLine;
  }());

  TimeLine.prototype.createLine = function() {
    var self = this;
    var contents = self.content.find('> div');
    var timeLineUpper = "";
    var timeLineLower = "";
    self.timeLineHtml = "";
    var prevYear;
    self.yearObj = [];
    var idStr = "timeline-item-";
    contents.each(function(index, card) {
      $(card).attr('id', idStr + index);
      self.yearObj.push({year: $(card).data('year'), quarter: $(card).data('quarter'), id: idStr + index});
    });

    //sort time array
    try{
      Array.prototype.sort(self.yearObj, function(a, b) {
        if(a.year != b.year || typeof a.quarter === 'undefined' || typeof b.quarter === 'undefined') {
          return a.year - b.year;
        } else {
          return a.quarter - b.quarter;
        }
      });
    } catch(e) {
      console.warn('Timeline sort: ' + e.message);
    }

    $.each(self.yearObj, function(index, obj) {
      if(prevYear === obj.year) return;
      timeLineUpper += '<li data-year="' + obj.year + '"><label>' + obj.year + '</label></li>';
      for(var i = 1; i <= 4; i++) {
        timeLineLower += '<li data-year="' + obj.year + '" data-quarter="' + i + '"></li>';
      }
      prevYear = obj.year;
    });
    self.timeLineHtml += '<ul class="timeline-upper">' + timeLineUpper + '</ul>';
    self.timeLineHtml += '<ul class="timeline-lower">' + timeLineLower + '<li class="timeline-trangle"></li></ul>';
    self.timeLineDom = $(self.timeLineHtml);
  };

  TimeLine.prototype.fillDots = function() {
    var $timeline = this.timeLineDom;
    $.each(this.yearObj, function(index, obj) {
      var curItem = $timeline.find('li[data-year="' + obj.year + '"][data-quarter="' + obj.quarter + '"]');
      curItem.html(curItem.html() + '<div data-id="' + obj.id + '" data-num="' + index + '" class="circle '+ (index===0 ? 'active' : '') +' left"></div>');
    });
    this.timeLineDom = $timeline;
  };

  TimeLine.prototype.wrapContent = function() {
    var $card = this.content.find('.card');
    var cardWidth = $card.width();
    $card.css({
      width: cardWidth + 'px',
      display: 'inline-block',
      'vertical-align': 'top',
      float: 'left'
    });
    var totalWidth = this.len * $('.card').width() + (this.len + 1) * window.screen.width/5;
    //build vender prefix for transform
    var prefixTransform = 'transition: transform 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93), left 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93);';
    this.venders.forEach(function(vender) {
      prefixTransform += '-' + vender + '-transition: -'+ vender +'-transform 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93), left 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93);';
    });

    var wrapper = '<div class="outter-wrap" style="width: 100%; overflow: hidden;">' +
      '<div class="inner-wrap" style="width:' + totalWidth + 'px;' +
      prefixTransform + '">' + 
      $(this.content).html() + '<div style="clear:both;"></div></div><div>';
    this.content.html(wrapper);
  };

  TimeLine.prototype.initCarouselItem = function () {
    var $card = this.content.find('.card');
    this.cardInitWidth = $card.outerWidth();
    this.calculateCarouselWidth();
    this.offsetLeft = 0;
    this.adjustPosition(this.offsetLeft);
    this.currentIndex = 0;
  };

  TimeLine.prototype.calculateCarouselWidth = function() {
    var $sample = this.content.parent().find('.timeline-upper');
    var maxWidth = $sample.outerWidth();
    var adjustedItemWidth = Math.min(maxWidth, this.cardInitWidth);
    this.itemMagrin = (window.innerWidth - adjustedItemWidth);
    this.itemPeriodWidth = adjustedItemWidth + this.itemMagrin;
    this.adjustCarouselItemWidth(adjustedItemWidth, this.itemMagrin/2);
  };

  TimeLine.prototype.bindWindowResize = function() {
    var self = this;
    $(window).resize(function() {
      if(window.innerWidth !== self.prevWindowWidth) {
        self.resizeCarouselItem(self);
      }
      self.prevWindowWidth = window.innerWidth;
    });
  };

  TimeLine.prototype.resizeCarouselItem = function (self) {
    this.calculateCarouselWidth();
    this.calculatePostion(this.currentIndex);
  };

  TimeLine.prototype.adjustCarouselItemWidth = function(width, margin) {
    var $card = this.content.find('.card');
    var $innerwrap = this.content.find('.inner-wrap');
    $card.css({
      'width': width,
      'margin': '0 ' + margin + 'px '
    });
    $innerwrap.width(((width + 2 * margin) * this.len + 100) + 'px');
  };

  TimeLine.prototype.bindDotClickEvent = function() {
    var $topDom = this.content.parent().find('.timeline-lower');
    var self = this;
    $topDom.on('click touchstart', '.circle', function() {
      var num = $(this).data('num');
      self.currentIndex = num;
      self.calculatePostion(num);
    });
  };

  TimeLine.prototype.bindYearClickEvent = function() {
    var $topDom = this.content.parent();
    var $yearDom = $topDom.find('.timeline-upper');
    var $itemDom = $topDom.find('.timeline-lower');
    var self = this;
    $yearDom.on('click touchstart', 'li', function() {
      $itemDom.find('.circle.active').removeClass('active');
      var year = $(this).data('year');
      var firstItem = $itemDom.find('li[data-year="'+year+'"] .circle').first();
      if(firstItem.length) {
        var num = firstItem.data('num');
        self.currentIndex = num;
        self.calculatePostion(num);
        firstItem.addClass('active');
      } else {
        return false;
      }
    });
  };

  TimeLine.prototype.calculatePostion = function(index) {
    this.adjustPosition(0 - index * this.itemPeriodWidth, index);
  };

  TimeLine.prototype.getCurPosition = function(index) {
    return 0 - index * this.itemPeriodWidth;
  };

  TimeLine.prototype.adjustPosition = function (pos, index) {
    var $innerwrap = this.content.find('.inner-wrap');
    var $topDom = this.content.parent();
    self.animating = true;
    $innerwrap.css({
      '-webkit-transform': 'translate3d(' + pos + 'px, 0px, 0px)',
      'transform': 'translate3d(' + pos + 'px, 0px, 0px)'
    });
    if(index !== undefined) {
      $topDom.find('.circle.active').removeClass('active');
      $topDom.find('.circle[data-num="'+index+'"]').addClass('active');
    }
  };

  TimeLine.prototype.renderTimeLine = function() {
    this.content.before(this.timeLineDom);
  };

  TimeLine.prototype.nextItem = function() {
    if(this.currentIndex < this.len - 1) {
      this.currentIndex++;
      this.calculatePostion(this.currentIndex);
    } else {
      this.calculatePostion(this.currentIndex);
    }
  };

  TimeLine.prototype.prevItem = function() {
    if(this.currentIndex > 0) {
      this.currentIndex--;
      this.calculatePostion(this.currentIndex);
    } else {
      this.calculatePostion(this.currentIndex);
    }
  };

  TimeLine.prototype.styleLine = function() {
    var $topDom = this.content.parent();
    var yearItem = $topDom.find('.timeline-upper li');
    var quarterItem = $topDom.find('.timeline-lower li:not(.timeline-trangle)');
    var num = yearItem.length;
    yearItem.css({
      'border-left': this.timeLineBorderWidth + ' ' + this.timeLineColor + ' solid',
      'border-bottom': this.timeLineBorderWidth + ' ' + this.timeLineColor + ' solid',
      'margin-left': '-' + this.timeLineBorderWidth,
      'display': 'inline-block',
      'width': 100/num + '%',
      'height': '15px'
    });

    $topDom.find('.timeline-upper')
      .css({
        'margin-top': '40px', 
        'margin-bottom': '0',
        'width': '90%'
      })
      .find('label')
      .css({'color': this.timeLineColor, 'margin': '0 0 2px 2px'});
    $topDom.find('.timeline-lower').css({
      'position': 'relative',
      'margin-bottom': '35px',
      'margin-top': '-1px',
      'width': '90%'
    });

    quarterItem.css({
      'border-left': this.timeLineBorderWidth + ' ' + this.timeLineColor + ' solid',
      'border-top': this.timeLineBorderWidth + ' ' + this.timeLineColor + ' solid',
      'margin-left': '-' + this.timeLineBorderWidth,
      'display': 'inline-block',
      'width': 25/num + '%',
      'height': '15px'
    });

    // trangle style
    $topDom.find('.timeline-trangle').css({
      'display': 'inline-block',
      'position': 'absolute',
      'width': 0,
      'height': 0,
      'border-top': this.timeLineHeight +  ' solid transparent',
      'border-bottom':  this.timeLineHeight +  ' solid transparent',
      'border-left':  this.timeLineHeight +  ' solid ' + this.timeLineColor,
      'list-style': 'none',
      'right': '-15px',
      'top': '-' + this.timeLineHeight
    });

    // style dots
    $topDom.find('.circle').css({
        margin: '3px 2px 0 3px',
        position: 'relative',
        background: this.timeLineColor,
        width: '10px',
        height: '10px',
        'border-radius': '20px'
    });
  };

  // Minimal swipe function for mobile touch event. Reference from Slicker.js
  TimeLine.prototype.bindSwipe = function() {
    var self = this;
    self.content.on('touchstart mousedown', {action: 'start'}, self.swipeHandler.bind(this));
    self.content.on('touchmove mousemove', {action: 'move'}, self.swipeHandler.bind(this));
    self.content.on('touchend mouseup', {action: 'end'}, self.swipeHandler.bind(this));
    self.content.on('touchcancel mouseleave', {action: 'end'}, self.swipeHandler.bind(this));
  };

  //detect swipe dirction
  TimeLine.prototype.swipeDirection = function() {
    var xDist, yDist, r, swipeAngle, self = this;

    xDist = self.touchObject.startX - self.touchObject.curX;
    yDist = self.touchObject.startY - self.touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    
    if (swipeAngle < 0) {
        swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
        return 'left';
    }
    if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
        return 'left';
    }
    if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
        return 'right';
    }
    return 'vertical';
  };

  TimeLine.prototype.swipeHandler = function(event) {
    var self = this;
    //disable swipe funtion on desktop
    if (event.type.indexOf('mouse') !== -1) {
      return;
    }

    self.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
      event.originalEvent.touches.length : 1;
    self.touchObject.minSwipe = window.innerWidth / 8;

    switch (event.data.action) {
      case 'start':
        self.swipeStart(event);
        break;
      case 'move':
        self.swipeMove(event);
        break;
      case 'end':
        self.swipeEnd(event);
        break;
    }
  };

  TimeLine.prototype.swipeMove = function(event) {
    var self = this,
        curLeft, swipeDirection, swipeLength, positionOffset, touches;
    touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;
    if (!self.dragging || touches && touches.length !== 1) {
      return false;
    }
    //current translate3D x value for innerWrap
    curLeft = self.getCurPosition(self.currentIndex);

    self.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
    self.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

    self.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(self.touchObject.curX - self.touchObject.startX, 2)));

    swipeDirection = self.swipeDirection();
    if (swipeDirection === 'vertical') {
      return;
    }
    if (event.originalEvent !== undefined && self.touchObject.swipeLength > 4) {
      event.preventDefault();
    }

    positionOffset =  (self.touchObject.curX > self.touchObject.startX ? 1 : -1);
    swipeLength = self.touchObject.swipeLength;
    self.touchObject.edgeHit = false;

    if ((self.currentIndex === 0 && swipeDirection === 'right') || (self.currentIndex >= self.len-1 && swipeDirection === 'left')) {
      swipeLength = self.touchObject.swipeLength * 0.35;
      self.touchObject.edgeHit = true;
    }

    self.swipeLeft = curLeft + swipeLength * positionOffset;

    if (self.animating === true) {
      self.swipeLeft = null;
      return false;
    }
    self.adjustPosition(self.swipeLeft);
  };

  TimeLine.prototype.swipeStart = function(event) {
    var self = this,
        touches;

    if (self.touchObject.fingerCount !== 1) {
        self.touchObject = {};
        return false;
    }

    self.content.find('.inner-wrap').css({
      'transition': 'none',
      '-webkit-transition': 'none'
    });

    if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
      touches = event.originalEvent.touches[0];
    }
    self.touchObject.startX = self.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
    self.touchObject.startY = self.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
    self.dragging = true;
  };

  TimeLine.prototype.swipeEnd = function(event) {
    var self = this;
    self.dragging = false;
    self.content.find('.inner-wrap').css({
      'transition':'transform 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93), left 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93)',
      '-webkit-transition': '-webkit-transform 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93), left 0.35s cubic-bezier(0.14, 0.34, 0.18, 0.93)'
    });

    if (self.touchObject.curX === undefined) {
      return false;
    }

    if (self.touchObject.swipeLength >= self.touchObject.minSwipe) {
      switch (self.swipeDirection()) {
        case 'left':
          self.nextItem();
          break;
        case 'right':
          self.prevItem();
          break;
        case 'vertical':
          self.calculatePostion(self.currentIndex);
      }
    } else {
      if (self.touchObject.startX !== self.touchObject.curX) {
        self.touchObject = {};
      }
      self.calculatePostion(self.currentIndex);
    }
  };
  // end of swipe
})(window, jQuery);