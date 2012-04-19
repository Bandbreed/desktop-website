
////////////////////////////////////////////////////////////////////////////////////////////////////
//	Global variables															  				  //
////////////////////////////////////////////////////////////////////////////////////////////////////

//	Background image variables: URL for background images
	
//	Declare initScreen variables
	var wh;				//	Viewport height
	var ww;				//	Viewport width
	var dh;				//	Document height (whole content)
	var dw = 960;		//	column width of site
	var sd;				//	Screen dimensions 
	var iw = 1000;		//	Width of the actual bg image
	var ih = 800;		//	Height of the actual bg image	
	var idim = iw/ih;	//	Image dimension
	
	var scrolled = 0;
	


	
//	////	End global variables

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Page initialisation and control	of screen													  //
////////////////////////////////////////////////////////////////////////////////////////////////////

//	When document structure is loaded
	$(document).ready(function() {
	
		//	Basic functions to do once
			initScreen();
			geenAlphaOmega();
			if ( ('.sliderwrapper').length !== undefined ) {
				geenSlider();
			};
			geenScroller();
		
	});	//	////	End document ready

//	What to do when page is loaded completely
	$(window).load(function() {
	
		//	Stuff to do last
		
	});	//	////	End window load

//	When user scrolls
	$(window).scroll(function() {
	
		//	Check how far user is scrolled
			scrolled = parseInt($(window).scrollTop());
			
			if (scrolled > 146) {
				$('#sidemenu').css({
					position: 'fixed',
					top: 10
				});
			} else {
				$('#sidemenu').css({
					position: 'absolute',
					top: 156
				});
			};
			
			if(scrolled < 600) {$('#backtotop').hide()} else {$('#backtotop').show()};
			
	});	//	////	End window scroll

//	When user resizes window
	$(window).resize(function() {
	
		//	Update background
			initScreen();
				
	});	//	////	End window resize
	
	$(window).bind("orientationchange", function() {
		initScreen();
	});

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Functions																					  //
////////////////////////////////////////////////////////////////////////////////////////////////////


//	When screen is drawn
	function initScreen() {
	
		//	Initscreen variables
			wh = $(window).height();
			ww = document.body.clientWidth;
			dh = $(document.body).height();
			sd = ww / wh;
			
			//document.title = 'Window height: ' + wh + ' Window Width: ' + ww;
		
			var bg = $('#background');	//	Background image
	
		//	Set background image dimension to fit the screen
			if (idim < sd) {
				// when screen is smaller than the background
					bg.width(ww).height(ww / idim);
			} else if (idim > sd) {
				// or wider
					bg.height(wh).width(wh * idim);
			};
	
		//	Position the image, around the middle of the screen
			var offsetleft = Math.floor((ww - bg.width())/2);
			var offsettop = Math.floor((wh - bg.height())/3);
			bg.css('left', offsetleft + 'px').css('top', offsettop + 'px');
				
	};

// Adding alpha, omega and middle classes to lists
	function geenAlphaOmega() {
	
		//	Add classes to list items
			$('ul li:first-child').addClass('alpha');
			$('ul li:last-child').addClass('omega');
			$('ul li').not(':first').not(':last').addClass('middle');
	};
	
//	Scroll to top functionality
	function geenScroller() {
		$('#backtotop').click(function() { 
			var distanceUp = $(this).offset().top;
			$('html, body').stop().animate({ scrollTop: -distanceUp }, distanceUp/2, 'swing');
		});
	};
	
	
//	Slider Controls

var mySliders = Array();

	function geenSlider() {

		//	Slider positioning
			$.each($('.sliderwrapper'), function(j, el) {
				mySliders.push(new bbSlider(el, j));
			});
			
	};

