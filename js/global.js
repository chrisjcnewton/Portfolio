(function(){
	
	
	var scroller;
	var isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i) != null;
	
	window.onload = function(){	
		var pageContents = document.getElementById('pageContents');
		
		if(isMobile){
			var panels = document.querySelectorAll('.panel');								
			for(var i=0; i< panels.length; i++){
				panels[i].style.opacity = '1';							
				panels[i].style.transform = 'translateY(-20px)';
			}
			pageContents.style.paddingRight = "0px";
		}else{	
			scroller = new CustomScroll(pageContents, {ease:true, thumbClass:'scrollbar-thumb', trackClass:'scrollbar-track'});
			scroller.onScroll(onScrolling);
		}
		
		var videos = document.querySelectorAll('.playvideo');
		for(var i=0; i< videos.length; i++){
			videos[i].addEventListener('click', onPlayClicked, false);			
			
		}
		
	};
	
	function onPlayClicked(e){
		var vidBG = document.createElement('div');
		
		vidBG.setAttribute('class','videoBg');
		document.body.appendChild(vidBG);
		
		var loader = document.createElement('img');
		loader.src = 'images/loader.gif';
		loader.style.position = 'absolute';
		vidBG.appendChild(loader);
		loader.onload = function(){
			loader.style.top = (window.innerHeight*0.5 - loader.offsetHeight*0.5) + "px";
			loader.style.left = (window.innerWidth*0.5 - loader.offsetWidth*0.5) + "px";
			vidBG.style.opacity = "1";
		};
		
		var vidIframe = document.createElement('iframe');
		vidIframe.src = e.target.dataset.url;
		vidIframe.width = "60%";
		vidIframe.frameborder = "0";
		vidIframe.allowFullScreen = "true";
		//vidIframe.style.visibility = "hidden";
		vidIframe.setAttribute('class','video');
		vidBG.appendChild(vidIframe);
		
		vidIframe.onload = function(){
			
			vidIframe.height = vidIframe.offsetWidth / 1.78;
			//vidBG.style.visibility = "visible";
			vidIframe.style.opacity = "1";
			vidIframe.style.top = (window.innerHeight*0.5 - vidIframe.offsetHeight*0.5) + "px";
			vidIframe.style.left = (window.innerWidth*0.5 - vidIframe.offsetWidth*0.5) + "px";
			
		};
		
		vidBG.addEventListener('click',function(){
			document.body.removeChild(vidBG);
			vidIframe.src = null;
		},false);
	}
	
	function onScrolling(scrollup){
		
												
		var panels = document.querySelectorAll('.panel');								
		for(var i=0; i< panels.length; i++){
			var topOfPanel = panels[i].getBoundingClientRect().top;
			
			if(scrollup){
				if(topOfPanel > browserHeight()){							
					
					panels[i].style.opacity = '0';							
					panels[i].style.transform = 'translateY(0px)';							
					//console.log("UP");							
				}						
			}else{						
				if(topOfPanel <= 500){							
					//console.log("topOfPanel = "+topOfPanel);							
					panels[i].style.opacity = '1';							
					panels[i].style.transform = 'translateY(-20px)';							
				}
			}					
		}
	}
	
		
	window.onresize = function(){				
		if(isMobile)return;	
		scroller.update(browserHeight());											
	};
		
	function browserHeight(){
		return window.innerHeight || document.documentElement.clientHeight;
	}
	
	

	
})();