var fio = {
	// 검색
	search : function(url, targetId, searchFormId, page, limit) {
		(function($) {
			var params = jQuery("#"+searchFormId).serialize();
			params = params + "&page=" + page + "&limit=" + limit;
			$.ajax({
				type : 'post',
				url : url,
				dataType : 'html',
				data : params,
				success : function(data) {
					$("#" + targetId).html(data);
				}
			});
		})(jQuery);
	},
	
	// 히스토리(back)에서 호출되는 함수
	tmpSearchOut: function tmpSearchOut(page){
		fio.search('outFileList.action', 'outFileList_div', 'outFileSearchForm', page, 10);	
	},
	
	// 히스토리(back)에서 호출되는 함수
	tmpSearchIn: function tmpSearchIn(page){
		fio.search('inFileList.action', 'inFileList_div', 'inFileSearchForm', page, 10);	
	},
	
	// 히스토리(back)에서 호출되는 함수 - 탭
	triggerTabOut: function (){
		(function($) {
			$('ul.tab-s li').eq(0).trigger('click');
		})(jQuery);
	},
	
	// 히스토리(back)에서 호출되는 함수 - 탭
	triggerTabIn: function (){
		(function($) {
			$('ul.tab-s li').eq(1).trigger('click');
		})(jQuery);
	},
	
	initOutFileSearch: function(){
		fio.search('outFileList.action', 'outFileList_div', 'outFileSearchForm', 1, 10);
	},
	
	initInFileSearch: function(){
		fio.search('inFileList.action', 'inFileList_div', 'inFileSearchForm', 1, 10);
	},
	
	openRequestOutFileDialog: function(){
		(function($) {
			common.modalShow({
				title:'파일 반출 요청', 
				url:'/web/view/file/outFileRequestDialog.html', 
				width:550, 
				height:550
			});
		})(jQuery);
	},
	
	responseIe: function(success, type, message){
		(function($) {
			$(".ui-dialog").LoadingOverlay("hide");
			
			if (success == "true") {
				alert("정상 처리 되었습니다.");
				if(type == "out"){
					fio.initOutFileSearch();
				}else if(type == "in"){
					fio.initInFileSearch();
				}
	    		common.modalHide();
			} else {
				alert(message);
			}
		})(jQuery);
	},

	requestOutFile: function() {
		(function($) {
			var form = $('#requestOutFileForm');
			
			var requestMsg = form.find('textarea[name="requestMsg"]').val();		
			var file = form.find('input[name="file"]')[0];
			
			if(requestMsg == ""){
				alert("요청 메시지를 입력해 주십시오.");
				return;
			}
			
			if(file.value == ""){
				alert("첨부된 파일이 없습니다.");
				return;
			}
			// 파일 확장자 체크
			//if(!common.validateFile(file.value)) { return }
			
			if (!confirm('파일 반출 요청 하시겠습니까?')) { return; }
			
			$(".ui-dialog").LoadingOverlay("show", {
				color: "rgba(225, 242, 247, 0.5)",
				zIndex: 99999999999999
			});
			
			// IE9 이하인지 체크
			var isIE9 = false;
			if (file.files === undefined) {
				isIE9 = true;
			} 	
			
			if(!isIE9){
				var formData = new FormData();
		        formData.append('requestMsg', requestMsg);
		        formData.append('file', file.files[0]);
				
				$.ajax({
		            url: 'requestOutFile.action',
		            type: 'POST',
		            data: formData,
		            processData: false,
		            contentType: false,
		            success: function (result) {
		            	$(".ui-dialog").LoadingOverlay("hide");
		            	
		            	if(result.success){
		            		alert("정상 처리 되었습니다.");
		            		fio.initOutFileSearch();
		            		common.modalHide();
		            	}else{
		            		alert(result.message);
		            	}
		            },
		            error: function (xhr, status, error) {
		            }
				});
			}else{
				form.attr("action", "requestOutFileIE9.action");
				form.attr("target", "uploadFrame");
				form.submit();
			}
		})(jQuery);
	},
	
	approvalOutFile : function(exportDataID) {
		(function($) {
			if (!confirm('승인 하시겠습니까?')) { return; }
			
			var param = {'exportDataID': exportDataID};
			
			$.ajax({ type: 'post', url:'approvalOutFile.action', dataType : 'json', data: param, success: function(result) {
				if(result.success){
            		alert("정상 처리 되었습니다.");
            		fio.initOutFileSearch();
            	}else{
            		alert(result.message);
            	}
			}});
		})(jQuery);
	},
	
	openRejectOutFileDialog: function(exportDataID){
		(function($) {
			var sendForm = {'exportDataID':exportDataID};
			var config = {serverUrl:'/outFileRejectDialog.action', title:'파일 반출 반려', width:550, height:400, sendForm: sendForm};
			common.modalShow(config);
		})(jQuery);
	},
	
	rejectOutFile : function(exportDataID) {
		(function($) {
			var form = $('#rejectOutFileForm');
			
			var param = {
				exportDataID: exportDataID, 
				description: form.find('textarea[name="description"]').val()
			};
			
			if(param.description == ""){
				alert("반려 메시지를 입력해 주십시오.");
				return;
			}
			
			if (!confirm('반려 하시겠습니까?')) { return; }
			
			$(".ui-dialog").LoadingOverlay("show", {
				color: "rgba(225, 242, 247, 0.5)",
				zIndex: 99999999999999
			});
			
			$.ajax({ type: 'post', url:'rejectOutFile.action', dataType : 'json', data: param, success: function(result) {
				$(".ui-dialog").LoadingOverlay("hide");
				
				if(result.success){
            		alert("정상 처리 되었습니다.");
            		fio.initOutFileSearch();
            		common.modalHide();
            	}else{
            		alert(result.message);
            	}
			} });
		})(jQuery);
	},
	
	reapprovalOutFile : function(exportDataID) {
		(function($) {
			if (!confirm('파일 반출 재승인 하시겠습니까?')) { return; }
			
			var param = {'exportDataID': exportDataID};
			
			$.ajax({ type: 'post', url:'reapprovalOutFile.action', dataType : 'json', data: param, success: function(result) {
				if(result.success){
            		alert("정상 처리 되었습니다.");
            		fio.initOutFileSearch();
            	}else{
            		alert(result.message);
            	}
			}});
		})(jQuery);
	},
	
	cancelOutFile : function(exportDataID) {
		(function($) {
			if (!confirm('요청 취소 하시겠습니까?')) { return; }
			
			var param = {'exportDataID': exportDataID};
			
			$.ajax({ type: 'post', url:'cancelOutFile.action', dataType : 'json', data: param, success: function(result) {
				if(result.success){
            		alert("정상 처리 되었습니다.");
            		fio.initOutFileSearch();
            	}else{
            		alert(result.message);
            	}
			}});
		})(jQuery);
	},
	
	downloadOutFile : function(exportDataID, isFileCount) {
		(function($) {
			var frm = $('<form></form>');
			frm.attr('action', '/downloadOutFile.action');
			frm.attr('method', 'post');
			frm.attr('target', 'downloadFrame');
			frm.appendTo('body');
			frm.append($("<input type='hidden' name='exportDataID' value="+exportDataID+" >"))
			frm.append($("<input type='hidden' name='isFileCount' value="+isFileCount+" >"))
			frm.submit();
		})(jQuery);
	},
	
	openRequestInFileDialog: function(){
		(function($) {
			common.modalShow({
				title:'파일 반입', 
				url:'/web/view/file/inFileRequestDialog.html', 
				width: 550, 
				height: 600
			});
		})(jQuery);
	},

	requestInFile: function() {
		(function($) {
			var form = $('#requestInFileForm');
			
			var requestMsg = form.find('textarea[name="requestMsg"]').val();		
			var file = form.find('input[name="file"]')[0];
			
			if(requestMsg == ""){
				alert("반입 메시지를 입력해 주십시오.");
				return;
			}
			
			if(file.value == ""){
				alert("첨부된 파일이 없습니다.");
				return;
			}
			
			// 파일 확장자 체크
			//if(!common.validateFile(file.value)) { return }
			
			if (!confirm('파일 반입을 하시겠습니까?')) { return; }
			
			$(".ui-dialog").LoadingOverlay("show", {
				color: "rgba(225, 242, 247, 0.5)",
				zIndex: 99999999999999
			});
			
			// IE9 이하인지 체크
			var isIE9 = false;
			if (file.files === undefined) {
				isIE9 = true;
			} 	
			
			if(!isIE9){
				var formData = new FormData();
		        formData.append('requestMsg', requestMsg);
		        formData.append('file', file.files[0]);
				
				$.ajax({
		            url: 'requestInFile.action',
		            type: 'POST',
		            data: formData,
		            processData: false,
		            contentType: false,
		            success: function (result) {
		            	$(".ui-dialog").LoadingOverlay("hide");
		            	
		            	if(result.success){
		            		alert("정상 처리 되었습니다.");
		            		fio.initInFileSearch();
		            		common.modalHide();
		            	}else{
		            		alert(result.message);
		            	}
		            },
		            error: function (xhr, status, error) {
		            }
				});
			}else{
				form.attr("action", "requestInFileIE9.action");
				form.attr("target", "uploadFrame");
				form.submit();
			}
		})(jQuery);
	},
	
	downloadInFile : function(importDataID) {
		(function($) {
			var frm = $('<form></form>');
			frm.attr('action', '/downloadInFile.action');
			frm.attr('method', 'post');
			frm.attr('target', 'downloadFrame');
			frm.appendTo('body');
			frm.append($("<input type='hidden' name='importDataID' value="+importDataID+" >"))
			frm.append($("<input type='hidden' name='isFileCount' value='false' >"))
			frm.submit();
		})(jQuery);
	},
	
	openMessageDialog: function(label, text){
		(function($) {
			common.modalShow({
				title:label, 
				url:'/web/view/file/messageDialog.html', 
				width:500, 
				height:300,
				callback: function(){
					$("#message_label").text(label);
					$("#message_text").text(text);
				}
			});
		})(jQuery);
	}
};