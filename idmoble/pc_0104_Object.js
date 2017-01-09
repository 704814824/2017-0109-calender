/*
 * calendarUI
 * Date: 2017-01-06
 * 使用calendarUI可以方便地生成日历。先提供的功能有标记入店以及离店时间
 * $(".MyCalendar").DateLimit()在外面js文件中调用此方法即可取消页面中所有日历60天的限制
 * $("#MyCalendar_XX").DateLimit()在外面js文件中调用此方法即可取消指定ID(#MyCalendar_XX)的日历的60天的限制
 */
; (function ($, window, document, undefined) {
var Message={
    INTO:["入店"], OUT:["离店"]
};

var CalendarDayColRow={
    ALL:7*6
};

var DateLimit={
    YES:0, NO:-1
};

var iconDivDomEums = {
    EMPTY:"<span class='btn_click' >不可点</span>",/*上个月留空*/
    NOCLICK:"<span class='btn_click'>不可点</span>",/*本月已过的日子不可点*/
    NORMAL:"",/*正常*/
    MORE:"<span class='btn_click'>不可点</span>",/*多余出来显示的下个月的日子*/
};


var AlertMessage = {
    Plaseinto : "请选择入店时间",
    Plaseout : "请选择离店时间",
    Plasecancel:"如想重新录入住店信息请点击：取消按钮",
    PlaseError: "离店日期必须比入店日期晚",
    LimitDay : "选取的时间范围不可以超过六十天"

}

    var Calendar = {
        publicDateObj :new Date(),
        init: function (i){
            function CalendarID(i){
                var privateDate =new Date();
                var CalendarID = i ;
                this.privateLimit = DateLimit.YES;
                this.privateHeader = {
                    prevmonth:function(){
                        var ddm=null;
                        var ddy=null;
                        if((privateDate.getMonth()-1)==-1){
                            ddm=11;
                            ddy=privateDate.getFullYear()-1;
                        }else{
                            ddm=privateDate.getMonth()-1;
                            ddy=privateDate.getFullYear();
                        };
                        privateDate.setFullYear(ddy);/*重置年份*/
                        privateDate.setMonth(ddm);/*重置月份*/
                        /*实例化pre后的页面*/
                        Calendar["Calendar_"+CalendarID].initcon();/*con.innerHTML="";把content清空*/
                        $("#month_"+CalendarID).html(toyear(privateDate.getMonth())+"月");/*0是1月的月份转换函数*/
                        $("#year_"+CalendarID).html(privateDate.getFullYear()+"年");
                        /*记录入店以及离店信息后，保留数据*/
                        /*当存在入店信息几DivNum值时，那个值得div的CLASS和html发生变化*/

                    },
                    nextmonth:function(){
                        var ddm=null;
                        var ddy=null;
                        if((privateDate.getMonth()+1)==12){
                            ddm=0;
                            ddy=privateDate.getFullYear()+1;
                        }else{
                            ddm=privateDate.getMonth()+1;
                            ddy=privateDate.getFullYear();
                        };
                        privateDate.setFullYear(ddy);/*重置年份*/
                        privateDate.setMonth(ddm);/*重置月份*/
                        /*实例化pre后的页面*/
                        Calendar["Calendar_"+CalendarID].initcon();/*con.innerHTML="";把content清空*/
                        $("#month_"+CalendarID).html(toyear(privateDate.getMonth())+"月");/*0是1月的月份转换函数*/
                        $("#year_"+CalendarID).html(privateDate.getFullYear()+"年");
                        /*记录入店以及离店信息后，保留数据*/
                    }
                };
                this.privateOut =  {
                    outDate : new Date(),
                    overDate: function (even){
                        if(this.DivNum == undefined ){
                            this.outDate.setDate(even.innerHTML);/*更改日*/
                            this.outDate.setFullYear(privateDate.getFullYear());/*更改年*/
                            this.outDate.setMonth(privateDate.getMonth());/*更改月*/
                            var dateCu=this.outDate.getTime()-Calendar["Calendar_"+ CalendarID].privateInto.intoDate.getTime(); //时间差的毫秒数
                            this.day = Math.round(dateCu/(24*3600*1000));
                            /*做60天限制判断*/
                            if(this.day > 0 && (this.day < 60 || Calendar["Calendar_"+ CalendarID].privateLimit == DateLimit.NO) ){
                                /*调用函数进行一系列属性赋值*/
                                this.setDivNum(even);

                            }else {
                                this.day < 0  ?  alert(AlertMessage.PlaseError) : alert(AlertMessage.LimitDay)

                            }

                        }else {
                            alert(AlertMessage.Plasecancel);
                        }
                    },
                    setDivNum:function(even){
                        if( this.DivNum != undefined){
                            alert(AlertMessage.Plasecancel);
                        }else{
                            this.DivNum=even.num;/*conobject所以DIV的index 0-41 */
                            this.allDay = this.outDate.getFullYear()+"年 " + toyear(this.outDate.getMonth())+"月 " + todata(this.outDate.getDate())+"日 ";
                            /*实例化页面的数据改变*/
                            $("#day_"+CalendarID).html(todata(this.outDate.getDate())+"日");
                            even.className="intoedate edate_click";
                            even.innerHTML=  "<p>" +even.innerHTML+"</p>"+"<span>"+Message.OUT+"</span>";

                        }
                    },
                    reSetDiv:function (){

                        delete this.DivNum;

                    }
                };
                this.privateInto = {
                    intoDate : new Date(),
                    overDate: function (even){
                        console.log(even)
                        this.DivNum= even.num;/*conobject所以DIV的index 0-41 */
                        this.intoDate.setDate( even.innerHTML);/*更改日*/
                        this.intoDate.setFullYear(privateDate.getFullYear());/*更改年*/
                        this.intoDate.setMonth(privateDate.getMonth());/*更改月*/
                        this.allDay = this.intoDate.getFullYear()+"年 " + toyear(this.intoDate.getMonth())+"月 " + todata(this.intoDate.getDate())+"日 ";
                        /*实例化*/
                        $("#day_"+CalendarID).html(todata(this.intoDate.getDate())+"日");
                        even.className="intoedate edate_click";
                        even.innerHTML=  "<p>" +even.innerHTML+"</p>"+"<span>"+Message.INTO+"</span>";
                    },
                    reSetDiv:function (){
                        delete this.DivNum;/*删除属性*/
                    }
                };
                this.initcon = function (){
                    var oneweek=oneyearoneday(privateDate); //今天星期几，星期日是0，星期一是1
                    var alld=alldays(privateDate);//这个月有多少天
                    var preAlld = preAllDays(privateDate.getFullYear(),privateDate.getMonth()-1);
                    var nowd=nowday(privateDate);/*今天是几号*/
                    var divObject = [];
                    $("#con"+CalendarID).html("");
                    /*第一部分空白区循环*/
                    for(var i = 0;i < oneweek; i++){
                        divObject[i] = new Object();
                        divObject[i].className="edate_click";
                        divObject[i].dom =  iconDivDomEums.NOCLICK;
                        divObject[i].html = preAlld-oneweek+i+1;
                        /*如果是本月之前的月时*/
                    }
                    /*第二部分本月日子循环*/
                    for(var i = oneweek;i < oneweek+alld; i++){
                        divObject[i] = new Object();
                        i ==  nowd-1+ this.oneweek ?  divObject[i].className="now edate":  divObject[i].className="edate";
                        divObject[i].dom =  iconDivDomEums.NORMAL;
                        divObject[i].html = i- oneweek+1;
                        /*当本月时要做的*/
                        if(Calendar.publicDateObj.getFullYear() == privateDate.getFullYear() && Calendar.publicDateObj.getMonth() == privateDate.getMonth()&& i < nowd-1 && i >= oneweek ){/*当公共的年与头部的年月相等时要做的把本月已经过的的日子的classname和dom和html换了*/
                            divObject[i].className="edate_click";
                            divObject[i].dom =  iconDivDomEums.NOCLICK;
                            divObject[i].html = i-oneweek+1;
                        }
                        /*如果是本月之前的月时：正常区域也要变为不可CLICK*/
                        if(Calendar.publicDateObj.getFullYear() > privateDate.getFullYear() || Calendar.publicDateObj.getMonth() > privateDate.getMonth()){/*当公共的年与头部的年月相等时要做的把本月已经过的的日子的classname和dom和html换了*/
                            divObject[i].className="edate_click";
                            divObject[i].dom = iconDivDomEums.NOCLICK;
                            divObject[i].html = i-oneweek+1;
                        }
                        /*当condate的数据的年月，与into里的date的年月数据相同时更新入店信息*/
                    }
                    /*第三部分下月日子循环*/
                    for(i = oneweek+alld ; i < CalendarDayColRow.ALL;i++){
                        divObject[i] = new Object();
                        divObject[i].className="edate_click";
                        divObject[i].dom = iconDivDomEums.NOCLICK;
                        divObject[i].html = i-alld-oneweek+1;
                    }
                    /*入店实例化*/
                    var numIndex = Calendar["Calendar_"+CalendarID].privateInto.DivNum;
                    if(numIndex){
                        if(privateDate.getFullYear() ==  Calendar["Calendar_"+CalendarID].privateInto.intoDate.getFullYear() && privateDate.getMonth() ==  Calendar["Calendar_"+CalendarID].privateInto.intoDate.getMonth()){
                            divObject[numIndex].className="intoedate edate_click";
                            divObject[numIndex].html=  "<p>" +divObject[numIndex].html+"</p>"+"<span>入店</span>";
                        }
                    }
                    /*离店实例化*/
                    var numIndexOut = Calendar["Calendar_"+CalendarID].privateOut.DivNum;
                    if(numIndexOut){
                        if(privateDate.getFullYear() ==  Calendar["Calendar_"+CalendarID].privateOut.outDate.getFullYear() && privateDate.getMonth() ==  Calendar["Calendar_"+CalendarID].privateOut.outDate.getMonth()){
                            divObject[numIndexOut].className="intoedate edate_click";
                            divObject[numIndexOut].html=  "<p>" +divObject[numIndexOut].html+"</p>"+"<span>离店</span>";
                        }
                    }
                    /*把对象映射到页面上*/
                    for(var i = 0;i < CalendarDayColRow.ALL; i++){
                        var eday=document.createElement("div");
                        divObject[i].html != "" && divObject[i].dom != "" ? divObject[i].dom= "<p>"+divObject[i].html+"</p>"+divObject[i].dom:divObject[i].dom=divObject[i].dom ;
                        eday.innerHTML= divObject[i].dom == "" ? divObject[i].html : divObject[i].dom;
                        eday.className=divObject[i].className;
                        eday.num = i;
                        $("#con"+CalendarID).append(eday);
                        /*把各个con的属性映射到DIV上*/
                    }
                };
                this.privateClearn = function (){
                    if(this.privateOut.DivNum != undefined ){
                        this.privateInto.reSetDiv();
                        this.privateOut.reSetDiv();
                    }
                    if(this.privateInto.DivNum != undefined && this.privateOut.DivNum == undefined){
                        this.privateInto.reSetDiv();
                    }
                    this.initcon();

                }
            }
            /*如果希望所有的对象使用同一个函数，最好实用原型法添加方法，这样比较节省内存*/
            CalendarID.prototype.privateInitHeader_Con = function (i){
                var privateDate =new Date();
                var CalendarID = i ;
                /*映射header*/
                var str="";
                str+='<div id='+"title_"+CalendarID+' class="MyCalendar_title">' +
                    '<div id='+"prevmonth_"+CalendarID+' class="MyCalendar_prevmonth">前</div>' +
                    '<div id='+"year_"+CalendarID+' class="MyCalendar_year">'+privateDate.getFullYear()+'年</div>' +
                    '<div id='+"month_"+CalendarID+' class="MyCalendar_month">'+toyear(privateDate.getMonth())+'月</div>' +
                    '<div id='+"day_"+CalendarID+' class="MyCalendar_day">'+todata(privateDate.getDate() )+'日</div>' +
                    '<div id='+"nextmonth_"+CalendarID+'  class="MyCalendar_nextmonth">后</div>' +
                    '</div>';
                str+='<div id='+"week"+CalendarID+' class="MyCalendar_week">' +
                    '<div>日</div>' +
                    '<div>一</div>' +
                    '<div>二</div>' +
                    '<div>三</div>' +
                    '<div>四</div>' +
                    '<div>五</div>' +
                    '<div>六</div>' +
                    '</div>';
                str+='<div id='+"con"+CalendarID+' class="clearfix con"></div>';
                str+='<div >' +
                    '<div id='+"nowtime"+CalendarID+' class="nowtime">确认</div>' +
                    '<div id='+"cleartime"+CalendarID+' class="cleartime">取消-重新选择</div>' +
                    '</div>';
                document.getElementById("MyCalendar_"+CalendarID).innerHTML = str;
                this.initcon();
                /*映射content*/

            };
            Calendar["Calendar_"+i] =new CalendarID(i);
            Calendar["Calendar_"+i].privateInitHeader_Con(i);
            console.log( Calendar["Calendar_"+i])
        }
    };

    var gold = {
        init : function (){
            var box_num = document.getElementsByClassName("MyCalendar");
            for(var i = 0 ; i < box_num.length ;i++){
                box_num[i].id="MyCalendar_"+i;
                Calendar.init(i);
            }
        }
    }

    gold.init();
//===================show date===============================

$(".con").bind("touchstart",function(event){
    event = event.touches[0];/*获取到taget那个div*/
    var num = this.id.charAt(this.id.toString().length-1);
    var CalendarNum = Calendar["Calendar_"+num];
    if(event.target.tagName=="DIV" && event.target.nodeType=="1" && hasclass(event.target.className,"edate")){

        CalendarNum.privateInto.DivNum != undefined ? CalendarNum.privateOut.overDate(event.target) : CalendarNum.privateInto.overDate(event.target);

    };
});
$(".MyCalendar_prevmonth").bind("touchstart",function(){
    var num = this.id.charAt(this.id.toString().length-1);
    Calendar["Calendar_"+num].privateHeader.prevmonth(num);
});
$(".MyCalendar_nextmonth").bind("touchstart",function(){
    var num = this.id.charAt(this.id.toString().length-1);
    Calendar["Calendar_"+num].privateHeader.nextmonth(num)
});
$(".cleartime").bind("touchstart",function(){
    var num = this.id.charAt(this.id.toString().length-1);
    Calendar["Calendar_"+num].privateClearn() ;
});
$(".nowtime").bind("touchstart",function(){
    var num = this.id.charAt(this.id.toString().length-1);
    if(Calendar["Calendar_"+num].privateInto.DivNum == undefined){
        alert(AlertMessage.Plaseinto)
    }else {
        ( Calendar["Calendar_"+num].privateOut.DivNum == undefined) ? alert(AlertMessage.Plaseout) :alert(Calendar["Calendar_"+num].privateInto.allDay+" 到 "+Calendar["Calendar_"+num].privateOut.allDay+"共入住："+Calendar["Calendar_"+num].privateOut.day+"天")
    }
});

//===================function===============================

function hasclass(str,cla){//有无指定类名的判断
    var i=str.search(cla);
    if(i==-1){
        return false;
    }else{
        return true;
    };
};
//获取本月1号的周值
function oneyearoneday(dateObj){
    var oneyear = new Date();
    var year=dateObj.getFullYear();/*获取年*/
    var month=dateObj.getMonth();//0是12月
    oneyear.setFullYear(year);
    oneyear.setMonth(month);//0是12月
    oneyear.setDate(1);//设置日期1号
    return oneyear.getDay();/*返回获取本月1号的周值*/
};
//当前是几号
function nowday(dateObj){
    return dateObj.getDate();
};
 /*获取上个月总天数用来填写本月前的日子*/
function  preAllDays(year,month){
    if(month <0){
        year = year -1;
        month = 11
    }/*当时一月的时候做的特殊处理*/
    if(isLeapYear(year)){//闰年
        switch(month) {
            case 0: return 31; break;
            case 1: return 29; break; //2月
            case 2: return 31; break;
            case 3: return 30; break;
            case 4: return 31; break;
            case 5: return 30; break;
            case 6: return 31; break;
            case 7: return 31; break;
            case 8: return 30; break;
            case 9: return 31; break;
            case 10: return 30; break;
            case 11: return 31; break;
            default:
        };
    }else{//平年
        switch(month) {
            case 0: return 31; break;
            case 1: return 28; break; //2月
            case 2: return 31; break;
            case 3: return 30; break;
            case 4: return 31; break;
            case 5: return 30; break;
            case 6: return 31; break;
            case 7: return 31; break;
            case 8: return 30; break;
            case 9: return 31; break;
            case 10: return 30; break;
            case 11: return 31; break;
            default:
        };
    };

}
//获取本月总日数方法
function alldays(dateObj){
    var year=dateObj.getFullYear();
    var month=dateObj.getMonth();
    if(isLeapYear(year)){//闰年
        switch(month) {
            case 0: return 31; break;
            case 1: return 29; break; //2月
            case 2: return 31; break;
            case 3: return 30; break;
            case 4: return 31; break;
            case 5: return 30; break;
            case 6: return 31; break;
            case 7: return 31; break;
            case 8: return 30; break;
            case 9: return 31; break;
            case 10: return 30; break;
            case 11: return 31; break;
            default:
        };
    }else{//平年
        switch(month) {
            case 0: return 31; break;
            case 1: return 28; break; //2月
            case 2: return 31; break;
            case 3: return 30; break;
            case 4: return 31; break;
            case 5: return 30; break;
            case 6: return 31; break;
            case 7: return 31; break;
            case 8: return 30; break;
            case 9: return 31; break;
            case 10: return 30; break;
            case 11: return 31; break;
            default:
        };
    };
};
//闰年判断函数
function isLeapYear(year){
    if( (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)){/*四年一闰；百年不闰,四百年再闰。*/
        return true;
    }else{
        return false;
    };
};
//月份转化方法
function toyear(dateObj){
    //var month=dateObj.getMonth()
    switch(dateObj) {
        case 0: return "01"; break;
        case 1: return "02"; break;
        case 2: return "03"; break;
        case 3: return "04"; break;
        case 4: return "05"; break;
        case 5: return "06"; break;
        case 6: return "07"; break;
        case 7: return "08"; break;
        case 8: return "09"; break;
        case 9: return "10"; break;
        case 10: return "11"; break;
        case 11: return "12"; break;
        default:
    };
};
/*日转化方法*/
function todata(dateObj){
    /*函数参数使用于数字和Date对象*/
    dateObj instanceof Date ?  dateObj = dateObj.getDate() : dateObj = dateObj;
    if(dateObj < 10){
        switch(dateObj) {
            case 1: return "01"; break;
            case 2: return "02"; break;
            case 3: return "03"; break;
            case 4: return "04"; break;
            case 5: return "05"; break;
            case 6: return "06"; break;
            case 7: return "07"; break;
            case 8: return "08"; break;
            case 9: return "09"; break;
            default:
        }
    }else {
        return dateObj;
    }
}

$.fn.DateLimit = function (){/*zepto插件添加接口*/

        // Calendar.limit= DateLimit.NO
        if(this.length > 1){/*当选择的是classname时*/
            for(var i = 0 ; i < this.length-1;i++){
                Calendar["Calendar_"+i].privateLimit = DateLimit.NO;
            }
        }else {/*当用id 选择时*/
            var num = this[0].id.charAt(this[0].id.toString().length-1);
            Calendar["Calendar_"+num].privateLimit = DateLimit.NO;
        }

    }/*对外接口*/

})(Zepto, window, document);