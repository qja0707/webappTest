var lgn_searchId_ck;
var lgn = {
	
		login : function login() {
			var oform = document.mainForm;
			(function($) {
				var id = $.trim($("#userIDVal").val());
				var pw = $.trim($("#userPwVal").val());
				if (id.length == "") {
					alert("아이디를 입력해주세요");
					$("#userIDVal").focus();
					return;
				}

				if (pw.length == "") {
					alert("비밀번호를 입력해주세요");
					$("#userPwVal").focus();
					return;
				}

				var rsa = new RSAKey();
				var params = {}
				var temp = JSON.stringify(params);
				$.ajax({
					type : 'post',
					url : "https://vdesk.skbroadband.com/loginMain.action",
					dataType : 'json',
					contentType : "application/json; charset=UTF-8",
					data : temp,
					success : function(data) {
					    alert(temp+"\n"+data.publicKeyModulus+","+data.publicKeyExponent);
						lgn.submitEncryptedForm(id, pw, data.publicKeyModulus,
								data.publicKeyExponent);
					},
					error : function(error){
					    alert(error);
					}
				});

			})(jQuery);
		}, 
		
		submitEncryptedForm : function submitEncryptedForm(username, password, rsaPublicKeyModulus,
				rsaPpublicKeyExponent) {
			var rsa = new RSAKey();
			rsa.setPublic(rsaPublicKeyModulus, rsaPpublicKeyExponent);
		
			// 사용자ID와 비밀번호를 RSA로 암호화한다.
			var userID = rsa.encrypt(username);
			var userPw = rsa.encrypt(password);
			var ipAdress = $("#ipAdress").val();
			// POST 로그인 폼에 값을 설정하고 발행(submit) 한다.
			var params = {
					userID : userID,
					userPw : userPw,
					ipAdress : ipAdress
			}
			$.ajax({
				type : 'post',
				url : "https://vdesk.skbroadband.com/logins.action",
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params),
				success : function(data) {
				    alert("post data submit success");
					if(data.success == true){
						if(data.checkInNetwork == false){
							$('#SMS-box').css("display", "block");
							$('#log-in').css("display", "none");
						}else{
							location.href = "https://vdesk.skbroadband.com/main.action"
						}
					}else{
						if(data.failCount>=5){
							alert(data.errorMsg);
						}else{
							alert(data.errorMsg);
						}
						// 로그인 실패시 체크박스 해제 및 쿠키 삭제
						document.getElementById("cb1").checked = false;
						deleteCookie("userInputId");
					}
					
				},
				error : function(request,status,error){
				    alert("ip:"+ipAdress+"\nE:id:"+userID+"\ncode:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				}
			});
		},
		
	
	
	//외부로그인 인증학인결과
	outLogResult: function outLogResult() {
		(function($) {
			var oform = document.smsForm;
			var phoneNum = $("#phoneNum").val(); //전화번호
			var certificatedNumber = $("#certificatedNumber").val();
			oform.method.value = "smsForm";
			if(phoneNum.length == ""){
				alert("핸드폰 번호를 입력해주세요");
				$("#phoneNum").focus();
				return;
			}
			if(certificatedNumber.length == ""){
				alert("인증번호가 입력되지 않았습니다. 입력해주세요.");
				$("#certificatedNumber").focus();
				return;
			}
			var params = {
					sessionSms : certificatedNumber
				}
			var cerNum = $("#findNum").val();
			$.ajax({
				type : 'post',
				url : "/outResult.action",
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params),
				success : function(data) {
					 if(data.success != true){
						 alert("인증번호가 일치하지 않습니다.");
					 }else{
						 location.href = "/main.action"
					 }
				}
			});
		})(jQuery);
	},
		
	
	
	//외부로그인 인증학인결과 outLogResult
	smsSubmit: function smsSubmit() {
		(function($) {
			var phoneNum = $("#phoneNum").val(); //전화번호
			var id = $("#userIDVal").val();
			var sessTest = $("#sessTest").val();
			if(phoneNum.length == ""){
				alert("핸드폰 번호를 입력해주세요");
				$("#phoneNum").focus();
				return;
			}
			var params = {
				phoneNum : phoneNum
			}
				$.ajax({
					type : 'post',
					url : "/sms.action",
					dataType : 'json',
					contentType : "application/json; charset=UTF-8",
					data : JSON.stringify(params),
					success : function(data) {
						if(data.success == true){
						window.clearTimeout(lgn_searchId_ck);
						alert("인증번호가 발송되었습니다.");
						lgn.discountTimer( 03,00, 'resu','시간초과','msgtextu','phoneNum');
						}else{
							alert("등록되어 있는 정보와 일치하지 않습니다. 다시 확인하세요.");

						}
							
					}
				});
		})(jQuery);
	},
	//전화번호 하이픈
	showKeyCode: function showKeyCode(findPhone) {
		var x = findPhone;
		x.value = x.value.replace(/[^0-9]/g, '');
		var tmp = "";
		if( x.value.length < 4){
			x.value;
		}else if(x.value.length < 7){
			tmp += x.value.substr(0, 3);
			tmp += '-';
			tmp += x.value.substr(3);
			x.value = tmp;
		}else if(x.value.length < 11){
			tmp += x.value.substr(0, 3);
			tmp += '-';
			tmp += x.value.substr(3, 3);
			tmp += '-';
			tmp += x.value.substr(6);
			x.value = tmp;
		}else{				
			tmp += x.value.substr(0, 3);
			tmp += '-';
			tmp += x.value.substr(3, 4);
			tmp += '-';
			tmp += x.value.substr(7);
			x.value = tmp;
		}
	},
	//아이디찾기
	searchId: function searchId(){
		usr.setInitAuthNumberTimer();

		var config = {url:'/web/view/login/searchId.html', title:'아이디 찾기', width:580, height:440};
		common.modalShowNoSession(config); 
	},
	
	doOpenCheck:function doOpenCheck(chk){
	    var obj = document.getElementsByName("check");
	    for(var i=0; i<obj.length; i++){
	        if(obj[i] != chk){
	            obj[i].checked = false;
	        }
	    }
	},

	
	// 아이디찾기 인증번호 
	findIdSubmit: function findIdSubmit() {
		(function($) {
			//아이디찾기 인증번호 발송
			var findPhone = $("#findPhone").val();
			var findName = $("#findName").val();
			var userTell = $("#userTell").val();
			var findNum = $("#findNum");
			findNum.disabled = 'false';
			if (findName.length == "") {
				alert("이름을 입력해주세요");
				$("#findName").focus();
				return;
			}
			if (findPhone.length == "") {
				alert("전화번호를 입력해주세요");
				$("#findPhone").focus();
				return;
			}
			var params = {
				findPhone : findPhone,
				findName : findName
			}
				$.ajax({
					type : 'post',
					url : "/findIdSms.action",
					dataType : 'json',
					contentType : "application/json; charset=UTF-8",
					data : JSON.stringify(params),
					success : function(data) {
						$('#findIdcerNum').val(data.smsNum);
						if(data.user == false){
							alert("사용자정보가 일치하지 않습니다.");
							return;
						}else{
							if(data.Success == true){
								alert("인증번호가 발송되었습니다.");
								lgn.discountTimer( 03,00, 'res','시간초과','msgtext','findNum');
							}else {
								alert("사용자정보가 일치하지 않습니다.");
								$("#findName").focus();
								return;
							}
						}
						
					}
				});
		})(jQuery);
	},
	
	discountTimer : function discountTimer(mm, ss, dest, msgEnd, msgtext, findNum ) {
		//var findNum =  document.getElementById("findNum");
			
		if (!msgEnd) {
			msgEnd = '입력시간이 초과되었습니다. 인증번호를 발송을 다시 시도하세요.';
			document.getElementById(dest).innerHTML = "인증번호";
		}
		ss = ss - 1;
		if (ss == -1) {
			ss = 59;
			mm = mm - 1;
		}
		if (ss == 0 && mm == 0) {
			msgEnd = '입력시간이 초과되었습니다. 인증번호를 발송을 다시 시도하세요.';
			document.getElementById(msgtext).innerHTML = msgEnd;
			document.getElementById(dest).innerHTML = "(00 : 00)";
			findNum.disabled = true;
			return;
		}else{
			msgEnd = '';
			document.getElementById(msgtext).innerHTML = msgEnd;
			findNum.disabled = false;
		}
		mm += '';
		ss += '';
		mm = (mm.length == 1) ? '0' + mm : mm;
		ss = (ss.length == 1) ? '0' + ss : ss;	

		document.getElementById(dest).innerHTML = '('+mm + ': ' + ss+')' ;
		lgn_searchId_ck = window.setTimeout("lgn.discountTimer(" + mm + "," + ss + ",'" + dest + "','" + msgEnd + "','" + msgtext + "','" + findNum + "')", 1000);
	},
	
	//아이디찾기 인증학인결과
	findIdSuccess: function findIdSuccess() {
		(function($) {
			var findName = $("#findName").val();//아이디찾기용
			var findPhone = $("#findPhone").val();//전화번호
			var findNum = $("#findNum").val();//인증번호
			var findIdcerNum = $("#findIdcerNum").val();
			var pass = "pass";
			var params = {
				findIdcerNum : findIdcerNum,
				findPhone:findPhone,
				findName:findName,
				pass:pass
				
			}
				$.ajax({
					type : 'post',
					url : "/findIdSms.action",
					dataType : 'json',
					contentType : "application/json; charset=UTF-8",
					data : JSON.stringify(params),
					success : function(data) {
						$('#checkId').val(data.userId);
						
						if(data.smsNum == findNum){
							alert("인증번호가 확인되었습니다.");
							window.clearTimeout(lgn_searchId_ck);
						}else{
							alert("인증번호가 틀렸습니다.");
							$("#findNum").focus();
							return;
						}
					}
				});
				
		})(jQuery);
	},

	warnMsg : function warnMsg(){
		(function($) {
			 if (!confirm('정말로 취소하시겠습니까?')) { return; }
			 common.modalHide();
		})(jQuery);
	},
	//비밀번호 찾기
	searchPw : function searchPw(){
		usr.setInitAuthNumberTimer();

		var config = {url:'/web/view/login/searchPw.html', title:'비밀번호 찾기', width:600, height:650};
		common.modalShowNoSession(config); 
	},
	
	//비밀번호 인증번호 확인
	findPwSubmit : function findPwSubmit(){
		(function($) {
			var pwEmailAddr= $("#pwEmailAddr").val();
			var pwEemailSel= $("#pwEemailSel").val();
			var setEmail= pwEmailAddr+"@"+pwEemailSel;
			var pwFindId =$("#pwFindId").val();
			var userTell = $("#userTell").val();
			var pwFindPhone = $("#pwFindPhone").val();
			
			var params = {
					setEmail : setEmail,
					pwFindId : pwFindId,
					pwFindPhone:pwFindPhone,
					
				}
	 
			if (pwFindId.length == "") {
				alert("아이디를 입력해주세요");
				$("#pwFindId").focus();
				return;
			}
			if (pwEmailAddr.length == "") {
				alert("이메일을 입력해주세요");
				$("#pwEmailAddr").focus();
				return;
			}
				$.ajax({
					type : 'post',
					url : "/findPwSms.action",
					dataType : 'json',
					contentType : "application/json; charset=UTF-8",
					data : JSON.stringify(params),
					success : function(data) {
						$('#findPwcerNum').val(data.smsNum);
						if(data.user == false){
							alert("사용자정보가 일치하지 않습니다.");
							return;
						}else{
							if(data.Success == true){
								alert("인증번호가 발송되었습니다.");
								lgn.discountTimer( 03,00, 'resp','시간초과','msgtextp','findNum');
							}else{
								alert("사용자정보가 일치하지 않습니다.");
								}
							}
						}
				});
			 
		})(jQuery);
	},
	
	//비밀번호 찾기 인증학인결과
	findPwSuccess: function findPwSuccess() {
		(function($) {
			var pwEmailAddr= $("#pwEmailAddr").val();
			var pwEemailSel= $("#pwEemailSel").val();
			var setEmail= pwEmailAddr+"@"+pwEemailSel;
			var pwFindId =$("#pwFindId").val();
			var userTell = $("#userTell").val();
			var pwFindPhone = $("#pwFindPhone").val();
			var findNum = $("#findNum").val();
			var pass = "pass";
			var params = {
					setEmail : setEmail,
					pwFindId : pwFindId,
					pwFindPhone:pwFindPhone,
					pass:pass
				
			}
				$.ajax({
					type : 'post',
					url : "/findPwSms.action",
					dataType : 'json',
					contentType : "application/json; charset=UTF-8",
					data : JSON.stringify(params),
					success : function(data) {
						if(data.smsNum == findNum){
							alert("인증번호가 확인되었습니다.");
							window.clearTimeout(lgn_searchId_ck);
							$('#pwPopup').css("display", "none");
							$('#sucessPwPopup').css("display", "block");
						}else{
							alert("인증번호가 틀렸습니다.");
							$("#findNum").focus();
							return;
						}
					}
				});
				
		})(jQuery);
	},
	
	
	tempPw : function tempPw(){
		(function($) {
			var check = $(':radio[id="check"]:checked').val();
			var pwFindId =$("#pwFindId").val();
			var params = {
					check:check,
					pwFindId:pwFindId
			}
			
			$.ajax({
				type : 'post',
				url : "/tempPw.action",
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params),
				success : function(data) {
					if(data.cuccessResult == true){
						alert("발송되었습니다.");
						var config = {url:'/web/view/user/hearchPw.html', title:'아이디 찾기 팝업', width:600, height:500};
						common.modalHide(config); 
					}else{
						alert("발송에 실패하였습니다.");
					}
				}
			});
		})(jQuery);
	},
		

	
	
	
	
	//변경 후 팝업삭제
	searchIdHide : function searchIdHide(){
		var config = {url:'/web/view/user/searchId.html', title:'아이디 찾기 팝업', width:700, height:500};
		common.modalHide(config); 
	
	},
	
	
	//공지사항
	notice: function notice(noticeId){
		(function($) {
			var sendForm = {
				noticeId: noticeId,
				popup: "true"
			}
			var config = {serverUrl:'/notice/loginGoDetail.action', sendForm: sendForm, title:'공지사항', width:800, height:800};
			common.modalShowNoSession(config); 
		})(jQuery);
	},
 



 	//여기부터 새로 시작===============================================================
 	//아이디 찾기 - 인증번호 받기
 	findId_sendAuthNumber: function findId_sendAuthNumber(idUsreName, idPhoneNum, idTimerTarget){
 		(function( $ ) {
	 		$('#idShow').html("");

	 		var inputUserName = $(idUsreName).val();
	 		var inputPhoneNum = $(idPhoneNum).val();

			if (inputUserName.length == "") {
				alert("이름을 입력하시기 바랍니다.");
				$(idUsreName).focus();
				return;
			}
			if (inputPhoneNum.length == "") {
				alert("휴대폰 번호를 입력하시기 바랍니다.");
				$(idPhoneNum).focus();
				return;
			}
			if(common.phoneValidateCheck(inputPhoneNum)==false){
				alert("휴대폰 번호가 올바르지 않습니다.");
				$(idPhoneNum).focus();
				return;		
			}

	 		var params = {inputUserName: inputUserName,  inputUserPhone: inputPhoneNum };
	 		$.ajax({
				type : 'post',
				url : "/findUserID/sendAuthNumber.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success==true){
							console.log("인증번호=====>", data.userAuthNumber);
							isSendAuthNumber = true;
							usr.limitTimeProc(constant.user.defaultLimitTime, idTimerTarget);
							alert("인증번호가 발송되었습니다.\n확인 후 인증 번호를 입력 하시기 바랍니다.");
						}
						else{
							alert(data.failMsg);
						}
					}
					else{
						alert(data.errorMsg);
					}
				}
			});
	 	})(jQuery);
 	},

	//아이디 찾기 - 인증번호 확인 및 아이디 표출
 	findId: function findId(idUsreName, idPhoneNum, idAuthNumber){
 		(function( $ ) {
 			var inputUserName = $(idUsreName).val();
	 		var inputPhoneNum = $(idPhoneNum).val();
	 		var inputAuthNumber = $(idAuthNumber).val();

			if (usr.getIsSendAuthNumber() == false) {
				alert("인증번호를 먼저 받으시기 바랍니다.");
				return;
			}
			if(usr.getAuthNumberLimitTime()<=0){
				alert("인증번호 입력 제한 시간이 지났습니다.\n인증번호를 다시 받으시기 바랍니다.");
				return;
			}
	 		if (inputUserName.length == "") {
				alert("이름을 입력하시기 바랍니다.");
				$(idUsreName).focus();
				return;
			}
			if (inputAuthNumber.length == "") {
				alert("인증 번호를 입력하시기 바랍니다.");
				$(idAuthNumber).focus();
				return;
			}

	 		var params = {	
	 					inputUserName: inputUserName,  
	 					inputUserPhone: inputPhoneNum, 
	 					inputAuthNumber: inputAuthNumber
	 				 };
	 		$.ajax({
				type : 'post',
				url : "/findUserID.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success == true){
							$('#idShow').html(data.findUserID);
							usr.setInitAuthNumberTimer();
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
	 	})(jQuery);
 	},

 	//비밀번호 찾기 - 인증번호 받기
 	findPassword_sendAuthNumber: function findPassword_sendAuthNumber(idUserID, idEmailAddr, idPhoneNum, idTimerTarget){
 		(function( $ ) {

	 		var inputUserID = $(idUserID).val();
	 		var inputEmailAddr = $(idEmailAddr).val();
	 		var inputUserPhone = $(idPhoneNum).val();

			if (inputUserID.length == "") {
				alert("아이디를 입력하시기 바랍니다.");
				$(idUserID).focus();
				return;
			}
			if (inputEmailAddr.length == "") {
				alert("이메일 주소를 입력하시기 바랍니다");
				$(idEmailAddr).focus();
				return;
			}
			if(common.emailValidateCheck(inputEmailAddr)==false){
				alert("이메일 형식이 올바르지 않습니다.");
				$(idEmailAddr).focus();
				return;
			}
			if (inputUserPhone.length == "") {
				alert("휴대폰 번호를 입력하시기 바랍니다.");
				$(idPhoneNum).focus();
				return;
			}
			if(common.phoneValidateCheck(inputUserPhone)==false){
				alert("휴대폰 번호가 올바르지 않습니다.");
				$(idPhoneNum).focus();
				return;		
			}

	 		var params = {inputUserID: inputUserID,  inputEmailAddr: inputEmailAddr, inputUserPhone: inputUserPhone };
	 		$.ajax({
				type : 'post',
				url : "/findPassword/sendAuthNumber.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success==true){
							console.log("인증번호=====>", data.userAuthNumber);
							isSendAuthNumber = true;
							usr.limitTimeProc(constant.user.defaultLimitTime, idTimerTarget);
							alert("인증번호가 발송되었습니다.\n확인 후 인증 번호를 입력 하시기 바랍니다.");
						}
						else{
							alert(data.failMsg);
						}
					}
					else{
						alert(data.errorMsg);
					}
				}
			});
	 	})(jQuery);
 	},

 	//비밀번호 찾기 - 인증번호 확인
 	findPassword_confirmAuthNumber: function findPassword_confirmAuthNumber(idUserID, idEmailAddr, idPhoneNum, idAuthNumber, idTargetSendType){
 		(function( $ ) {
 			var inputUserID = $(idUserID).val();
 			var inputEmailAddr = $(idEmailAddr).val();
	 		var inputUserPhone = $(idPhoneNum).val();
	 		var inputAuthNumber = $(idAuthNumber).val();
	 		var inputIdTargetSendType = $(':radio[name="idTargetSendType"]:checked').val();
	 		
			if (usr.getIsSendAuthNumber() == false) {
				alert("인증번호를 먼저 받으시기 바랍니다.");
				return;
			}
			if(usr.getAuthNumberLimitTime()<=0){
				alert("인증번호 입력 제한 시간이 지났습니다.\n인증번호를 다시 받으시기 바랍니다.");
				return;
			}
			if (inputUserID.length == "") {
				alert("아이디를 입력하시기 바랍니다.");
				$(idUserID).focus();
				return;
			}
			if (inputEmailAddr.length == "") {
				alert("이메일 주소를 입력하시기 바랍니다");
				$(idEmailAddr).focus();
				return;
			}
			if(common.emailValidateCheck(inputEmailAddr)==false){
				alert("이메일 형식이 올바르지 않습니다.");
				$(idEmailAddr).focus();
				return;
			}
			if (inputUserPhone.length == "") {
				alert("휴대폰 번호를 입력하시기 바랍니다.");
				$(idPhoneNum).focus();
				return;
			}
			if(common.phoneValidateCheck(inputUserPhone)==false){
				alert("휴대폰 번호가 올바르지 않습니다.");
				$(idPhoneNum).focus();
				return;		
			}
			if(inputAuthNumber.length == "") {
				alert("인증 번호를 입력하시기 바랍니다.");
				$(idAuthNumber).focus();
				return;
			}

	 		var params = {	
	 					inputUserID: inputUserID,  
	 					inputEmailAddr: inputEmailAddr, 
	 					inputUserPhone: inputUserPhone,
	 					inputAuthNumber: inputAuthNumber,
	 					inputIdTargetSendType: inputIdTargetSendType
	 				 };
	 		$.ajax({
				type : 'post',
				url : "/findPassword/confirmAuthNumber.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success == true){
							usr.setInitAuthNumberTimer();
							var config = {title:'임시 비밀번호 발송', width:600, height:650}; 
							common.modalShowNoSession(config, false); 
							$('#idSearchPw_authNumber').css("display", "none");
							$('#idSearchPw_sendTarget').css("display", "block");
							alert('임시 비밀번호가 '+data.sendTarget+'로 발송되었습니다.');
							common.modalHide();
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
	 	})(jQuery);
 	}, 	

 	//비밀번호 찾기 - 임시 비밀번호 발송
 	findPassword_sendTmpPwd: function findPassword_sendTmpPwd(idUserID, idEmailAddr, idPhoneNum, idTargetSendType){
 		(function( $ ) {
 			var inputUserID = idUserID;
 			var inputEmailAddr = idEmailAddr;
	 		var inputUserPhone = idPhoneNum;
 			var inputTargetSendType = $(':radio[name="idTargetSendType"]:checked').val();

 			console.log("inputUserID :", inputUserID);
 			console.log("inputEmailAddr :", inputEmailAddr);
 			console.log("inputUserPhone :", inputUserPhone);

			var sendTarget = (inputTargetSendType==constant.user.authNumberSendTarget.sms)?"SMS":"이메일";
			if(!confirm('임시 비밀번호가 '+sendTarget+'로 발송됩니다. \n진행하시겠습니까?')){
				return;
			}

	 		var params = {	
	 					inputUserID: inputUserID,  
	 					inputEmailAddr: inputEmailAddr, 
	 					inputUserPhone: inputUserPhone,
	 					inputTargetSendType: inputTargetSendType
	 				 };
	 		$.ajax({
				type : 'post',
				url : "/findPassword/sendTempPassword.action",
				dataType : 'json',
				data : params,
				success : function(data) {
					if(data.error!=true){
						if(data.success == true){
							console.log("발송 대상:",inputTargetSendType);
							alert('임시 비밀번호가 '+sendTarget+'로 발송되었습니다.');
							common.modalHide();
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
	 	})(jQuery);
 	}, 	

};