var usrTimer;
var authNumberLimitTime;
var isSendAuthNumber = false;
var usr = {

	//개인정보변경
	changeUserInfo: function changeUserInfo(){
		//usr.changeInfo();
		//return;
		var config = {url:'/web/view/user/changePw.html', title:'개인정보 변경', width:450, height:310};
		common.modalShow(config);
	},

	//비밀번호 확인
	pwdCheck : function pwdCheck(){
		var oform = document.changePwForm;
		(function($) {
			var changePw = $.trim($("#changePw").val());
			if (changePw.length == "") {
				alert("비밀번호 입력해주세요");
				$("#changePw").focus();
				return;
			}
			var params = {
				changePw : changePw
			}
			$.ajax({
				type : 'post',
				url : "/loginMain.action",
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params),
				success : function(data) { 
					usr.submitEncryptedForm(data.publicKeyModulus, data.publicKeyExponent,data.changePw);
				}
			});

		})(jQuery);
		
	},
	//rsa암복호화
	submitEncryptedForm: function submitEncryptedForm(rsaPublicKeyModulus, rsaPpublicKeyExponent,password22) {
		(function($) {
			var rsa = new RSAKey();
			rsa.setPublic(rsaPublicKeyModulus, rsaPpublicKeyExponent);
	
			// 사용자ID와 비밀번호를 RSA로 암호화한다.
			var password = rsa.encrypt(password22);
			var changePw = $("#changePw").val();
			var params = {
				changePw : changePw
			}
			$.ajax({
				type : 'post',
				url : "/changePwSuccess.action",
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params),
				success : function(data) {
					//console.log(data);
					if (data.changed == "true") {
						main.addHashHistory(constant.menu.hash.userInfo); 
						usr.changeInfo();
					}
					else{
						alert('비밀번호가 올바르지 않습니다.');
					}
				}
			});
		})(jQuery);
	},
	//변경화면으로
	changeInfo: function changeInfo() {
		(function($) {
			var config = {url:'/web/view/user/changePw.html', title:'개인정보 변경', width:400, height:500};
			common.modalHide(config);
			$.ajax({
				type : 'post',
				url : '/userInfo.action',
				dataType : 'html',
				data : null,
				success : function(data) {
					$("#divContent").html(data);
				}
			});
			$('#pwPopup').css("display", "block");
			$('#pwPopuped').css("display", "none");
		})(jQuery);

	},
	//각 해당 변경팝업
	infoChange: function infoChange(select){
		(function($) {
			var infoChangePhone= $("#infoChangePhone").val();
			var infoChangeEmail= $("#infoChangeEmail").val();
			var infoChangePw= $("#infoChangePw").val();
			if(select =="Email"){
				var config = {url:'/web/view/user/infoChangeEm.html', title:'이메일 변경', width:600, height:500};

			}else if (select =="Phone"){
				var config = {url:'/web/view/user/infoChangePhone.html', title:'휴대번호 변경', width:600, height:500};

			}else if (select =="Pw"){
				var config = {url:'/web/view/user/infoChangePw.html', title:'비밀번호 변경', width:600, height:500};

			}
			
			config.callback = function(){
				console.info("콜백 설정");
				var params = {
					infoChangePhone : infoChangePhone,
					infoChangeEmail : infoChangeEmail,
					infoChangePw : infoChangePw
				}
				$.ajax({
					type : 'post',
					url : "/infoChangeEmail.action",
					dataType : 'json',
					async: false,
					contentType : "application/json; charset=UTF-8",
					data : JSON.stringify(params),
					success : function(data) {
						console.info("모달 실행1111");
						if(infoChangePhone !=""){
							$('#cerPhoneAddr').val(data.infoChangePhone);
						}
						if(infoChangeEmail !=""){
							
							$('#cerEmailAddr').val(data.infoChangeEmail);
						}
						if(infoChangePw !=""){
							$('#cerPhoneAddr').val(data.infoChangePhone);
							$('#cerPassword').val(data.infoChangePw);
							$('#cerPsAddr').val(data.infoChangePhone);
						}
						
					}
				}); 
			}
			
			
			common.modalShow(config); 
			console.info("모달 실행");
			
			
		})(jQuery);
	},
	
	//각 해당 인증하기
	cerSub: function cerSub(select){
		(function($) {
			var infoChangeEmail= $("#infoChangeEmail").val();
			var infoChangePhone= $("#infoChangePhone").val();
			var infoChangePw= $("#infoChangePw").val();
			if(select =="Email"){
				var emailAddr = $("#emailAddr").val();
				if (emailAddr.length == "") {
					alert("이메일주소를 입력해주세요");
					$("#emailAddr").focus();
					return;
				}
				alert("인증번호가 발송되었습니다.");
				var params = {
						infoChangeEmail : infoChangeEmail,
						select : select
					}
			}else if(select =="Phone"){
				var phoneF = $("#phoneF").val();
				var phoneE = $("#phoneE").val();
				if (phoneF.length == "" && phoneE.length == "") {
					alert("전화번호를 입력해주세요");
					$("#phoneF").focus();
					return;
				}
				alert("인증번호가 발송되었습니다.");
				var params = {
						infoChangePhone : infoChangePhone,
						select : select
					}
				
			}else if(select =="Pw"){
				var newCerPwword = $("#newCerPwword").val();
				if (newCerPwword.length == "") {
					alert("비밀번호를 입력해주세요");
					$("#newCerPwword").focus();
					return;
				}
				alert("인증번호가 발송되었습니다.");
				var params = {
						infoChangePw : infoChangePw,
						select : select
					}
			}
				$.ajax({
					type : 'post',
					url : "/cerEmail.action",
					dataType : 'json',
					contentType : "application/json; charset=UTF-8",
					data : JSON.stringify(params),
					success : function(data) {
						$('#cerNum').val(data.cerValue); 
						lgn.discountTimer( 03,00, 'res','시간초과','msgtext','findNum');
					}
				});
		})(jQuery);
	},
	
	
	
	
	//이메일 변경하기 버튼클릭이벤트
	emailSuccess : function emailSuccess(){
		(function($) {
			var cerNum = $('#cerNum').val();
			var numText = $("#numText").val();
			var emailAddr = $("#emailAddr").val();
			var emailSel = $("#emailSel").val();
			var setEmail = emailAddr+"@"+emailSel;
			if (emailAddr.length == "") {
				alert("이메일주소를 입력해주세요");
				$("#emailAddr").focus();
				return;
			}
			var params = {
					setEmail : setEmail,
					numText : numText
			}
			$.ajax({
				type : 'post',
				url : "/changeEmail.action",
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params),
				success : function(data) {
					if(data.success == true){
						window.clearTimeout(lgn_searchId_ck);
						$("#infoChangeEmail").val(setEmail);
						$('#emPopup').css("display", "none");
						$('#emPopuped').css("display", "block");
					}else{
						alert("인증번호가 일치하지 않습니다.");
	
					}
				}
			});
		})(jQuery);

	},
 
	//휴대번호 변경하기 버튼클릭이벤트
	phoneSuccess : function phoneSuccess(){
		(function($) {
			var cerNum = $('#cerNum').val();
			var numText = $("#numText").val();
			var phoneSel = $("#phonelSel").val();
			var phoneF = $("#phoneF").val();
			var phoneE = $("#phoneE").val();
			var setPhone = phoneSel+"-"+phoneF+"-"+phoneE;
			var params = {
					setPhone : setPhone,
					numText :numText
			}
			$.ajax({
				type : 'post',
				url : "/changePhone.action",
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params),
				success : function(data) {
					if(data.success == true){
						window.clearTimeout(lgn_searchId_ck);
						$("#infoChangePhone").val(setPhone);
						$('#emPopup').css("display", "none");
						$('#emPopuped').css("display", "block");
					}else{
						alert("인증번호가 일치하지 않습니다.");
	
					}
				}
			});
		})(jQuery);
	},
	
	//비밀번호 변경하기 버튼클릭이벤트
	pwSuccess : function pwSuccess(){
		(function($) {
			var cerNum = $('#cerNum').val();//보내진 인증번호
			var numText = $("#numText").val();//입력한 인증번호
			var cerPassword = $("#cerPassword").val();
			var newCerPwword = $("#newCerPwword").val();
			var RnewCerPwword = $("#RnewCerPwword").val();
			if(newCerPwword != RnewCerPwword){
				alert("새 비밀번호가 일치하지 않습니다.");
				$("#newCerPwword").focus();
			}
			var params = {
					cerPassword:cerPassword,
					newCerPwword : newCerPwword,
					numText : numText
			}
			$.ajax({
				type : 'post',
				url : "/changePw.action",
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params),
				success : function(data) {
					if(data.success == true){
						window.clearTimeout(lgn_searchId_ck);
						$("#infoChangePw").val(RnewCerPwword);
						$('#emPopup').css("display", "none");
						$('#emPopuped').css("display", "block");
					}else{
						alert("인증번호가 일치하지 않습니다.");
	
					}
				}
			});
		})(jQuery);

	},
	//변경 후 팝업삭제
	emailHide : function emailHide(){
		common.modalHide(); 
	},






	//임시 패스워드로 로그인 여부 체크 후 경우에 따라 비밀번호 변경 팝업 호출
	temporaryPwdCheck: function temporaryPwdCheck(){
		(function( $ ) {
			var sendForm = {};
			$.ajax({ type: 'get' , url:'userTemporaryPwdCheck.action'  , dataType : 'json' , data: sendForm, 
	   			success: function(data) {
	   				//console.log("userTemporaryPwdCheck data:", data);
	   				if(data.isTemporaryPwd==true){
						$('#idTempPwdMsg').html('임시 비밀번호로 로그인되었습니다. <br> 임시 비밀번호 입력 후 개인정보변경 화면에서 <br>비밀번호를 재설정 하시기 바랍니다.'); 
	   				}
	   			}, 
	   			error: function (xhr, status, error) {console.log(error);} 
	   		});
   		})( jQuery );
	},

	//사용자 정보 변경 (이메일. 휴대폰번호, 비밀번호)
	userInfoChange: function userInfoChange(changeType,isTemporaryPwd){
		//초기화
		usr.setInitAuthNumberTimer();

		if(constant.user.changeType.email==changeType){
			usr.userInfoChangeEmail();
		}
		else if(constant.user.changeType.phone==changeType){
			usr.userInfoChangePhone();
		}
		else if(constant.user.changeType.pwd==changeType){
		//isemporaryPwd : 임시비밀번호 여부 
			usr.userInfoChangePwd(isTemporaryPwd);
		}
	},

	//이메일 주소 변경
	userInfoChangeEmail: function userInfoChangeEmail(){
		(function( $ ) {
			var paramData = {currentEmail: $("#infoChangeEmail").val()};
			var sendForm = {forwardPage:'/web/view/user/infoChangeEm', paramData:JSON.stringify(paramData)};
			var config = {url:'forwardPage.action', title:'이메일 주소 변경', width:600, height:410, sendForm:sendForm};
			common.modalShow(config);
		})( jQuery );
	},

	//휴대폰 번호 변경
	userInfoChangePhone: function userInfoChangePhone(){
		(function( $ ) {
			var paramData = {currentPhone: $("#infoChangePhone").val()};
			var sendForm = {forwardPage:'/web/view/user/infoChangePhone', paramData:JSON.stringify(paramData)};
			var config = {url:'forwardPage.action', title:'휴대폰 번호 변경', width:600, height:410, sendForm:sendForm};
			common.modalShow(config);
		})( jQuery );
	},

	//비밀번호 번호 변경
	userInfoChangePwd: function userInfoChangePwd(isTemporaryPwd){
		(function( $ ) {
			var paramData = {isTemporaryPwd : isTemporaryPwd};
			var sendForm = {forwardPage:'/web/view/user/infoChangePw', paramData:JSON.stringify(paramData)};
			var config = {url:'forwardPage.action', title:'비밀번호 변경', width:630, height:620, sendForm:sendForm};
			common.modalShow(config);
		})( jQuery );
	},


	//인증번호 받기 - 비밀번호 변경시 인증번호 받기 전에 준비단계(RSA)
	sendAuthNumberBeforeRSA: function sendAuthNumberBeforeRSA(id, target, limitTimeTargetID){
		(function( $ ) {
			if ($('#idOldPwd').val().length == "") {
				alert("기존 비밀번호를 입력하시기 바랍니다");
				$('#idOldPwd').focus();
				return;
			}

			if ($('#idNewPwd').val().length == "") {
				alert("변경할 비밀번호를 입력하시기 바랍니다");
				$('#idNewPwd').focus();
				return;
			}

			if ($('#idNewPwdConfirm').val().length == "") {
				alert("변경할 비밀번호를 입력하시기 바랍니다");
				$('#idNewPwdConfirm').focus();
				return;
			}

			if ($('#idNewPwd').val() != $('#idNewPwdConfirm').val() ) {
				alert("변경할 비밀 번호가 서로 일치 하지 않습니다.");
				$('#idNewPwdConfirm').focus();
				return;
			}

			if ($('#idPhoneNumber').val().length == "") {
				alert("휴대폰 번호를 입력하시기 바랍니다.");
				$('#idPhoneNumber').focus();
				return;
			}
			
			if(!usr.validateChkPwd( $.trim($('#idNewPwd').val()))){
				$('#idNewPwd').focus();
				return;
			}

			var ooo = {};
			ooo["id"] = id;
			ooo["target"] = target;
			ooo["limitTimeTargetID"] = limitTimeTargetID;

			var params = {};
			$.ajax({
				type : 'post',
				url : "/requestRSAPublicKey.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					usr.sendAuthNumberBeforeRSA2(ooo, data.publicKeyModulus, data.publicKeyExponent);	
				}
			});
		})( jQuery );
	},

	//인증번호 받기 - 비밀번호 변경시
	sendAuthNumberBeforeRSA2: function sendAuthNumberBeforeRSA2(ooo, rsaPublicKeyModulus, rsaPpublicKeyExponent){
		(function( $ ) {
			var rsa = new RSAKey();
			rsa.setPublic(rsaPublicKeyModulus, rsaPpublicKeyExponent);
			var userCurrentPw = rsa.encrypt($('#idOldPwd').val());

			var params = {inputOldPwd : userCurrentPw, inputPhone : $(ooo.id).val()};
			$.ajax({
				type : 'post',
				url : "/userPasswordCheck.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success == true){
							usr.sendAuthNumber(ooo.id, ooo.target, ooo.limitTimeTargetID);
						}
						else{
							if((data.failMsg || '') !=''){
								alert(data.failMsg);
							}
						}
					}
					else{				
						if((data.errorMsg || '') !=''){
							alert(data.errorMsg);
						}
					}
				}
			});
		})( jQuery );
	},

	//인증번호 발송
	sendAuthNumber: function sendAuthNumber(id, target, limitTimeTargetID){
		(function( $ ) {
			var value = $(id).val();
			if(constant.user.authNumberSendTarget.email==target){
				//메일 벨리데이션 체크
				if (value.length == "") {
					alert("이메일 주소를 입력하시기 바랍니다");
					$(id).focus();
					return;
				}
				if(common.emailValidateCheck(value)==false){
					alert("이메일 형식이 올바르지 않습니다.");
					$(id).focus();
					return;		
				}
			}
			else if(constant.user.authNumberSendTarget.sms==target){
				//휴대폰 벨리데이션 체크
				if (value.length == "") {
					alert("휴대폰 번호를 입력하시기 바랍니다.");
					$(id).focus();
					return;
				}
				if(common.phoneValidateCheck(value)==false){
					alert("휴대폰 번호가 올바르지 않습니다.");
					$(id).focus();
					return;		
				}
			}

			var params = {	targetSendType : target, targetSendValue : value };
			console.log("sendAuthNumber params: ", params);
			
			$.ajax({
				type : 'post',
				url : "/sendAuthNumber.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						console.log("인증번호=====>", data.userAuthNumber);
						isSendAuthNumber = true;
						usr.limitTimeProc(constant.user.defaultLimitTime, limitTimeTargetID, limitTimeTargetID);
						alert("인증번호가 발송되었습니다.\n확인 후 인증 번호를 입력 하시기 바랍니다.");
					}
					else{
						alert(data.errorMsg);
					}
				}
			});
		})(jQuery);
	},

	//인증번호 입력 제한 시간 타이머
	limitTimeProc: function limitTimeProc(initTime, targetID){
		authNumberLimitTime = initTime;
		clearInterval(usrTimer);
		usrTimer = setInterval(function(){ usr.timerStart(targetID) }, 1000);
	},

	//제한 시간 표출
	timerStart: function timerStart(target){
		(function( $ ) {
			console.log(authNumberLimitTime);
			if(authNumberLimitTime>0){
				authNumberLimitTime -= 1;
			}
			if(authNumberLimitTime<=0){
				clearInterval(usrTimer);
			}
			$(target).html(usr.convertSecToStr());

		})( jQuery );
	},

	//초를 x:xx 형식으로 변환)
	convertSecToStr: function convertSecToStr(){
		var m = Math.floor(authNumberLimitTime/60);
		var s = authNumberLimitTime%60;
		s = (s<10) ? "0"+s : s ;
		var timeStr = "(" +m + ":" + s + ")";
		return timeStr;
	},

	//인증 입력 남은(제한) 시간 조회
	getAuthNumberLimitTime: function getAuthNumberLimitTime(){
		return authNumberLimitTime;
	},

	//인증번호 발송 여부 get (true:발송됨)
	getIsSendAuthNumber: function getIsSendAuthNumber(){
		return isSendAuthNumber;
	},

	//인증번호 발송 여부 set (true:발송됨)
	setIsSendAuthNumber: function setIsSendAuthNumber(val){
		isSendAuthNumber = val;
	},

	//인증 번호 받기 관련 정보 초기화
	setInitAuthNumberTimer: function setInitAuthNumberTimer(){
		isSendAuthNumber = false;
		authNumberLimitTime = 0;
		clearInterval(usrTimer);
	},

	//사용자 정보 상세 - 이메일 주소 변경
	changeUserInfoEmail: function changeUserInfoEmail(idAuthNumber, idMailAddr){
		(function( $ ) {
			var authNumber = $(idAuthNumber).val();
			var mailAddr = $(idMailAddr).val();

			if (isSendAuthNumber == false) {
				alert("인증번호를 먼저 받으시기 바랍니다.");
				return;
			}
			if(authNumberLimitTime<=0){
				alert("인증번호 입력 제한 시간이 지났습니다.\n인증번호를 다시 받으시기 바랍니다.");
				return;
			}
			if (authNumber.length == "") {
				alert("인증번호를 입력하세요.");
				return;
			}
			if (mailAddr.length == 0) {
				alert("변경할 이메일 주소를 입력하세요.");
				return;	
			}

			var params = {	inputAuthNumber : authNumber, inputChangeMail : mailAddr};
			console.log("params :: ", params);
			$.ajax({
				type : 'post',
				url : "/changeUserInfo/email.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success == true){
							alert('변경되었습니다.');
							clearInterval(usrTimer);
							common.modalHide();
							main.callPage(constant.menu.action.userInfo);
						}
						else{
							if((data.failMsg || '') !=''){
								alert(data.failMsg);
							}
						}
					}
					else{
						if((data.errorMsg || '') !=''){
							alert(data.errorMsg);
						}
					}
				}
			});

		})( jQuery );
	},

	//사용자 정보 상세 - 휴대폰 번호 변경
	changeUserInfoPhone: function changeUserInfoPhone(idAuthNumber, idPhoneNumber){
		(function( $ ) {
			var authNumber = $(idAuthNumber).val();
			var phoneNum = $(idPhoneNumber).val();

			if (isSendAuthNumber == false) {
				alert("인증번호를 먼저 받으시기 바랍니다.");
				return;
			}
			if(authNumberLimitTime<=0){
				alert("인증번호 입력 제한 시간이 지났습니다.\n인증번호를 다시 받으시기 바랍니다.");
				return;
			}
			if (authNumber.length == "") {
				alert("인증번호를 입력하세요.");
				return;
			}
			if (phoneNum.length == 0) {
				alert("변경할 휴대폰 번호를 입력하세요.");
				return;	
			}

			var params = {	inputAuthNumber : authNumber, inputChangePhone : phoneNum};
			console.log("params :: ", params);
			$.ajax({
				type : 'post',
				url : "/changeUserInfo/phone.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success == true){
							alert('변경되었습니다.');
							clearInterval(usrTimer);
							common.modalHide();
							main.callPage(constant.menu.action.userInfo);
						}
						else{
							if((data.failMsg || '') !=''){
								alert(data.failMsg);
							}
						}
					}
					else{
						if((data.errorMsg || '') !=''){
							alert(data.errorMsg);
						}
					}
				}
			});

		})( jQuery );
	},

	//사용자 정보 상세 - 비밀 번호 변경 전 RSA public key 호출
	changeUserInfoPwdBeforeRSA: function changeUserInfoPwdBeforeRSA(idAuthNumber, idOldPwd, idNewPwd, idNewPwdConfirm){
		(function( $ ) {
			var authNumber = $(idAuthNumber).val();
			var oldPwd = $(idOldPwd).val();
			var newPwd = $(idNewPwd).val();
			var newPwdConfirm = $(idNewPwdConfirm).val();
			

			if (isSendAuthNumber == false) {
				alert("인증번호를 먼저 받으시기 바랍니다.");
				return;
			}
			if(authNumberLimitTime<=0){
				alert("인증번호 입력 제한 시간이 지났습니다.\n인증번호를 다시 받으시기 바랍니다.");
				return;
			}
			if (authNumber.length == "") {
				alert("인증번호를 입력하세요.");
				return;
			}
			if (oldPwd.length == "") {
				alert("기존 비밀 번호를 입력하세요.");
				return;
			}
			if (newPwd.length == "" || newPwdConfirm.length == "") {
				alert("변경할 비밀 번호를 입력하세요.");
				return;
			}
			if (newPwd != newPwdConfirm) {
				alert("변경할 비밀 번호가 서로 일치 하지 않습니다.");
				return;
			}

			if(!usr.validateChkPwd( $.trim($('#idNewPwd').val()))){
				$('#idNewPwd').focus();
				return false;
			}
			

			//비밀번호 변경시 인증번호 받기 전에 준비단계(RSA)
			var ooo = {};
			ooo['inputOldPwd'] = oldPwd;
			ooo['inputNewPwd'] = newPwd;
			ooo['inputAuthNumber'] = authNumber;
			
			
			var params = {	};
			$.ajax({
				type : 'post',
				url : "/requestRSAPublicKey.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					usr.changeUserInfoPwd(ooo, data.publicKeyModulus, data.publicKeyExponent);	
				}
			});
		})( jQuery );
	},

	//사용자 정보 상세 - 비밀 번호 변경
	changeUserInfoPwd: function changeUserInfoPwd(ooo, rsaPublicKeyModulus, rsaPpublicKeyExponent){
		(function( $ ) {

			var rsa = new RSAKey();
			rsa.setPublic(rsaPublicKeyModulus, rsaPpublicKeyExponent);
			var encOldPwd = rsa.encrypt(ooo.inputOldPwd);
			var encNewPwd = rsa.encrypt(ooo.inputNewPwd);

			var params = {	inputOldPwd : encOldPwd, inputNewPwd : encNewPwd, inputAuthNumber : ooo.inputAuthNumber};
			$.ajax({
				type : 'post',
				url : "/changeUserInfo/pwd.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success == true){
							alert('변경되었습니다.');
							clearInterval(usrTimer);
							common.modalHide();
							if(data.isTemporaryPwd == true){
								main.callPage(constant.menu.action.home);
							}else{
								main.callPage(constant.menu.action.userInfo);
							}
						}
						else{
							if((data.failMsg || '') !=''){
								alert(data.failMsg);
							}
						}
					}
					else{
						if((data.errorMsg || '') !=''){
							alert(data.errorMsg);
						}
					}
				}
			});

		})( jQuery );
	},
	

	validateChkPwd: function validateChkPwd(str){
		 var pw = str;
		 var num = pw.search(/[0-9]/g);
		 var eng = pw.search(/[a-z]/g);
		 var engL = pw.search(/[A-Z]/g);
		 var spe = pw.search(/[\-\[\]_+={}`~!@@#$%^&*|₩₩₩'₩";:₩/?,.<>]/gi);

		 if(pw.length < 9 || pw.length > 20){
		 	//console.log("9자리 이상 20자리 이하로 입력해주세요.");
		  	alert("9자리 이상 20자리 이하로 입력해주세요.");
		  	return false;
		 }

		 if(pw.search(/₩s/) != -1){
		 	//console.log("비밀번호는 공백 없이 입력해주세요.");
		 	alert("비밀번호는 공백 없이 입력해주세요.");
		 	return false;
		 } 

		 if(num < 0 || eng < 0 || engL < 0 || spe < 0 ){
		 	//console.log("num:"+num + "\neng:"+ eng +"\nengL:"+ engL + "\nspe:"+ spe);
		 	//console.log("소문자, 대문자, 숫자, 특수문자를 혼합하여 입력해주세요.");
			alert("소문자, 대문자, 숫자, 특수문자를 혼합하여 입력해주세요.");
			return false;
		 }

		 console.log("비밀번호 벨리데이션 체크 성공\nnum:"+num + "\neng:"+ eng +"\nengL:"+ engL + "\nspe:"+ spe);
		 return true;
	},
};