var LODING_IMAGE_TYPE = constant.common.loadingTypeGS;

var common = {

	//로딩 이미지 설정
	setLoadingImage: function setLoadingImage(){
		(function( $ ) {
			$(document).ajaxStart(function(){
				common.showLoadingImage(LODING_IMAGE_TYPE);
			}).ajaxStop(function(){
				common.hideLoadingImage(LODING_IMAGE_TYPE);
			}).ajaxComplete(function(){
				common.hideLoadingImage(LODING_IMAGE_TYPE);
			});
		})( jQuery );
	},

	showLoadingImage: function showLoadingImage(loadingType){
		(function( $ ) {
			if(loadingType==constant.common.loadingTypeGS){
				//Gaspare Sganaga jQuery LoadingOverlay
				//https://gasparesganga.com/labs/jquery-loading-overlay/#quick-demo
				if($(".loadingoverlay").length == 0){
					$.LoadingOverlay("show", {
						color: "rgba(225, 242, 247, 0.1)",
						zIndex: 99999999999         
					});
				}
			}
			else if(loadingType==constant.common.loadingTypeDiv){
				//http://blog.naver.com/karismamun/220944398248
				//http://bemeal2.tistory.com/44
				//https://codepen.io/nemophrost/pen/rpucd
				//http://www.designrazor.net/55-best-css3-progress-bar-download/
				var loadingImg = '/web/images/loader2.gif';
			         var width, height, left, top = 0;
		          	
		          	width = 50;
		          	height = 50;
		          	top = ( $(window).height() - height ) / 2 + $(window).scrollTop();
		          	left = ( $(window).width() - width ) / 2 + $(window).scrollLeft();

				if($("#div_ajax_load_image").length != 0) {
					$("#div_ajax_load_image").css({
			                            "top": top+"px",
			                            "left": left+"px"
					});
					$("#div_ajax_load_image").show();
				}
				else {
					$('body').append('<div id="div_ajax_load_image" style="position:absolute; top:' + top + 'px; left:' + left + 'px; width:' + width + 'px; height:' + height + 'px; z-index:9999;  filter:alpha(opacity=50); opacity:alpha*0.5; margin:auto; padding:0; "><img src="'+loadingImg+ '" style="width:50px; height:50px;"></div>');
				}
			}
		})( jQuery );
	},

	hideLoadingImage: function hideLoadingImage(loadingType){
		(function( $ ) {
			if(loadingType==constant.common.loadingTypeGS){
				$.LoadingOverlay("hide");
			}
			else if(loadingType==constant.common.loadingTypeDiv){
				$("#div_ajax_load_image").hide();
			}
		})( jQuery );
	},

	//ajaxStart 시작
	setLoadingImageOn: function setLoadingImageOn(){
		(function( $ ) {
			$(document).on("ajaxStart", function () {
				common.showLoadingImage(LODING_IMAGE_TYPE);
			});
		})( jQuery );	
	},

	//ajaxStart 중지
	setLoadingImageOff: function setLoadingImageOff(){
		(function( $ ) {
			$(document).off("ajaxStart");	
		})( jQuery );
	},
	

	//로딩 이미지 테스트(사용하지 않음)
	setLoadingImage2: function setLoadingImage2(){
		(function( $ ) {
			$(function(){
				var current_effect = $('#waitMe_ex_effect').val();
				$('#waitMe_ex').click(function(){
					run_waitMe($('.containerBlock > form'), 1, current_effect);
				});
				$('#hideMe_ex').click(function(){
					aaa($('.containerBlock > form'), 1, current_effect);
				});

				function aaa(el, num, effect){
					el.hide();
				}
				function run_waitMe(el, num, effect){
					text = '잠시만 기다려 주세요...';
					fontSize = '';
					switch (num) {
						case 1:
						maxSize = '';
						textPos = 'vertical';
						break;
						case 2:
						text = '';
						maxSize = 30;
						textPos = 'vertical';
						break;
						case 3:
						maxSize = 30;
						textPos = 'horizontal';
						fontSize = '18px';
						break;
					}
					console.log(effect)
					el.waitMe({
						effect: effect,
						text: text,
						bg: 'rgba(255,255,255,0.7)',
						color: '#000',
						maxSize: maxSize,
						source: 'img.svg',
						textPos: textPos,
						fontSize: fontSize,
						onClose: function() {}
					});
				}	
			});
		})( jQuery );
	},


	//모달 팝업
	//config ==> {url:'화면URL', serverUrl:'서버호출URL', title:'타이틀', width:500, height:600, resizable:false, sendForm:{parma1:'서버에 넘길', parma2:'파라미터값'}}	
	//remake==> 기본값은 true임,  true:화면 센터 포지션으로 호출함,  false:기존에 사용했던 dialog form을 유지한채로 호출하여 사용자가 변경한 포지션이 유지됨.
		modalShow: function modalShow(config, remake){
		if(typeof remake == "undefined"){
			remake = true;
		}
		main.pageSessionCheck(common.modalShowNoSession(config, remake));
	},

	modalShowNoSession: function modalShowNoSession(config, remake){
		common.modalHide();
		(function( $ ) {
			if(typeof remake == "undefined"){
				remake = true;
			}

			if(remake == true){
				var dialogForm = document.getElementById('idDialogForm')
	 			dialogForm.parentNode.removeChild(dialogForm);
				var tmpDialogForm = document.createElement("div");
				tmpDialogForm.id = "idDialogForm";
				document.body.appendChild(tmpDialogForm);
			}



			var url = config.url || '';
			var serverUrl = config.serverUrl || "";
			var modal = config.modalTarget || $("#idDialogForm");
			modal.dialog({modal: config.modal || true});		//dialog 처음 호출시 로딩바가 뒤로 숨겨지는 현상 때문에 추가

			if(url!=''){
				modal.load(config.url, config.sendForm||null, function(){
					if(typeof config.callback != "undefined"){
						console.info("모달 callback call");
						config.callback();
					}
				});
			}
			else if(serverUrl!=""){
				$.ajax({ type: 'post' , url:serverUrl  , dataType : 'html' , data: config.sendForm||null, success: function(data) { modal.html(data); } }); 
			}

			modal.dialog({
				autoOpen: config.autoOpen || false,
				modal: config.modal || true,
				title: config.title || 'Info',
				width: config.width || 500,
				height: config.height || 600,
				resizable: config.resizable || false,
			});
			modal.dialog('open');

			
		})( jQuery );
	},

	//모달 팝업 닫기
	modalHide: function modalHide(config){
		(function( $ ) {
			try{
				clearInterval(usrTimer);

				config = config || {};
				var modal = config.modalTarget || $("#idDialogForm");
				modal.dialog('close');
			}catch(e){}
			
		})( jQuery );		
	},

	enterKeyEvent: function enterKeyEvent(callFunc){
		if(event.keyCode == 13){
         			callFunc();
    		}
	},

	//이메일 주소 유효성 체크(false: 올바르지 않은 이메일 형식)
	emailValidateCheck: function emailValidateCheck(emailAddr){
		var exptext=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   
		return exptext.test(emailAddr);
	},

	//휴대폰 번호 유효성 체크(false: 올바르지 않은 휴대폰 번호 형식)
	phoneValidateCheck: function emailValidateCheck(phoneNumber){
		var exptext = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
		return exptext.test(phoneNumber);
	},
	
	onlyNumberInput: function onlyNumberInput(){
		if ((event.keyCode<48)||(event.keyCode>57)){
			event.returnValue = false;	
		}
	},

	onlyNumberInput2: function onlyNumberInput2(ev){
	    if (window.event) // IE코드
	        var code = window.event.keyCode;
	    else // 타브라우저
	        var code = ev.which;
	 
	    if ((code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code == 8 || code == 9 || code == 13 || code == 46)
	    {
	        window.event.returnValue = true;
	        return;
	    }
	 
	    if (window.event)
	        window.event.returnValue = false;
	    else
	        ev.preventDefault();    
	},
	
	/**
	 * Validation Check 함수 
	 *  - null와 maxLength 체크
	 */
	validate: function(label, value, maxLength) {
		value = value.trim();
		if(value == null || value == ""){
			alert("["+ label + "] 을(를) 입력 해주십시오.");
			return false;
		}
		if(maxLength > 0 && value.length > maxLength){
			alert("[" + label + "] 글자 수는 " + maxLength + "이내로 입력 해주십시오.");
			return false;
		}
		return true;
	},
	
	validateFile: function(fileName){
		if(fileName != ""){
			var fileExt = fileName.slice(fileName.indexOf(".") + 1).toLowerCase(); //파일 확장자를 잘라내고, 비교를 위해 소문자로 만듭니다.
			
			var isAllow = false;
			constant.file.allow.ext.some(function(allowExt) {
			   if(fileExt == allowExt){
				   isAllow = true;
				   return true;
			   }
			});
			
			if(!isAllow){
				alert("첨부 파일 허용 확장자가 아닙니다.\n허용된 확장자는 " + constant.file.allow.ext.join(', ') + " 입니다.");
			}
			return isAllow
		}
		return true;
	}
};











var commonTest = {
	modalTest1: function modalTest1(){
		var config = {url:'/web/view/workspace/menu.html', title:'메뉴 타이틀', width:1000, height:200};
		common.modalShow(config);
	},
	modalTest2: function modalTest2(){
		var config = {url:'/web/view/workspace/footer.html', title:'푸터', width:500, height:300};
		common.modalShow(config);
	},
	modalTest3: function modalTest3(){
		var config = {serverUrl:'allocatedVirtualPC.action', title:'다 돌려랏!!', width:1100, height:650, resizable:true};
		common.modalShow(config);
	},
	modalTest4: function modalTest4(){
		var sendForm = {'key':'8'};
		var config = {serverUrl:'noticeBoardDetail.action', title:'공지사항 상세', width:800, height:600, sendForm:sendForm};
		common.modalShow(config);
	},
	modalTest5: function modalTest5(){
		(function( $ ) {
			$('#idDialogForm').append("<br><br>=====================<br><b>우니라나 대한민국!!</b>");
			var config = {title:'테스트', width:800, height:600};
			common.modalShow(config);
		})( jQuery );
	}
}