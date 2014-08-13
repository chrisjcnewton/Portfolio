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
	};
	
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