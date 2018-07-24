var CYH=0;
var RECOVERY_ACCODION_SELECTED_INDEX= 0;
var rcv_current_status = [];	//show,  hide
var rcv_before = '';
var rcv = {
	

	abcc: function abcc(){
		(function( $ ) {
			common.setLoadingImageOff();
			var sendForm = {testData:"어쩌고 저쩌고"};
			$.ajax({ type: 'post' , url:'testData.action'  , dataType : 'json' , data: sendForm, 
		       			success: function(data) {console.log("천영학",data); common.setLoadingImageOn(); $('#idMiliTime').val(data.miliTime); }, error: function (xhr, status, error) {common.setLoadingImageOn();} 
		       		}); 


		})( jQuery );
	},

	//퍼블리싱 전에 개발
	//할당된 가상 PC 목록 (=복구 대상 가상 PC)
	recoveryPCList: function recoveryPCList(target){
		(function( $ ) {
			console.log("새로고침");
			RECOVERY_ACCODION_SELECTED_INDEX = 0;
			for(var i=0; i<rcv_current_status.length; i++){
				rcv_current_status[i] = 'hide';
			}

			$.ajax({ type: 'post' , url:'recoveryAllocatedVirtualPC.action'  , dataType : 'html' , data: null, success: function(data) { $(target).html(data); } }); 
  		})( jQuery );
	},

	//퍼블리싱 전에 개발
	//가상 PC 상세 정보
	detailInfo_test: function detailInfo_test(vPCSetID, vPCName, aaaaa){
		console.log("가상 PC 상세 - 오류복구");

		 (function( $ ) { 
		 	if(rcv_before==aaaaa){ rcv_before ="";}

		 	var sendForm = { vPCSetID : vPCSetID, vPCName : vPCName };

			console.log("vPCSetID :" , vPCSetID);
			console.log("vPCName :" , vPCName);
	       		$.ajax({ type: 'post' , url:'recoveryAllocatedVirtualPCInfo.action'  , dataType : 'html' , data: sendForm, 
	       			success: function(data) { $(aaaaa).html(data);  $(rcv_before).text(""); rcv_before = aaaaa; } 
	       		}); 
	   	})( jQuery );
	},

	//퍼블리싱 전에 개발
	//가상 PC 상세 정보
	detailInfo: function detailInfo(vPCSetID, vPCName){
		console.log("가상 PC 상세 - 오류복구");

		 (function( $ ) { 
		 	var sendForm = { vPCSetID : vPCSetID, vPCName : vPCName };

			console.log("vPCSetID :" , vPCSetID);
			console.log("vPCName :" , vPCName);

	       		$.ajax({ type: 'post' , url:'recoveryAllocatedVirtualPCInfo.action'  , dataType : 'html' , data: sendForm, success: function(data) { $("#idRecoveryPCInfo").html(data); } }); 
	   	})( jQuery );
	},

	//퍼블리싱 전에 개발
	//새로고침
	refresh: function refresh(){
		(function( $ ) {      
	      		$.ajax({ type: 'post' , url:'recoveryAllocatedVirtualPC.action'  , dataType : 'html' , data: null, success: function(data) { $("#idRecoveryPCList").html(data); } }); 
	  	})( jQuery );
	},

	
	//퍼블리싱 전에 개발
	//오류 복구
	recovery: function recovery(){
		alert('준비중입니다.');
		// console.log("오류복구 실행");
		// (function( $ ) {      
	 	//      		$.ajax({ type: 'post' , url:'recoveryAllocatedVirtualPC.action'  , dataType : 'html' , data: null, success: function(data) { $("#idRecoveryPCList").html(data); } }); 
	 	//  	})( jQuery );
	},


	//아코디언 항목 구성(화면 초기에 호출 되어야함)
	makeAccordionList: function makeAccordionList(){
		//(function( $ ) {
			//$(function(){
				console.info("$add.auto" , $add.auto);
				for(var k in $add.auto){
					console.log("$add.auto["+k+"] :", $add.auto[k]);
					if(typeof($add.auto[k])=="function"){
						$add.auto[k]();
					}
				}
				//if(typeof($add)=="undefined"){
				//	var $abc={ version:{},auto:{disabled:false}};
				//	$add = $abc;
				//}
				
				// for(var k in $add.auto){
				// 	if(typeof($add.auto[k])=="function"){
				// 		$add.auto[k]();
				// 	}
				// }
			//});
		//})( jQuery );
	},

	addItem: function addItem(){
		(function( $ ) {      
			var addDiv = "<div role='header'>추가 영역!</div>";
			addDiv+= "<div role='content'><p>메롱!</p></div>";			
			$('#idAddItemArea').append(addDiv);
		})( jQuery );
	},

	moreList: function moreList(){
		console.log("더 보기");
		(function( $ ) {      

			$('#idAddItemArea_hidden').load("/web/view/recovery/addItem.html");
			//console.log("11111");

			var aaaa= document.getElementById("idAddItemArea_hidden").innerHTML;//.innerHtml;
			$('#idAddItemArea').append(aaaa);
			//console.log(aaaa);


			//alert(aaaa.innerHTML);
			

			//$('#idAddItemArea').append("/web/view/recovery/addItem.html");
			//$('#idAddItemArea').load("/web/view/recovery/addItem.html");

			//$('#idAddItemArea').load("/web/view/workspace/menu.html");
			//$('#idAddItemArea').append("");
			


			//$add={ version:{},auto:{disabled:false}};

			//for(var k in $add.auto){
			//		console.log($add.auto)
			//}
			//rcv.makeAccordionList();
			//$add.auto.Accordion();



			// var $newdiv1 = $( "<div id='object1'></div>" ),
			// newdiv2 = document.createElement( "div" ),
			// existingdiv1 = document.getElementById( "idCCC" );
			 
			// $( "idAddItemArea" ).append( $newdiv1, [ newdiv2, existingdiv1 ] );
		})( jQuery );
	},


	//가상PC 항목 클릭 (아코디언 펼침/접힘)
	detailInfoClick: function detailInfoClick(idx, vPCSetID, vPCName){
		(function( $ ) {
			for(var i=0; i<rcv_current_status.length; i++){
				rcv_current_status[i] = 'hide';
			}

			if(RECOVERY_ACCODION_SELECTED_INDEX == idx){
				RECOVERY_ACCODION_SELECTED_INDEX = 0;
			}
			else{
				RECOVERY_ACCODION_SELECTED_INDEX = idx;
				rcv_current_status[idx] = 'show';
			}

			if(rcv_current_status[idx]=='show'){
				console.log("아코디언 펼쳤음("+idx+"):",  vPCName);
				rcv.detailInfoRefresh(idx, vPCSetID, vPCName);
			}
			else{
				console.log("아코디언 접었음("+idx+"):",  vPCName);
			}
			
		})( jQuery );
	},

	//상세 정보 리플레시
	detailInfoRefresh: function detailInfoRefresh(idx, vPCSetID, vPCName){
		(function( $ ) {
			RECOVERY_ACCODION_SELECTED_INDEX = idx;
			var targetVPC = '#idRecoveryVirtualPcInfo_'+idx;
			var targetProgress = '#idRecoveryProgrsss_'+idx;

			rcv.recoveryDetailInfo(idx, $(targetVPC), vPCSetID, vPCName);
			rcv.recoveryProgressInfo(idx, $(targetProgress), vPCSetID, vPCName);
		})( jQuery );
	},

	//오류복구 대상 가상PC의 상세 정보
	recoveryDetailInfo: function recoveryDetailInfo(idx, target, vPCSetID, vPCName){

		(function( $ ) {
			if(target==='undefined'){
				console.log("target이 없음 (메뉴가 이동 되었을 가능성이 있음 : virtual pc)");
			}
			else{
				console.log("888 recoveryDetailInfo vPCSetID: " , vPCSetID );
				console.log("888 recoveryDetailInfo vPCName: " , vPCName );

				
				common.setLoadingImageOff();
				var sendForm = { selectedIndex : idx, vPCSetID : vPCSetID, vPCName : vPCName };
				$.ajax({ type: 'post' , url:'recoveryDetailInfo.action'  , dataType : 'html' , data: sendForm, 
					success: function(data) { 
						common.setLoadingImageOn();
						$(target).html(data);  
					},
					error: function (xhr, status, error) {common.setLoadingImageOn();}
				}); 
			}
  		})( jQuery );
	},

	//오류복구 대상 가상PC의 오류복구 프로그래스 정보
	recoveryProgressInfo: function recoveryProgressInfo(idx, target, vPCSetID, vPCName){
		(function( $ ) {
			if(target==='undefined'){
				console.log("target이 없음 (메뉴가 이동 되었을 가능성이 있음 : progress)");
			}
			else{
				console.log("999 recoveryProgressInfo vPCSetID: " , vPCSetID );
				console.log("999 recoveryProgressInfo vPCName: " , vPCName );


				common.setLoadingImageOff();
				var sendForm = { selectedIndex : idx, vPCSetID : vPCSetID, vPCName : vPCName };
				$.ajax({ type: 'post' , url:'recoveryProgressInfo.action'  , dataType : 'html' , data: sendForm, 
					success: function(data) { 
						common.setLoadingImageOn();
						$(target).html(data);  
					},
					error: function (xhr, status, error) {common.setLoadingImageOn();}
				}); 
			}
  		})( jQuery );
	},

	//컬럼 항목 변경
	columnChange: function columnChange(target, htmlTxt){
		(function( $ ) {      
			$(target).html(htmlTxt); 
		})( jQuery );		
	},

	//아코디언 펼침 상태 초기화
	accordionShowStatusInit: function accordionShowStatusInit(vpcCount){
		
		for (var i=0; i<=vpcCount; i++){
			rcv_current_status.push('hide');
		}
	},

	//복구 시작 실행	
	vpcErrorRecovery: function vpcErrorRecovery(idx, vPCSetID, vPCName){
		(function( $ ) {
			var msg = '오류 복구를 시작하시겠습니까?';
			if ( confirm(msg) ) {
				var pcStatusImageColumn = '#idRecoveryPcStatusImageCol_' +  idx;
				var pcStatusValueColumn = '#idRecoveryPcStatusValueCol_' +  idx;

				var sendForm = {vPCName : vPCName, vPCSetID : vPCSetID};
				$.ajax({ type: 'post' , url:'vpcErrorRecovery.action'  , dataType : 'json' , data: sendForm, 
			       			success: function(data) {
			       				if (data.error) {
			       					alert(data.errorMsg);
			       				} else {
				    				rcv.columnChange($(pcStatusImageColumn), '<img src="/web/images/icon/icon_ing.gif"/>');
				    				rcv.columnChange($(pcStatusValueColumn), '복구중');
				       				rcv.detailInfoRefresh(idx, vPCSetID, vPCName);
			       				}
			       			}, 
			       			error: function (xhr, status, error) {
			       				alert(data.errorMsg);
			       			} 
			       		});
	        		}
		})( jQuery );
	},
};