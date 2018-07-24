var qa = {
	// 검색
	search : function(url, targetId, searchFormId, page, limit) {
		(function($) {
			if(sessionStorage.length>1){
				qa.getSession();
				if(sessionStorage.getItem("page") !=null){
					page = sessionStorage.getItem("page");
				}else{
					page = 1;
				}
				var params = "openSel="+sessionStorage.getItem("openSel")+"&qaTitle="+sessionStorage.getItem("qaTitle")+"&qaWriter="+sessionStorage.getItem("qaWriter")+"&repSel="+sessionStorage.getItem("repSel")+"&startDt="+sessionStorage.getItem("startDt")+"&endDt="+sessionStorage.getItem("endDt")
			}else{
				var params = jQuery("#" + searchFormId).serialize();
			}
			params = params + "&page=" + page + "&limit=" + limit;
			$.ajax({
				type : 'post',
				url : url,
				dataType : 'html',
				data : params,
				success : function(data) {
					$("#" + targetId).html(data);
					//
				}
			});
			
		})(jQuery);
	},
	
	
	//검색값을 상세화면에서 목록으로 전환할때 유지하기 위해 필요.1 필드추가시 함께 추가필요
	sessionStorage : function(){
		(function($) {
		sessionStorage.setItem("openSel",$("#openSel").val());
		sessionStorage.setItem("qaTitle",$("#qaTitle").val());
		sessionStorage.setItem("qaWriter",$("#qaWriter").val());
		sessionStorage.setItem("repSel",$("#repSel").val());
		sessionStorage.setItem("startDt",$("#startDt").val());
		sessionStorage.setItem("endDt",$("#endDt").val());
		
		})(jQuery);
	},

	//검색값을 상세화면에서 목록으로 전환할때 유지하기 위해 필요.2 필드추가시 함께 추가필요
	getSession : function(){
		(function($) {
			if(sessionStorage.length>0){
				if( sessionStorage.getItem("openSel").value == "undefined"){
					sessionStorage.getItem("openSel").value = "";
				}
				if(sessionStorage.getItem("qaTitle").value == "undefined"){
					sessionStorage.getItem("qaTitle").value = "";
				}
				if(sessionStorage.getItem("qaWriter").value == "undefined"){
					sessionStorage.getItem("qaWriter").value = "";
				}
				if(sessionStorage.getItem("repSel").value == "undefined"){
					sessionStorage.getItem("repSel").value = "";
				}
				if(sessionStorage.getItem("startDt").value == "undefined"){
					sessionStorage.getItem("startDt").value = "";
				}
				if(sessionStorage.getItem("startDt").value == "undefined"){
					sessionStorage.getItem("startDt").value = "";
				}
				$('#openSel').val(sessionStorage.getItem("openSel"));
				$('#qaTitle').val(sessionStorage.getItem("qaTitle"));
				$('#qaWriter').val(sessionStorage.getItem("qaWriter"));
				$('#repSel').val(sessionStorage.getItem("repSel"));
				$('#startDt').val(sessionStorage.getItem("startDt"));
				$('#endDt').val(sessionStorage.getItem("endDt"));
			}
		})(jQuery);
	},
	
	initSearch : function() {
		if(sessionStorage.length>1){
			qa.search('/qa/list.action', 'QAList_div', 'QASearchForm',  sessionStorage.getItem("page"), 10);
		}else{
			qa.search('/qa/list.action', 'QAList_div', 'QASearchForm', 1, 10);
		}
		
	},
	//재 검색시 기존 페이지 저장값 삭제
	removeSessionStorage : function	(){
		sessionStorage.removeItem("page");
	},
	
	// 히스토리(back)에서 호출되는 함수
	tmpSearch: function(page){
		(function($) {
			var divQaList = $('#QAList_div');
			if(divQaList.length==0){
				main.callMenuPage(constant.menu.hash.qa);
			}
			else{
				sessionStorage.setItem("page",page);
				qa.search('/qa/list.action', 'QAList_div', 'QASearchForm', page, 10);
			}
		})(jQuery);
	},
	
	/**
	 * Q/A 상세 페이지 이동
	 */
	goDetail : function(questionId) {
		(function($) {
			var sendForm = {
				'questionId' : questionId
			};
			$.ajax({
				type : 'post',
				url : '/qa/goDetail.action',
				dataType : 'html',
				data : sendForm,
				success : function(data) {
					$("#divContent").html(data);
				}
			});
		})(jQuery);
	},

	/**
	 * QA 등록 페이지 이동
	 */
	goInsert : function() {
		(function($) {
			$.ajax({
				type : 'post',
				url : '/qa/goInsert.action',
				dataType : 'html',
				data : null,
				success : function(data) {
					$("#divContent").html(data);
				}
			});

		})(jQuery);
	},
	
	responseIe: function(success, message){
		if (success == "true") {
			alert("저장 되었습니다.");
			main.callMenuPage(constant.menu.hash.qa);
		} else {
			alert(message);
		}
	},
	
	/**
	 * QA 저장
	 */
	insert : function() {
		(function($) {
			var form = $('#qaInsertForm');
			
			var isOpen = form.find('input[name="isOpen"]:checked').val();
			var title = form.find('input[name="title"]').val();
			var content = form.find('textarea[name="content"]').val();		
			var file = form.find('input[name="file"]')[0];
			
			// Validation Check
			if(!common.validate("제목", title, 100)) { return }
			if(!common.validate("내용", content, 0)) { return }
			// 파일 확장자 체크
			if(!common.validateFile(file.value)) { return }
			
			if (!confirm('등록 하시겠습니까?')) { return; }
			
			// IE9 이하인지 체크
			var isIE9 = false;
			if (file.files === undefined) {
				isIE9 = true;
			} 			
			
			if(!isIE9){
				var formData = new FormData();
				formData.append('isOpen', isOpen);
				formData.append('title', title);
				formData.append('content', content);
				if(file.value != ""){
					formData.append('file', file.files[0]);
				}
				
				$.ajax({
					url : "/qa/insert.action",
					type : 'post',
					data : formData,
					processData : false,
					contentType : false,
					success : function(result) {
						if (result.success == true) {
							alert("저장 되었습니다.");
							main.callMenuPage(constant.menu.hash.qa);
						} else {
							alert(result.message);
						}
					}
				});
			}else{
				form.attr("action", "/qa/insertIE9.action");
				form.attr("target", "uploadFrame");
				form.submit();
			}
		})(jQuery);
	},
	
	/**
	 * Q/A 수정
	 */
	modify: function() {
		(function($) {
			var form = $('#qaModifyForm');
			
			var questionId = form.find('input[name="questionId"]').val();
			var isOpen = form.find('input[name="isOpen"]:checked').val();
			var title = form.find('input[name="title"]').val();
			var content = form.find('textarea[name="content"]').val();		
			var file = form.find('input[name="file"]')[0];
			
			// Validation Check
			if(!common.validate("제목", title, 100)) { return }
			if(!common.validate("내용", content, 0)) { return }
			// 파일 확장자 체크
			if(!common.validateFile(file.value)) { return }
			
			if (!confirm('수정 하시겠습니까?')) { return; }
			
			// IE9 이하인지 체크
			var isIE9 = false;
			if (file.files === undefined) {
				isIE9 = true;
			} 			
			
			if(!isIE9){
				var formData = new FormData();
				formData.append('questionId', questionId);
				formData.append('isOpen', isOpen);
				formData.append('title', title);
				formData.append('content', content);
				if(file.value != ""){
					formData.append('file', file.files[0]);
				}
				
				$.ajax({
					url : "/qa/modify.action",
					type : 'post',
					data : formData,
					processData : false,
					contentType : false,
					success : function(result) {
						if (result.success == true) {
							alert("저장 되었습니다.");
							main.callMenuPage(constant.menu.hash.qa);
						} else {
							alert("저장을 실패하였습니다.");
						}
					}
				});
			}else{
				form.attr("action", "/qa/modifyIE9.action");
				form.attr("target", "uploadFrame");
				form.submit();
			}
			
		})(jQuery);
	},
	
	/**
	 * 삭제
	 */
	delete: function() {
		(function($) {
			if (!confirm('삭제 하시겠습니까?')) { return; }
			
			var params = {
				questionId : $("#questionId").val()
			}

			$.ajax({
				url : "/qa/delete.action",
				type : 'post',
				data : JSON.stringify(params),
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				success : function(data) {
					if (data.success == true) {
						alert("삭제 되었습니다.");
						main.callMenuPage(constant.menu.hash.qa);
					} else {
						alert(data.message);
					}
				}
			});
		})(jQuery);
	},
	
	/**
	 * QA 파일 삭제
	 */
	deleteQuestionFile: function(questionId, fileId) {
		(function($) {
			if (!confirm('첨부 파일을 삭제 하시겠습니까?')) { return; }
			
			var params = {
				fileId : fileId
			};

			$.ajax({
				url : "/qa/deleteQuestionFile.action",
				type : 'post',
				data : JSON.stringify(params),
				dataType : 'json',
				contentType : "application/json; charset=UTF-8",
				success : function(data) {
					if (data.success == true) {
						alert("삭제 되었습니다.");
						qa.goDetail(questionId);	// 다시 상세 화면을 보여준다.
					} else {
						alert(data.message);
					}
				}
			});
		})(jQuery);
	},
	
	downloadQuestionFile: function (fileId) {
		(function($) {
			var frm = $('<form name="downloadForm"></form>');
			frm.attr('action', '/qa/downloadQuestionFile.action');
			frm.attr('method', 'post');
			frm.attr('target', 'downloadFrame');
			frm.appendTo('body');
			frm.append($("<input type='hidden' id='fileId' name='fileId' value=" + fileId + " >"))
			frm.submit();
		})(jQuery);
	},
	
	downloadAnswerFile: function (fileId) {
		(function($) {
			var frm = $('<form name="downloadForm"></form>');
			frm.attr('action', '/qa/downloadAnswerFile.action');
			frm.attr('method', 'post');
			frm.attr('target', 'downloadFrame');
			frm.appendTo('body');
			frm.append($("<input type='hidden' id='fileId' name='fileId' value=" + fileId + " >"))
			frm.submit();
		})(jQuery);
	}
};