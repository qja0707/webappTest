var notice = {

	// 검색
	search : function(url, targetId, searchFormId, page, limit) {
		(function($) {
			if(sessionStorage.length>1){
				notice.getSession();
				if(sessionStorage.getItem("page") !=null){
					page = sessionStorage.getItem("page");
				}else{
					page = 1;
				}
				var params = "title="+sessionStorage.getItem("title")+"&writer="+sessionStorage.getItem("writer")+"&content="+sessionStorage.getItem("content")+"&startDt="+sessionStorage.getItem("startDt")+"&endDt="+sessionStorage.getItem("endDt")
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
				}
			});
		})(jQuery);
	},

	//검색값을 상세화면에서 목록으로 전환할때 유지하기 위해 필요.1 필드추가시 함께 추가필요
	sessionStorage : function(){
		(function($) {
		sessionStorage.setItem("title",$("#title").val());
		sessionStorage.setItem("writer",$("#writer").val());
		sessionStorage.setItem("content",$("#content").val());
		sessionStorage.setItem("startDt",$("#startDt").val());
		sessionStorage.setItem("endDt",$("#endDt").val());
		
		})(jQuery);
	},

	//검색값을 상세화면에서 목록으로 전환할때 유지하기 위해 필요.2 필드추가시 함께 추가필요
	getSession : function(){
		(function($) {
			if(sessionStorage.length>0){
				if( sessionStorage.getItem("title") == "undefined"){
					sessionStorage.getItem("title") = "";
				}
				if(sessionStorage.getItem("writer")== "undefined"){
					sessionStorage.getItem("writer") = "";
				}
				if(sessionStorage.getItem("content") == "undefined"){
					sessionStorage.getItem("content") = "";
				}
				if(sessionStorage.getItem("startDt") == "undefined"){
					sessionStorage.getItem("startDt") = "";
				}
				if(sessionStorage.getItem("startDt") == "undefined"){
					sessionStorage.getItem("startDt") = "";
				}
				$('#title').val(sessionStorage.getItem("title"));
				$('#writer').val(sessionStorage.getItem("writer"));
				$('#content').val(sessionStorage.getItem("content"));
				$('#startDt').val(sessionStorage.getItem("startDt"));
				$('#endDt').val(sessionStorage.getItem("endDt"));
			}
		})(jQuery);
	},
	
	// 전체검색
	initSearch : function() {
		if(sessionStorage.length>1){
			notice.search('/notice/list.action', 'noticeList_div', 'noticeSearchForm', sessionStorage.getItem("page"), 10);
		}else{
			notice.search('/notice/list.action', 'noticeList_div', 'noticeSearchForm', 1, 10);
		}
	},
	//재 검색시 기존 페이지 저장값 삭제
	removeSessionStorage : function	(){
		sessionStorage.removeItem("page");
	},
	// 히스토리(back)에서 호출되는 함수
	tmpSearch: function(page){
		(function($) {
			var divQaList = $('#noticeList_div');
			if(divQaList.length==0){
				main.callMenuPage(constant.menu.hash.notice);
			}
			else{
				sessionStorage.setItem("page",page);
				notice.search('/notice/list.action', 'noticeList_div', 'noticeSearchForm', page, 10);
			}
		})(jQuery);
	},
	
	/**
	 * 공지사항 상세 페이지 이동
	 */
	goDetail : function(noticeId) {
		(function($) {
			var sendForm = {
				'noticeId': noticeId
			};
			$.ajax({
				type : 'post',
				url : '/notice/goDetail.action',
				dataType : 'html',
				data : sendForm,
				success : function(data) {
					$("#divContent").html(data);
				}
			});
		})(jQuery);
	},
	
	downloadFile : function (fileId) {
		(function($) {
			var frm = $('<form name="downloadForm"></form>');
			frm.attr('action', '/notice/downloadFile.action');
			frm.attr('method', 'post');
			frm.attr('target', 'downloadFrame');
			frm.appendTo('body');
			frm.append($("<input type='hidden' id='fileId' name='fileId' value=" + fileId + " >"))
			frm.submit();
		})(jQuery);
	}

};