function bbSlider(element, nextSliderID) {
	
	this.myslider = $(element);
	this.hide = hideSlider;
	this.sliderPrep = sliderPrep;
	
	//	Slider vars
	var slider = $(element);
	var sliderCollection;				//	All sliders
	var moveNext = true;				//	Do we move right? false = left
	var viewedSlider = 0;				//	Slider in the picture
	var slideInterval;					//	Timer function
	var colw;							//	Multicolumn width
	var colh;							//	Height of the columns
	var coln;							//	Number of columns
	var colanim;						//	Type of animation (fade/slide)
	var slideTimer = 5000;				//	How long till anim starts
	var slideSpeed = 1.5; 				//	Higher is slower
	var animKind = 'easeOutQuint';		//	easeInOutQuint linear swing
	
	function hideSlider() {
		myslider.hide();
	};
	
	clearTimeout(slideInterval);
	var sliderFunction = 'mySliders[{0}].sliderPrep()'.format(nextSliderID);
	
	//	Find all slides for each sliderwrapper
		sliderCollection = slider.find('.slider');

	//	If only one slide, hide controls and stop timer
		if (sliderCollection.length > 1) {
			slideInterval = setInterval(sliderFunction, slideTimer);
		};
	
	
	//	Set variables for every slider and send them to the slides. Once!
	function sliderInit() {
	
		var e = slider;
			
		//	Get the properties from HTML
			colw = parseInt(e.attr('data-colw'));
			colh = parseInt(e.attr('data-colh'));
			coln = parseInt(e.attr('data-coln'));
			colanim = e.attr('data-colanim');
			
		//	Make the sliderwrapper as big as it should (number of columns * the column width)	
			slider.css({
				width: colw * coln
			});
			
		//	Run these for each slider 
			sliderCollection.each(function() {

				var xpos = $(this).index() * colw;
				$(this).width(colw).css({
					left: xpos 
				}).show();
			});
			
		//	If only one slide, hide controls and stop timer
			if (sliderCollection.length == 1) {
			
				slider.find('.slidercontrols').hide();
				return;
				
			};

		//	Add clicks for previous and next buttons
			slider.find('div[data-btn]').unbind().click(click_prevnext);

	};	//	End sliderInit
	
	//	When you click on a previous or next button
	function click_prevnext(e) {

		//	Where to go? And did we click?
			moveNext = $(this).attr('data-btn') == 'next'? true : false;

		//	Prepare the animation
			mySliders[nextSliderID].sliderPrep();
			
	};	//	End clickPrevNext
	
		

//	When you click on a previous or next button
	function sliderPrep() {

		//	Check what kind of animation it is
			if (colanim == 'slide') {

				//	Position the slides
					if (moveNext) {	//	Forwards
						
						//	Check if you are at the last slide
							if (viewedSlider == sliderCollection.length - coln) {
								
								
								//	Set first slide to last position
									slider.find('.slider').first().css({
										left: colw * coln
									}).addClass('getready');
								
								
							} else {
							
								//	Move all slides right
									slider.find('.slider[data-order={0}]'.format(viewedSlider + 1)).addClass('getready');
									slider.find('.active').removeClass('active').next().addClass('active');
							
							};
							
					} else {	//	Backwards
						
						//	Check if you are at the first slide
							if (viewedSlider == 0) {
							
								//	Set last slide to first position
									slider.find('.slider').last().css({
										left: -colw * coln
									}).addClass('getready');
								
							} else {
							
								//	Move all slides left
									slider.find('.slider[data-order={0}]'.format(viewedSlider - 1)).addClass('getready');
									slider.find('.active').removeClass('active').prev().addClass('active');
							
							};
					};
					
			} else if (colanim == 'fade') {

				//	Fade anim
				
			};

		//	Actual animation
			sliderAnim();
			
	};	//	End sliderPrep



	//	Slider animation
	function sliderAnim() {
			
		//	Find the next slider to animate	
			var nextSlider = slider.find('.getready').attr('data-order');

		//	Reset timers and clicks during animation
			slider.find('.slidercontrols div[data-btn]').unbind();
			clearInterval(slideInterval);

		//	How far to move each slider
			var slideAmount = moveNext?  '-=' + colw : '+=' + colw;

		//	animate all the slides
			sliderCollection.animate({
				left: slideAmount
			}, (colw * slideSpeed), animKind, function() {

				//	Rebuild sliders
					sliderCollection.not('[data-order={0}]'.format(nextSlider)).each(function() {
					
						//	Get my order and put all other sliders in place
							var myorder = $(this).attr('data-order');
							var myOffset = myorder * colw;
							var baseOffset = nextSlider * colw;
							$(this).css({
								left: 0 - baseOffset + myOffset
							});
					});
					
				//	Find the viewed slider	
					sliderCollection.each(function() {
						var c = $(this).position();
						if (c.left ==  0) {
							//	Get the order of the current slide
								viewedSlider = $(this).attr('data-order');
						};
					});
					
				//	When animation is done
					slider.find('.slidercontrols div[data-btn]').unbind().click(click_prevnext);
					
				//	After animating, clear getready class
					slider.find('.getready').removeClass('getready');
					
				//	Make slider move to the right again
					moveNext = true;
					
				//	Initialise timer
					clearTimeout(slideInterval);
					slideInterval = setInterval(sliderFunction, slideTimer);
			});

	};	//	End slider Anim
	
	sliderInit();
	
	
	// End slider class
	
	
}

	
//	////	End functions

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Plug-ins 													  								  //
////////////////////////////////////////////////////////////////////////////////////////////////////

