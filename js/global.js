(function(){


	var scroller,clickEvent, vidIframe = null;
	var isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i) != null;


	window.addEventListener('load', init, false);
	window.addEventListener('resize', onResize, false);


	function init(){
		clickEvent = isMobile? 'touchend':'click';
		var pageContents = document.getElementById('pageContents');

		if(isMobile){
			var panels = document.querySelectorAll('.panel');
			for(var i=0; i< panels.length; i++){
				panels[i].style.opacity = '1';
				panels[i].style.transform = 'translateY(-20px)';
				panels[i].style["-webkit-transform"] = 'translateY(-20px)';
			}
			pageContents.style.paddingRight = "0px";
			/*pageContents.style.overflow = "scroll";
			pageContents.style['-webkit-overflow-scrolling'] = "touch";*/
		}else{
			scroller = new CustomScroll(pageContents, {ease:true, thumbClass:'scrollbar-thumb', trackClass:'scrollbar-track'});
			scroller.onScroll(onScrolling);
		}

		var videos = document.querySelectorAll('.playvideo');
		for(var i=0; i< videos.length; i++){
			videos[i].addEventListener(clickEvent, onPlayClicked, false);
		}

		var hamburgerMenu = document.querySelector(".hamburger-menu");
		hamburgerMenu.addEventListener(clickEvent, onMenuClicked,false);

		var closeMenu = document.querySelector(".close-menu");
		closeMenu.addEventListener(clickEvent, onCloseClicked,false);
	}

	function onMenuClicked(){
		var projects = document.querySelector("#projects");
		projects.style.transform = "translate3d(0px,0,-200px)";
		projects.style['-webkit-transform'] = "translate3d(0px,0,-200px)";
		//projects.style['-webkit-filter'] = "blur(2px)";

		var menuContent = document.querySelector("#menu");
		menuContent.style.transform = "translate3d(0,0,0)";
		menuContent.style['-webkit-transform'] = "translate3d(0px,0,0)";

		var darkBG = document.createElement('div');
		darkBG.setAttribute('class','videoBg');
		document.body.insertBefore(darkBG,projects);
		setTimeout(function(){darkBG.style.opacity = "1";},100);

	}

	function onCloseClicked(){
		var projects = document.querySelector("#projects");
		projects.style.transform = "translate3d(0px,0,0px)";
		projects.style['-webkit-transform'] = "translate3d(0px,0,0px)";
		//projects.style['-webkit-filter'] = "blur(2px)";

		var menuContent = document.querySelector("#menu");
		menuContent.style.transform = "translate3d(-1500px,0,0)";
		menuContent.style['-webkit-transform'] = "translate3d(-1500px,0,0)";

		var darkBG = document.querySelector('.videoBg');

		darkBG.addEventListener('transitionend', function onFadeDown(){
			darkBG.removeEventListener('transitionend',  onFadeDown, false);
			document.body.removeChild(darkBG);
		}, false);
		darkBG.style.opacity = "0";

	}

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

		vidIframe = document.createElement('iframe');
		vidIframe.src = e.target.dataset.url + "?rel=0";
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

		vidBG.addEventListener(clickEvent,function(){
			document.body.removeChild(vidBG);
			vidIframe.src = null;
			vidIframe = null;
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
					panels[i].style["-webkit-transform"] = 'translateY(0px)';
					//console.log("UP");
				}
			}else{
				if(topOfPanel <= 500){
					//console.log("topOfPanel = "+topOfPanel);
					panels[i].style.opacity = '1';
					panels[i].style.transform = 'translateY(-20px)';
					panels[i].style["-webkit-transform"] = 'translateY(-20px)';
				}
			}
		}
	}


	function onResize(){
		if(isMobile)return;
		scroller.update(browserHeight());
		if(vidIframe){
			vidIframe.height = vidIframe.offsetWidth / 1.78;
			vidIframe.style.top = (window.innerHeight*0.5 - vidIframe.offsetHeight*0.5) + "px";
			vidIframe.style.left = (window.innerWidth*0.5 - vidIframe.offsetWidth*0.5) + "px";
		}
	};

	function browserHeight(){
		return window.innerHeight || document.documentElement.clientHeight;
	}




})();
