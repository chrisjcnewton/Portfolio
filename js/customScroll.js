var CustomScroll = CustomScroll || function(domElem, options){

	var parentElem, scrollBase, scrollArea, scrollTrack, scrollThumb, domElemHeight, triggerAnimationFunc;
	var height, cntHeight, trcHeight, mean = 70, thumbDown = false, startOffsetY = 0, previousEasedVal = 0;

	var easeOut = 0.3;	//lower for more easeing
	var reachY = 0.6;	//higher for slower movement
	var yDist = 0, easedYpos = 0;//diffX = 0, previousX = 0
	var easeEnabled = true;



	var _initDomElements = function(){
		if(options && options.ease != undefined) easeEnabled = options.ease;

		domElemHeight = domElem.offsetHeight;
		domElemWidth = domElem.offsetWidth;
		parentElem = domElem.parentNode;
		parentElem.removeChild(domElem);
		//scrollBase = document.createElement('div');
		scrollBase = domElem.cloneNode(false);
		scrollArea = document.createElement('div');
		scrollTrack = document.createElement('div');
		scrollThumb = document.createElement('div');

		parentElem.appendChild(scrollBase);
		scrollBase.appendChild(scrollArea);
		scrollArea.appendChild(domElem);
		scrollTrack.appendChild(scrollThumb);
		scrollBase.appendChild(scrollTrack);


		scrollBase.style.position = 'relative';
		scrollBase.style.overflow = 'hidden';

		scrollArea.style.position = 'relative';
		scrollArea.style.width = '100%';
		scrollArea.style.height = '100%';
		scrollArea.style.overflow = 'hidden';

		if(options && options.trackClass){
			scrollTrack.setAttribute('class', options.trackClass);
		}
		else{
			scrollTrack.style.position = 'absolute';
			scrollTrack.style.top = '0';
			scrollTrack.style.right = '0';
			scrollTrack.style.bottom = '0';
			scrollTrack.style.width = '10px';
			scrollTrack.style.backgroundColor = 'red';
		}

		if(options && options.thumbClass){
			scrollThumb.setAttribute('class', options.thumbClass);
		}
		else{
			scrollThumb.style.position = 'absolute';
			scrollThumb.style.top = '0';
			scrollThumb.style.left = '0';
			scrollThumb.style.width = '10px';
			scrollThumb.style.backgroundColor = 'green';
			scrollThumb.style.cursor = 'pointer';
		}
		domElem.removeAttribute('id');
		domElem.style.width = 'auto';
		domElem.style.height = 'auto';
		domElem.style.overflow = 'visible';

		_calculateThumbHeight();

		if (window.addEventListener) {
			scrollThumb.addEventListener('mousedown', _onThumbDown,false);
			window.addEventListener('mousemove', _onThumbMove,false);
			window.addEventListener('resize', _onResize,false);
			window.addEventListener('mouseup', _onThumbUp,false);
		  scrollArea.addEventListener('mousewheel', _onScroll, false);
		  scrollArea.addEventListener('DOMMouseScroll', _onScroll, false);
		}else{
			scrollThumb.attachEvent('onmousedown', _onThumbDown);
			window.attachEvent('onresize', _onResize);
			document.attachEvent('onmousemove', _onThumbMove);
			document.attachEvent('onmouseup', _onThumbUp);
			document.attachEvent('onmouseout', _onThumbUp);
		  scrollArea.attachEvent('onmousewheel', _onScroll);
			easeEnabled = false; // IE 8 is not a great performer when ease is enabled
		}


		if(!window.requestAnimFrame){
			window.requestAnimFrame = (function(callback) {
			    return window.requestAnimationFrame ||
			        window.webkitRequestAnimationFrame ||
			        window.mozRequestAnimationFrame ||
			        window.oRequestAnimationFrame ||
			        window.msRequestAnimationFrame ||
			        function(callback) {
			        	window.setTimeout(callback, 1000 / 60);
			    	};
			})();
		}

		if(easeEnabled) _loop();

	};

	var _onThumbDown = function(evt){
		var e = window.event || evt;
		thumbDown = true;
		startOffsetY = e.offsetY || e.layerY;
		_blockTextSelection();

	};

	var _onThumbMove = function(evt){
		var e = window.event || evt;
		if(thumbDown){

			var newYpos = (e.clientY - scrollTrack.getBoundingClientRect().top) - startOffsetY;
			var totalYDist = trcHeight - parseInt(scrollThumb.offsetHeight, 10);
			var percentageMoved = newYpos / totalYDist;
			var maxScrollTop = scrollArea.scrollHeight - scrollArea.offsetHeight;

			if(newYpos >= 0 && newYpos <= totalYDist){
				if(easeEnabled){
					yDist = (maxScrollTop*0.6)*percentageMoved;
					scrollThumb.style.top = newYpos + 'px';
				}else{
					scrollThumb.style.top = newYpos + 'px';
					scrollArea.scrollTop = Math.round( (cntHeight - height) * percentageMoved );
				}

			}
			else if(newYpos < 0){
				if(easeEnabled){
					yDist = 0;
				}else{
					scrollArea.scrollTop = 0;
				}
				scrollThumb.style.top = '0px';
			}
			else if(newYpos > totalYDist){
				if(easeEnabled){
					yDist = maxScrollTop * 0.6;
				}
				else{
					scrollArea.scrollTop = Math.round( cntHeight - height);
				}
				scrollThumb.style.top = totalYDist + 'px';
			}
		}
	};


	var _onThumbUp = function(e){

		e = window.event || e;
		var browserWidth = document.documentElement.clientWidth;

		if(e.type === 'mouseout' && e.x < browserWidth && e.x > 0) return;

		thumbDown = false;
		_unblockTextSelection();

	};



	var _calculateThumbHeight = function(){
		height = parseInt(scrollArea.offsetHeight, 10);
	  	cntHeight = parseInt(domElem.offsetHeight, 10);
	  trcHeight = parseInt(scrollTrack.offsetHeight, 10);
	  var newThumbHeight = Math.round(height / cntHeight * trcHeight);
		scrollThumb.style.height =  newThumbHeight+ 'px'; // Set the scrollbar thumb hight
		scrollThumb.style.top = (scrollArea.scrollTop / cntHeight * trcHeight) + 'px';

		if(newThumbHeight >= cntHeight){
			scrollTrack.style.visibility = 'hidden';
		}else{
			scrollTrack.style.visibility = 'visible';
		}
	};

	var _onScroll  = function(e) {
		if(!thumbDown){
	    // cross-browser wheel delta
	    e = window.event || e;

			var allowBrowserScroll = false;

	    if(easeEnabled){
		    var delta = e.wheelDelta ||-e.detail*30;
		    var maxScrollTop = scrollArea.scrollHeight - scrollArea.offsetHeight;
			if(easedYpos >= maxScrollTop && delta < 0){
				easedYpos = maxScrollTop;
				allowBrowserScroll = true;
			}else if(easedYpos<0 && delta > 0){
				easedYpos = 0;
				yDist = 0;
				allowBrowserScroll = true;
			}
			else{
	        	yDist -= delta/15;
	        }
	    }else{
	    	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		    var scrolltop = scrollArea.scrollTop;
				var maxScrollTop = scrollArea.scrollHeight - scrollArea.offsetHeight;

				if(scrolltop >= maxScrollTop && delta < 0){
					allowBrowserScroll = true;
				}else if(scrolltop<=0 && delta > 0){
					allowBrowserScroll = true;
				}
				else{
			    //scrollTop property takes positive values when you scroll down and our delta variable behaves otherwise, so the equation will be:
			    scrollArea.scrollTop = scrolltop - delta * mean;
			    //set top position for the scrollbar thumb
			    scrollThumb.style.top = (scrollArea.scrollTop / cntHeight * trcHeight) + 'px';
				}
	    }

			if(e.preventDefault && !allowBrowserScroll)e.preventDefault();
	  }
	};



	var _blockTextSelection = function(){
	  document.body.focus();
	  document.onselectstart = function () { return false; };
	  domElem.style.MozUserSelect = 'none';
	};

	var _unblockTextSelection = function(){
	  document.onselectstart = function () { return true; };
	  domElem.style.MozUserSelect = 'text';
	};

	var _loop = function(){
		easedYpos += (yDist - easedYpos * reachY) * easeOut;
		scrollArea.scrollTop = easedYpos;
		if(!thumbDown)scrollThumb.style.top = (scrollArea.scrollTop / cntHeight * trcHeight) + 'px';

		if(triggerAnimationFunc){
			if(previousEasedVal < easedYpos){
				triggerAnimationFunc(false);
			}else if(previousEasedVal > easedYpos){
				triggerAnimationFunc(true);
			}
		}

		previousEasedVal = easedYpos;

		requestAnimFrame(_loop);
	};


	var _onResize = function(){
		_calculateThumbHeight();
  };


	// Public Methods

	var setHeight = function(newHeight){
		if(newHeight){
			scrollBase.style.height = newHeight + 'px';
			scrollArea.style.height = newHeight + 'px';
		}
		_calculateThumbHeight();
	};

	var onScroll = function(callback){
		triggerAnimationFunc = callback;
	};

	var gotoYPos = function(position){
		yDist += position*0.6;
	};


	var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
	if(isTouch){
		domElem.style['-webkit-overflow-scrolling'] = 'touch';
		return{
			setHeight:function(){},
			onScroll:function(){},
			gotoYPos:function(){}
		};
	}else{
		_initDomElements();
	}


	return{
		setHeight:setHeight,
		onScroll:onScroll,
		gotoYPos:gotoYPos
	};
};
