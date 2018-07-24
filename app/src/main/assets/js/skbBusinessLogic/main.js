var DEFAULT_REFRESH_MODAL_HIDE=true; 	//페이지 로딩시 열려진 모달창을 닫을지 여부
var main = {

	installFileDownloadCheck: function installFileDownloadCheck(type){
		main.pageSessionCheck(main.installFileDownload(type));
	},
		
	//설치 프로그램 다운로드
	installFileDownload: function installFileDownload(type){
	  	 var act = '';
	           var alertMsg = "설치 파일을 다운로드 하시겠습니까?";

		if(type=='A'){		
			act = 'p2vagentdownload';
			alertMsg = "P2V / V2V Agent " + alertMsg;
		}
		else if(type=='WC'){
			act = 'windowsvpcclientdownload';
			alertMsg = "Window 전용 접속 클라이언트 " + alertMsg;
		}
		else if(type=='LC'){
			act = 'linuxvpcclientdownload';
			alertMsg = "Linux 전용 접속 클라이언트 " + alertMsg;
		}
		/*else if(type=='LC32'){
			act = 'linuxClient32BitDownload';
			alertMsg = "Linux32 전용 접속 클라이언트 " + alertMsg;
		}
		else if(type=='LC64'){
			act = 'linuxClient64BitDownload';
			alertMsg = "Linux64 전용 접속 클라이언트 " + alertMsg;
		}*/
		else if(type=='AC'){
			act = 'androidvpcclientdownload';
			alertMsg = "Android 전용 접속 클라이언트 " + alertMsg;
		}
		else if(type=='R'){
			act = 'remotecallagentdownload';
			alertMsg = "원격제어 Agent " + alertMsg;
		}
			
		if(confirm(alertMsg)){
			var frm = document.getElementById("idFileDownloadForm");            	
			frm.action = act + ".action";
			frm.submit();
        		}
	},


	//로그아웃
	logout: function logout(){
		if(confirm("로그아웃 하시겠습니까?")){
			location.href = "/logout.action"
		}
	},

	//hashchange 이벤트 등록
	regHashchageEvent: function regHashchageEvent(){
		window.addEventListener('hashchange', function(){
			console.log('hash change event : ', document.location.hash);
			main.hashChangeProc();
		});			
	},

	//hash change 처리 함수(같은 화면 중복 호출시 change 이벤트가 발생되지 않으니 해당 함수 강제 호출하도록 하여 새로고침 효과가 나오도록 한다.)
	hashChangeProc: function hashChangeProc(){
		if(DEFAULT_REFRESH_MODAL_HIDE==true){ 
			common.modalHide();
		}
		else{
			DEFAULT_REFRESH_MODAL_HIDE = true;
		}
		main.pageSessionCheck();

		var locationHashValue = document.location.hash.slice(1);
		var locationHashArray = locationHashValue.split('/');
		//console.log('locationHashArray Size : ', locationHashArray.length);

		if(locationHashArray.length==1){
			if(locationHashValue==constant.menu.hash.userInfo){
				return;		//보안상 리턴
			}
			main.callPage(main.getActionData(document.location.hash.slice(1)));
		}
		else if(locationHashArray.length==3){
			var contentsPage = locationHashArray[0] +"/"+ locationHashArray[1];
			main.callContentsPage(contentsPage, locationHashArray[2]);
		}
		else{
			console.log("Check Hash History!!");
		}
	},


	//페이지 세션 체크
	pageSessionCheck: function pageSessionCheck(callbackFunc){
		(function( $ ) {
			$.ajax({ type: 'post' , url:'pageSessionCheck.action' , dataType : 'json' , data: null, 
				success: function(data) {
					if(data.alive==false) {
						alert('사용 시간이 초과되어 로그인 페이지로 이동합니다.');
						location.href = "/logout.action"
					} 
					else{
						if(typeof callbackFunc != "undefined"){
							callbackFunc();
						}
					} 
				}  
			}); 
		})( jQuery );
	},

	//loaction hash에 등록 (ex:   qa/list/4  ,    qa/info/6   )
	addHashHistory: function addHashHistory(contentsPage, value){
		var locationHashValue = document.location.hash.slice(1);
		var locationHashArray = locationHashValue.split('/');
		if(locationHashArray.length==1){
			if(locationHashValue==contentsPage){
				main.hashChangeProc();
				return;
			}
		}

		var hashData = contentsPage;
		var tmpValue = value || "";

		if(tmpValue!=''){
			hashData += "/" + value;	
		}
		document.location.hash = hashData;
	},

	//타시스템에서 화면 링크
	callLinkPage: function callLinkPage(linkPage, linkValue){
		console.log('callLinkPage:: start!');
		console.log('callLinkPage:: link_page ==> ', linkPage);
		console.log('callLinkPage:: link_value ==> ', linkValue);

		if(linkPage == constant.linkpage.home){
			main.addHashHistory(constant.menu.hash.home);
		}
		else if(linkPage == constant.linkpage.notice){
			if(linkValue!=''){
				main.addHashHistory(constant.notice.hash.info, linkValue);
			}
			else{
				main.addHashHistory(constant.menu.hash.notice);
			}
		}
		else if(linkPage == constant.linkpage.qa){
			if(linkValue!=''){
				main.addHashHistory(constant.qa.hash.info, linkValue);
			}
			else{
				main.addHashHistory(constant.menu.hash.qa);
			}
		}
		else if(linkPage == constant.linkpage.user){
			DEFAULT_REFRESH_MODAL_HIDE = false;
			usr.changeUserInfo();
			main.addHashHistory(constant.menu.hash.home);
		}
		else{
			location.href = "/logout.action";
		}
	},

	//초기화 화면 (로그인 후 최초 페이지 or 새로고침으로 호출되는 페이지)
	callInitPage: function callInitPage(defaultHomePage){
		if(document.location.hash.slice(1)==''){
			main.addHashHistory(defaultHomePage);
		}
		else{	//새로고침한 경우 같은 해시값으로 추가해봐야 change이벤트가 발생하지 않으므로 함수 분리하여 재호출
			console.log("브라우저 새로고침");
						
			//home화면에서 새로고침 클릭시
			if(document.location.hash.slice(1)==defaultHomePage){
				main.hashChangeProc();
			}
			else{
				main.addHashHistory(defaultHomePage);
			}
		}
	},

	//메뉴 클릭
	clickMenuPage: function clickMenuPage(page){
		//검색필터값 초기화
		sessionStorage.clear();
		
		main.callMenuPage(page);
	},
	
	//메뉴 호출
	callMenuPage: function callMenuPage(page){
		//같은 메뉴를 계속 클릭 했을때...
		if(document.location.hash.slice(1)!='' && document.location.hash.slice(1) == page){
			main.hashChangeProc();
		}
		else{
			main.addHashHistory(page);
		}
	},

	//페이지 전환(삭제예정)
	// callHomePage: function callHomePage(defaultHomePageAction){
	// 	console.log("해쉬: ",document.location.hash.slice(1));
	// 	if(document.location.hash.slice(1)==''){
	// 		document.location.hash = main.getHashData(defaultHomePageAction);
	// 	}
	// 	else{
	// 		main.callPage(main.getActionData(document.location.hash.slice(1)));
	// 	}
	// },

	


	//페이지 전환(삭제예정)
	// hashPage: function hashPage(menuType){
	// 	var tmpHashData = main.getHashData(menuType);
	// 	if(document.location.hash.slice(1)!='' && document.location.hash.slice(1) == tmpHashData){
	// 		main.callPage(menuType);
	// 	}
	// 	else{
	// 		document.location.hash = main.getHashData(menuType);
	// 	}
	// },


	//menu 호출
	callPage: function callPage(actionUrl){
		(function( $ ) {
			if(actionUrl==constant.menu.action.home){
				$('a.link').each(function() {
			            $(this).removeClass('selected');
	        			});	
			}

    			var sendForm = { menuType:actionUrl };
			$.ajax({ type: 'post' , url: actionUrl , dataType : 'html' , parameters: sendForm, success: function(data) { $("#divContent").html(data); } }); 

			//prototype이 충돌됨!! 
			//var request = new Ajax.Updater('divContent', menuType,
			//	{  method : "post", parameters: sendForm,  onSuccess: function(request) { succFunc(); }, onFailure:function(){failFunc();}, evalScripts: true } );
		          
		})( jQuery );
	},

	callContentsPage: function callContentsPage(contentsPage, value){
		if(contentsPage==constant.notice.hash.list){		//공지 목록
			notice.tmpSearch(value);
		}
		else if(contentsPage==constant.notice.hash.info){	//공지 상세
			notice.goDetail(value);
		}
		else if(contentsPage==constant.qa.hash.list){		//QA 목록
			qa.tmpSearch(value);
		}
		else if(contentsPage==constant.qa.hash.info){		//QA 상세
			qa.goDetail(value);
		}
		else if(contentsPage==constant.qa.hash.insert){		//QA 등록
			qa.goInsert();
		}
		else if(contentsPage==constant.fileIO.hash.outList){	//파일 반출 목록
			fio.tmpSearchOut(value);
		}
		else if(contentsPage==constant.fileIO.hash.inList){	//파일 반입 목록
			fio.tmpSearchIn(value);
		}
		else if(contentsPage==constant.fileIO.hash.outTab){	//파일 반출 탭
			fio.triggerTabOut(value);
		}
		else if(contentsPage==constant.fileIO.hash.inTab){	//파일 반입 탭
			fio.triggerTabIn(value);
		}
	},

	//저장된 해쉬 값으로 action 반환
	getActionData: function getActionData(hashType){
		var rtn = "";
		if(hashType == constant.menu.hash.home){
			rtn = constant.menu.action.home;
		}
		else if(hashType == constant.menu.hash.notice){
			rtn = constant.menu.action.notice;
		}
		else if(hashType == constant.menu.hash.qa){
			rtn = constant.menu.action.qa;
		}
		else if(hashType == constant.menu.hash.fileIO){
			rtn = constant.menu.action.fileIO;
		}
		else if(hashType == constant.menu.hash.recovery){
			rtn = constant.menu.action.recovery;
		}
		else if(hashType == constant.menu.hash.help){
			rtn = constant.menu.action.help;
		}
		else if(hashType == constant.menu.hash.userInfo){
			rtn = constant.menu.action.userInfo;
		}
		else if(hashType == constant.menu.hash.installFiledownload){
			rtn = constant.menu.action.installFiledownload;
		}
		return rtn;
	},


	//임시 패스워드로 로그인 여부 체크 후 경우에 따라 비밀번호 변경 팝업 호출
	temporaryPwdCheck: function temporaryPwdCheck(){
		(function( $ ) {
			var sendForm = {};
			$.ajax({ type: 'get' , url:'userTemporaryPwdCheck.action'  , dataType : 'json' , data: sendForm, 
	   			success: function(data) {
	   				console.log("userTemporaryPwdCheck data:", data);
	   				if(data.isTemporaryPwd==true){
						//usr.changeUserInfo();
	   					usr.userInfoChange(constant.user.changeType.pwd, data.isTemporaryPwd);
	   					
	   				}
	   			}, 
	   			error: function (xhr, status, error) {console.log(error);} 
	   		});
   		})( jQuery );
	},

	//메뉴 클릭한 것처럼 class 적용
	selectMenuApplyClass: function selectMenuApplyClass(id){
		//idMenuNoti idMenuQa
		(function( $ ) {
			$('a.link').each(function() {
				$(this).removeClass('selected');
			});	
		        $('#'+id).addClass('selected');
		})( jQuery );	
	},


	// succFunc: function succFunc(){
	// 	console.log('성공!');
	// },
	
	// failFunc: function failFunc(){
	// 	console.log('에러!');
	// },


	

	//메뉴 action으로 해쉬 값 반환(삭제예정)
	// getHashData: function getHashData(menuType){
	// 	var rtn = '';
	// 	if(menuType == constant.menu.action.home){
	// 		rtn = constant.menu.hash.home;
	// 	}
	// 	else if(menuType == constant.menu.action.notice){
	// 		rtn = constant.menu.hash.notice;
	// 	}
	// 	else if(menuType == constant.menu.action.noticeDetail){
	// 		rtn = constant.menu.hash.noticeDetail;
	// 	}
	// 	else if(menuType == constant.menu.action.qa){
	// 		rtn = constant.menu.hash.qa;
	// 	}
	// 	else if(menuType == constant.menu.action.qaDetail){
	// 		rtn = constant.menu.hash.qaDetail;
	// 	}
	// 	else if(menuType == constant.menu.action.fileIO){
	// 		rtn = constant.menu.hash.fileIO;
	// 	}
	// 	else if(menuType == constant.menu.action.recovery){
	// 		rtn = constant.menu.hash.recovery;
	// 	}
	// 	else if(menuType == constant.menu.action.help){
	// 		rtn = constant.menu.hash.help;
	// 	}
	// 	return rtn;
	// },






    // function callPage(menuType){
    //   alert('1');
    //       $.ajax({
    //             method:"post",
    //             //dataType: "json",
    //             dataType: "html",
    //             url: menuType,
    //             success: function (data) {
    //               alert('111');
    //                 console.log(data);
    //                 $("#divContent").append(data);
    //             }
    //         });   
    //       alert('2'); 
    // }

	
};