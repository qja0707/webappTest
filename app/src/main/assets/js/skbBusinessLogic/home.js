var home = {

	//공지 및 QA 상세 정보로 이동
	detailInfo: function detailInfo(actionUrl, key){
		(function( $ ) {
			var sendForm = {'key':key};
			$.ajax({ type: 'post' , url: actionUrl , dataType : 'html' , data: sendForm, success: function(data) { $("#divContent").html(data); } }); 
		})( jQuery );
  	},
  	
};