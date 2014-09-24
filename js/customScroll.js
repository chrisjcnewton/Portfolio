var CustomScroll = CustomScroll || function(domElem, options){
	
	var parentElem, scrollBase, scrollArea, scrollTrack, scrollThumb, domElemHeight, triggerAnimationFunc;
	var height, cntHeight, trcHeight, mean = 70, thumbDown = false, startOffsetY = 0, previousEasedVal = 0;
	
	var easeOut = 0.3;	//lower for more easeing
	var reachY = 0.6;	//higher for slower movement
	var yDist = 0, easedYpos = 0;//diffX = 0, previousX = 0
	var easeEnabled = true;
			
	
	setupDomElements();		
	
	function setupDomElements(){
		if(options && options.ease != undefined) easeEnabled = options.ease;
		
		
		domElemHeight = window.innerHeight;//domElem.offsetHeight;
		//console.log('domElemHeight = '+domElemHeight);
		
		
		parentElem = domElem.parentNode;
		parentElem.removeChild(domElem);
		scrollBase = document.createElement('div');		
		scrollArea = document.createElement('div');		
		scrollTrack = document.createElement('div');		
		scrollThumb = document.createElement('div');
		
		parentElem.appendChild(scrollBase);
		scrollBase.appendChild(scrollArea);		
		scrollArea.appendChild(domElem);	
		scrollTrack.appendChild(scrollThumb);	
		scrollBase.appendChild(scrollTrack);	
		
		
		scrollBase.style.position = "relative";	
		scrollBase.style.width = "100%";	
		scrollBase.style.height = domElemHeight + "px";
		//scrollBase.style.backgroundColor = "yellow";

		scrollArea.style.position = "relative";	
		scrollArea.style.width = "100%";	
		scrollArea.style.height = domElemHeight + "px";
		scrollArea.style.overflow = "hidden";	
		
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
		
		domElem.style.height = 'auto';
		domElem.style.overflow = 'visible';
			    
		calculateThumbHeight();    

		if (window.addEventListener) {
			scrollThumb.addEventListener("mousedown", onThumbDown,false);			
			window.addEventListener("mousemove", onThumbMove,false);
			window.addEventListener("mouseup", onThumbUp,false);
		    scrollArea.addEventListener("mousewheel", onScroll, false);
		    scrollArea.addEventListener("DOMMouseScroll", onScroll, false);
		}else{
			scrollThumb.attachEvent("onmousedown", onThumbDown);			
			document.attachEvent("onmousemove", onThumbMove);
			document.attachEvent("onmouseup", onThumbUp);			
			document.attachEvent("onmouseout", onThumbUp);			
						
		    scrollArea.attachEvent("onmousewheel", onScroll);
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
			
		if(easeEnabled) loop();
		

	}
	
	
	
	
	function onThumbDown(evt){
		var e = window.event || evt;
		thumbDown = true;	
		startOffsetY = e.offsetY || e.layerY;			
		blockTextSelection();
				
	}
	function onThumbMove(evt){
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
			/*
			if(triggerAnimationFunc){
				if(lastY < newYpos){
					triggerAnimationFunc(false);
				}else{
					triggerAnimationFunc(true);					
				}				
			}
			lastY = newYpos;
			*/
		}			
	}
	
	
	function onThumbUp(e){	
		
		e = window.event || e;		
		var browserWidth = document.documentElement.clientWidth;
		/*
		console.log(e.type);
		console.log('xpos = '+e.x);
		console.log('brow width = '+browserWidth);
		*/
		if(e.type === 'mouseout' && e.x < browserWidth && e.x > 0) return;
				
		thumbDown = false;
		unblockTextSelection();
		
	}
	

	
	function calculateThumbHeight(){	
				    
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
		/*
		console.log('height = '+height);
		console.log('cntHeight = '+cntHeight);
		console.log('trcHeight = '+trcHeight);
		console.log('thumb height = '+newThumbHeight);
		*/
	}
	
	function onScroll (e) {
		if(!thumbDown){
			
		    // cross-browser wheel delta
		    e = window.event || e;
		    		    					    
		    if(easeEnabled){
			    var delta = e.wheelDelta ||-e.detail*30;  
			    var maxScrollTop = scrollArea.scrollHeight - scrollArea.offsetHeight;
				if(easedYpos >= maxScrollTop && delta < 0){
					easedYpos = maxScrollTop;
				}else if(easedYpos<0 && delta > 0){
					easedYpos = 0;
					yDist = 0;
				}
				else{      	        
		        	yDist -= delta/15;
		        }			    	    		    				    	    		    	
		    }else{
		    	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			    var scrolltop = scrollArea.scrollTop;			    
			    //scrollTop property takes positive values when you scroll down and our delta variable behaves otherwise, so the equation will be:
			    scrollArea.scrollTop = scrolltop - delta * mean;				    	    
			    //set top position for the scrollbar thumb
			    scrollThumb.style.top = (scrollArea.scrollTop / cntHeight * trcHeight) + 'px';			    		
		    	
		    }
			if(e.preventDefault)e.preventDefault();
			/*
			if(triggerAnimationFunc){
				if(delta < 0){
					triggerAnimationFunc(false);
				}else{
					triggerAnimationFunc(true);					
				}				
			}
			*/
	   }
	}
	
	

	function blockTextSelection(){
	  document.body.focus();
	  document.onselectstart = function () { return false; };
	  domElem.style.MozUserSelect = "none";
	}
	 
	function unblockTextSelection(){
	  document.onselectstart = function () { return true; };
	  domElem.style.MozUserSelect = "text";
	}
	
	function loop(){
		
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
									
		requestAnimFrame(loop);
	}
	

	
	
	return{
		update:function(newHeight){
			if(newHeight){
				scrollBase.style.height = newHeight + "px";
				scrollArea.style.height = newHeight + "px";
			}
			calculateThumbHeight();
		},
		onScroll:function(callback){
			triggerAnimationFunc = callback;
		},
		gotoYPos:function(position){
			yDist += position*0.6;
		}
	};
};


