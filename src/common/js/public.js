import '../less/globe.less'
import head from '@/head/index.js'
import footer from '@/footer/index.js'
//import 'C/js/util.js'
function userem(pageSize){
	pageSize || (pageSize = 750);
	const resize = function (){
		let width = window.outerWidth;//在chrome手机模拟中innerwidth和outerwidth有差别，outerwidth比较准确
		let rate = width/pageSize;
		document.documentElement.style.fontSize = 100*(rate>1?1:rate)+'px';
	}
	window.addEventListener('resize',resize);
	resize();
}
+function(win,doc,$){
	$(function(){
		var remSign = $('body[data-rem]');//通过配置data-rem启动
		if(remSign.length > 0){
			var designWidth = remSign.data('rem');
			userem(designWidth);
		}
	
		//动画插件
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		var animationStart = 'webkitAnimationStart mozAnimationStart MSAnimationStart oanimationstart animationstart';
		$.fn.extend({
		    animateCss: function (animationName,delay) {
		        this.addClass('animated ' + animationName).one(animationEnd, function() {
		            $(this).removeClass('animated ' + animationName);
		            $(this).css({
		            	animationDelay:'',
		        		webkitAnimationDelay:''
		            })
		        }).one(animationStart,function(){
		        	$(this).css('opacity',1);
		        }).css({
		        	animationDelay:delay?delay:0,
		        	webkitAnimationDelay:delay?delay:0
		        })
		        return this;
		    },
		    //强制rest，比如在动画运动中，动画未开始，强行终止
		    //不rest的话，动画也会结束的时候自然清除样式。
		    animateRest:function(){
		    	//rest 够彻底
		    	var animateName = $(this).data('tnl');
		    	$(this).removeClass('animated ' + animateName);
		    	$(this).off(animationEnd).off(animationStart);
	            $(this).css({
	            	animationDelay:'',
	        		webkitAnimationDelay:'',
	        		opacity:0
	            })
		    },
		    tnlAnimateAll:function(){
		    	//批量动画
				$('[data-tnl]',this).each(function(){
					var animateName = $(this).data('tnl');
					var animateDelay = $(this).data('tnl-delay');
					$(this).animateCss(animateName,animateDelay);
				})
		    },
		    tnlAnimateRestAll:function(){
		    	$('[data-tnl]',this).each(function(){
		    		$(this).animateRest();
		    	})
		    },
		    tnlAnimate:function(){
		    	var animateName = $(this).data('tnl');
				var animateDelay = $(this).data('tnl-delay');
				$(this).animateCss(animateName,animateDelay);
		    }
		});
		//通过data-启动
		$('[data-animate]').each(function(i,e){
			var animateName = $(e).data('animate');
			$(e).animateCss(animateName);
		});
		
		//表单验证
			$('form[data-submit]').submit(function(){
				var me = $(this);
				var canSubmit = true; 
				var focusDom = null;
				
				if(me.data('isClick')){
					return false;
				}
				
				me.data('isClick',true);//防止重复提交
				me.find('[type=submit]').attr('disabled','disabled');
				
				$('[data-validate=blank]',this).each(function(){
					var that = $(this);
					var msg = that.data('msg');
					if(that.val() == ''){
		                focusDom || (focusDom = that);
		                that.val('');
		                if(that.prop('placeholder')!=undefined){
		                	that.attr('placeholder',msg?msg:'该项不能为空！');
		                }else{
		                	alert(msg);
		                }
		                canSubmit = false;
		            }
				})
				
				$('[data-validate=tel]',this).each(function(){
					var that = $(this);
					var msg = that.data('msg');
					if(!/(^|)1[3-9]\d{9}$/.test(that.val())){
		                focusDom || (focusDom = that);
		                that.val('');
		                that.attr('placeholder',msg?msg:'请填写正确的电话号码！');
		                canSubmit = false;
		            }
				})
				
				
				
				$('[data-validate=select]',this).each(function(){
					var that = $(this);
					var msg = that.data('msg');
					var initVal = that.data('initVal');
					if(initVal === that.val()){
						focusDom || (focusDom = that);
						alert(msg?msg:'请选择你所在的省市县！');
						canSubmit = false;
					}
				})
				
				$('[data-validate=radio]',this).each(function(){
					var that = $(this);
					if(that.attr('type')&&that.attr('type') === 'radio'){
						if(that.prop('checked') === false){
							canSubmit = false;
						}
					}else{
						if($('input:checked',that).length === 0){
							canSubmit = false;
						}
					}
				})
				
				
				 if(canSubmit){
				 	 	var url = $(this).attr('action');
				 	 	var ajaxObj = {};
				 		if(window.FormData){
				 			var fData = new FormData(this);
			                ajaxObj = {
			                	url:url,
			                    type:'post',
			                    data:fData,
			                    processData: false,  // 不处理数据
			                    contentType: false   // 不设置内容类型
			                }
				 		}else{
				 			var data = $(this).serialize();
				 			ajaxObj = {
			                	url:url,
			                    type:'post',
			                    data:data,
			                }
				 		}
				 		$.ajax(ajaxObj).then(callback,function(res){
				 				//失败的时候解除disabled，可以重新提交
					 			me.data('isClick',false);
			            		me.find('[type=submit]').removeAttr('disabled');
				 				callback(res);
				 			});
				 		
		            }else{
		            	focusDom.focus();
		            	me.data('isClick',false);
		            	me.find('[type=submit]').removeAttr('disabled');
		            }
				 
				 function callback(res){
				 	//判断是否注册这个事件
				 	var theEvent = $._data(me[0], 'events').fromAjax;
				 	if(theEvent){
				 		me.trigger('fromAjax',res);
				 	}else if(window.swal){
				 		swal(res.message);
				 	}else{
				 		alert(res.message);
				 	}
				 	//不管成功失败都解除disabed
				 	me.data('isClick',false);
			        me.find('[type=submit]').removeAttr('disabled');
				 }
				 
				return false;
			})
			
			//只能输入数字,限制字数
			$("[data-validate=tel]").on('input', function(e) {
				this.value = this.value.replace(/\D+/g, "");
				if(this.value.length > 11){
					this.value = this.value.substring(0,11);
				}
			})
			
			//监听选择动作,获得初始值
			$("[data-validate=select]").on('change', function(e) {
				var value =  $(this).val();
				var initVal = $(this).data('initVal');
				if(initVal){
					return;
				}
				$(this).data('initVal',value);
			})
			
			//与jquery内部方法名冲突，最好改名字
			$.fn.toggle = function( fn, fn2 ) {
			    var args = arguments,guid = fn.guid || $.guid++,i=0,
			    toggle = function( event ) {
			      var lastToggle = ( $._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			      $._data( this, "lastToggle" + fn.guid, lastToggle + 1 );
			      event.preventDefault();
			      return args[ lastToggle ].apply( this, arguments ) || false;
			    };
			    toggle.guid = guid;
			    while ( i < args.length ) {
			      args[ i++ ].guid = guid;
			    }
			    return this.click( toggle );
			  };
			  
		    
		    //左右结构等高设置
		    $('[data-eqHigh]').each(function(){
		    	var height = $(this).parent().innerHeight();
		    	$(this).height(height);
		    })
			
			
			//swiper
			if(!!win.Swiper){
				$('[data-swiper]').each(function(){
					var pagination = $('.swiper-pagination',this)[0] || $('[data-pagination]',this)[0] || null;
					var slidesPerView = $(this).data('slides') || 1;
					var slideSpace = $(this).data('space')||20;
					var autoPlay = $(this).data('autoplay')||0;
					var pre = $('[data-pre]',this)[0] || $('.swiper-button-prev',this)[0];
					var next = $('[data-next]',this)[0] || $('.swiper-button-next',this)[0];
					var tmpObj = new Swiper(this,{
						pagination : pagination,
						slidesPerView : slidesPerView,
						spaceBetween : slideSpace,
						autoplay:autoPlay,
						prevButton:pre,
						nextButton:next,
					})
					$(this).data('swiperObj',tmpObj);
				})
			}
			//城市选择
//			if( typeof ($('body').citylist) === 'function'){
//				$('.province,.city').citylist({
//					data    : data,
//			        id      : 'id',
//			        children: 'cities',
//			        name    : 'name',
//			        metaTag : 'name',
//			        selected: [00,0000]
//				})
//			}
	})
	
	$(win).on('load',function(){
		//配置aos,放在onload里面的目的是在图片加载完之后初始化
		if(!!win.AOS){
			AOS.init({
	        easing: 'ease-in-out-cubic',
	        duration: 600,
	        anchorPlacement:'top-center',
	        aosOffset:300
	      });	
		}
	})
}(window,document,jQuery);