//	Edward's form placeholder
	$.support.placeholder||($("[placeholder]").click(function(a) {$(this).val(""),$(this).blur(function() {$(this).val()==""&&$(this).val($(this).attr("placeholder"))})}),$("[placeholder]").parents("form:first").submit(function() {$("input['placeholder']").each(function() {$(this).val()==$(this).attr("placeholder")&&$(this).val("")})}),$("[placeholder]").each(function(a) {$(this).val()==""&&$(this).val($(this).attr("placeholder"))}))
	
	
//	jQuery advanced easing
	jQuery.easing.jswing=jQuery.easing.swing,jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e) {return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e) {return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e) {return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e) {return(b/=e/2)<1?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e) {return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e) {return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e) {return(b/=e/2)<1?d/2*b*b*b+c:d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e) {return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e) {return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e) {return(b/=e/2)<1?d/2*b*b*b*b+c:-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e) {return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e) {return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e) {return(b/=e/2)<1?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e) {return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e) {return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e) {return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e) {return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e) {return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e) {return b==0?c:b==e?c+d:(b/=e/2)<1?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e) {return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e) {return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e) {return(b/=e/2)<1?-d/2*(Math.sqrt(1-b*b)-1)+c:d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e) {var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e)==1)return c+d;g||(g=e*.3);if(h<Math.abs(d)) {h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e) {var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e)==1)return c+d;g||(g=e*.3);if(h<Math.abs(d)) {h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e) {var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;g||(g=e*.3*1.5);if(h<Math.abs(d)) {h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return b<1?-0.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c:h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,b,c,d,e,f) {return f==undefined&&(f=1.70158),d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f) {return f==undefined&&(f=1.70158),d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f) {return f==undefined&&(f=1.70158),(b/=e/2)<1?d/2*b*b*(((f*=1.525)+1)*b-f)+c:d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e) {return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e) {return(b/=e)<1/2.75?d*7.5625*b*b+c:b<2/2.75?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:b<2.5/2.75?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c},easeInOutBounce:function(a,b,c,d,e) {return b<e/2?jQuery.easing.easeInBounce(a,b*2,0,d,e)*.5+c:jQuery.easing.easeOutBounce(a,b*2-e,0,d,e)*.5+d*.5+c}})

//	format string function
	String.prototype.format=function() {var a=/\{\d+\}/g,b=arguments;return this.replace(a,function(a) {return b[a.match(/\d+/)]})}
	
//	Local storage
	function createCookie(a,b) {if("localStorage"in window&&window["localStorage"]!=null)localStorage.setItem(a,b);else{var c=new Date;c.setTime(c.getTime()+31104e6);var d="; expires="+c.toGMTString();document.cookie=a+"="+b+d+"; path=/"}}
	function clearCookie(a,b) {if("localStorage"in window&&window["localStorage"]!=null)localStorage.setItem(a,null);else{var c="; expires=Thu, 01-Jan-70 00:00:01 GMT";document.cookie=a+"="+c+"; path=/"}}
	function readCookie(a) {var b=null;if("localStorage"in window&&window["localStorage"]!=null)b=localStorage.getItem(a);else{var c=a+"=",d=document.cookie.split(";");for(var e=0;e<d.length;e++) {var f=d[e];while(f.charAt(0)==" ")f=f.substring(1,f.length);f.indexOf(c)==0&&(b=f.substring(c.length,f.length))}}if(b!=null) {if(b.toLowerCase()=="true")return!0;if(b.toLowerCase()=="false")return!1}return b}

//	////	End Plug-ins
