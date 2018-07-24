//상수 정의
var constant = {};

constant.config = {};
constant.config.consoleLogShow = false;	//콘솔 로그 표출 여부 (true:표출)


constant.common = {};
constant.common.loadingTypeGS = 'Gaspare Sganga Plugin';
constant.common.loadingTypeDiv = 'Simple div';


//메뉴 상수
constant.menu = {};
constant.menu.action = {};
constant.menu.action.home = '/home.action';
constant.menu.action.notice = '/notice.action';
constant.menu.action.qa = '/qa.action';
constant.menu.action.fileIO = '/file.action';
constant.menu.action.recovery = '/recovery.action';
constant.menu.action.help = '/help.action';
constant.menu.action.userInfo = '/userInfo.action';	
constant.menu.action.installFiledownload = '/installFiledownload.action';	

constant.menu.hash = {};
constant.menu.hash.home = 'home';
constant.menu.hash.notice = 'notice';
constant.menu.hash.qa = 'qa';
constant.menu.hash.fileIO = 'file';
constant.menu.hash.recovery = 'recovery';
constant.menu.hash.help = 'help';
constant.menu.hash.userInfo = 'user';
constant.menu.hash.installFiledownload = 'install';


//사용자 정보 상수
constant.user = {};
constant.user.defaultLimitTime = 60 * 3;	//기본 인증번호 입력 시간 : 3분
constant.user.changeType = {};
constant.user.changeType.email = 'email';
constant.user.changeType.phone = 'phone';
constant.user.changeType.pwd = 'password';
constant.user.authNumberSendTarget = {};
constant.user.authNumberSendTarget.email = 'EMAIL';
constant.user.authNumberSendTarget.sms = 'SMS';


//공지사항 상수
constant.notice = {};
constant.notice.hash = {};
constant.notice.hash.list = 'notice/list';
constant.notice.hash.info = 'notice/info';


//QA 상수
constant.qa = {};
constant.qa.hash = {};
constant.qa.hash.list = 'qa/list';
constant.qa.hash.info = 'qa/info';
constant.qa.hash.insert = 'qa/insert';


//파일 입출력 상수
constant.fileIO = {};
constant.fileIO.hash = {};
constant.fileIO.hash.inList = 'fin/list';		//반입
constant.fileIO.hash.outList = 'fout/list';	//반출
constant.fileIO.hash.inTab = 'fin/tab';		//반입
constant.fileIO.hash.outTab = 'fout/tab';	//반출

//오류복구 상수
constant.recovery = {};
constant.recovery.callCycle = 1000;		//호출 주기 1000 : 1초


//화면 연계 상수(접속 클라이언트)
constant.linkpage = {};
constant.linkpage.home = 'home';
constant.linkpage.qa = 'qa';
constant.linkpage.notice = 'noti';
constant.linkpage.user = 'user';

//파일첨부 허용확장자
constant.file = {};
constant.file.allow = {};
constant.file.allow.ext = ["jpg", "png", "gif","jpeg","bmp","avi","mp4","mkv","wmv"]
