/**
 * Created by Administrator on 2016/12/30 0030.
 */
var ClickNum={
    pre:0,
    next:0
}
var DateLimit={yes:0,no:-1}
var Calendar = {
    limit:DateLimit.yes,
    out:["离店"],
    into:["入店"],
    dateObj :new Date(),
    init : function (num,i){
        Calendar["dateObj"+i]= new Date();
        var str=""
        str+='<div id='+"title_"+i+' class="MyCalendar_title">' +
            '<div id='+"prevmonth_"+i+' class="MyCalendar_prevmonth">前</div>' +
            '<div id='+"year_"+i+' class="MyCalendar_year">'+this.dateObj.getFullYear()+'年</div>' +
            '<div id='+"month_"+i+' class="MyCalendar_month">'+toyear(this.dateObj)+'月</div>' +
            '<div id='+"day_"+i+' class="MyCalendar_day">'+todata(this.dateObj)+'日</div>' +
            '<div id='+"nextmonth_"+i+'  class="MyCalendar_nextmonth">后</div>' +
            '</div>';
        str+='<div id='+"week"+i+' class="MyCalendar_week">' +
            '<div>日</div>' +
            '<div>一</div>' +
            '<div>二</div>' +
            '<div>三</div>' +
            '<div>四</div>' +
            '<div>五</div>' +
            '<div>六</div>' +
            '</div>';
        str+='<div id='+"con"+i+' class="clearfix con"></div>';
        str+='<div >' +
            '<div id="nowtime">确认</div>' +
            '<div id="cleartime">取消-重新选择</div>' +
            '</div>';
        num.innerHTML=str;

    },
    initcon: function(oneweek,alld,nowd,num){
        for(var i=1;i<=oneweek;i++){//留空

            var eday=document.createElement("div");
            eday.innerHTML="<span  style='line-height: 40px'>不可点</span>";
            eday.className="edate_click";
            $("#con"+num).append(eday);
        };
        for(var i=1;i<=alld;i++){
            var eday=document.createElement("div");
            if(i==nowd){
                eday.innerHTML=i;
                eday.className="now edate";
                $("#con"+num).append(eday);
            }
            else if(i>nowd){
                eday.innerHTML=i;
                eday.className="edate";
                $("#con"+num).append(eday);//正常区域
            }else if(i<nowd){
                if(parseInt(toyear(Calendar.dateObj)) == parseInt($("#month_"+num).html()) && Calendar.dateObj.getFullYear()== parseInt($("#year_"+num).html())  ){
                    eday.innerHTML="<p>"+i+"</p>"+"<span class='btn_click'>不可点</span>";
                    eday.className="edate_click";
                    $("#con"+num).append(eday);//正常区域

                }else {
                    eday.innerHTML=i;
                    eday.className="edate";
                    $("#con"+num).append(eday);//正常区域
                }
            };
        };
        /* 保留入店信息的背景样式和文字*/
        CalendarSaveDate(oneweek,num)

    },
    preinitcon: function(oneweek,alld,nowd,num){
        for(var i=1;i<=oneweek;i++){//留空

            var eday=document.createElement("div");
            eday.innerHTML="<span  style='line-height: 40px'>不可点</span>";
            eday.className="edate_click";
            $("#con"+num).append(eday);
        };
        for(var i=1;i<=alld;i++){
            var eday=document.createElement("div");

            eday.innerHTML="<p>"+i+"</p>"+"<span class='btn_click'>不可点</span>";
            eday.className="edate_click";
            $("#con"+num).append(eday);//正常区域

        };
        /* 保留入店信息的背景样式和文字*/
        CalendarSaveDate(oneweek,num)


    },
    prevmonth : function(num){
        var ddm=null;
        var ddy=null;
        if((Calendar["dateObj"+num].getMonth()-1)==-1){
            ddm=11;
            ddy=Calendar["dateObj"+num].getFullYear()-1;
        }else{
            ddm=Calendar["dateObj"+num].getMonth()-1;
            ddy=Calendar["dateObj"+num].getFullYear();
        };
        Calendar["dateObj"+num].setFullYear(ddy);/*重置年份*/
        Calendar["dateObj"+num].setMonth(ddm);/*重置月份*/
        $("#month_"+num).html(toyear(Calendar["dateObj"+num])+"月");/*0是1月的月份转换函数*/
        $("#year_"+num).html(Calendar["dateObj"+num].getFullYear()+"年");
        $("#con"+num).html("")/*con.innerHTML="";把content清空*/
        if(ClickNum.next<0){
            console.log(ClickNum.next)
            Calendar.preinitcon(oneyearoneday(Calendar["dateObj"+num]),alldays(Calendar["dateObj"+num]),nowday(Calendar["dateObj"+num]),num);/*重新初始化content*/

        }else {
            Calendar.initcon(oneyearoneday(Calendar["dateObj"+num]),alldays(Calendar["dateObj"+num]),nowday(Calendar["dateObj"+num]),num);/*重新初始化content*/
        }
    },
    nextmonth : function(num){
        var ddm=null;
        var ddy=null;
        if((Calendar["dateObj"+num].getMonth()+1)==12){
            ddm=0;
            ddy=Calendar["dateObj"+num].getFullYear()+1;
        }else{
            ddm=Calendar["dateObj"+num].getMonth()+1;
            ddy=Calendar["dateObj"+num].getFullYear();
        };
        Calendar["dateObj"+num].setFullYear(ddy);
        Calendar["dateObj"+num].setMonth(ddm);
        $("#month_"+num).html(toyear(Calendar["dateObj"+num])+"月");/*0是1月的月份转换函数*/
        $("#year_"+num).html(Calendar["dateObj"+num].getFullYear()+"年");
        $("#con"+num).html("")/*con.innerHTML="";把content清空*/
        if(ClickNum.pre>0){
            Calendar.preinitcon(oneyearoneday(Calendar["dateObj"+num]),alldays(Calendar["dateObj"+num]),nowday(Calendar["dateObj"+num]),num);/*重新初始化content*/

        }else {
            Calendar.initcon(oneyearoneday(Calendar["dateObj"+num]),alldays(Calendar["dateObj"+num]),nowday(Calendar["dateObj"+num]),num);/*重新初始化content*/
        }
    },
    prevyear : function(num){
        var ddy=Calendar["dateObj"+num].getFullYear()-1;
        Calendar["dateObj"+num].setFullYear(ddy);
        $("#year_"+num).html(Calendar["dateObj"+num].getFullYear()+"年");
        $("#con"+num).html("")/*con.innerHTML="";把content清空*/
        Calendar.initcon(oneyearoneday(Calendar["dateObj"+num]),alldays(Calendar["dateObj"+num]),nowday(Calendar["dateObj"+num]),num);/*重新初始化content*/
    },
    nextyear: function(num){
        var ddy=Calendar["dateObj"+num].getFullYear()+1;
        Calendar["dateObj"+num].setFullYear(ddy);
        $("#year_"+num).html(Calendar["dateObj"+num].getFullYear()+"年");
        $("#con"+num).html("")/*con.innerHTML="";把content清空*/
        Calendar.initcon(oneyearoneday(Calendar["dateObj"+num]),alldays(Calendar["dateObj"+num]),nowday(Calendar["dateObj"+num]),num);/*重新初始化content*/
    }
};

var gold = {
    init : function (){
        var oneweek=oneyearoneday(Calendar.dateObj);
        //本月总日数
        var alld=alldays(Calendar.dateObj);
        //当前是几号
        var nowd=nowday(Calendar.dateObj);
        var box_num = document.getElementsByClassName("MyCalendar");
        for(var i = 0 ; i < box_num.length ;i++){
            box_num[i].id="MyCalendar_"+i;
            Calendar.init(box_num[i],i);
            Calendar.initcon(oneweek,alld,nowd,i);
        }
    }
}
gold.init();
//===================show date===============================

$(".con").click(function(event){
   // event = event.touches[0]/*获取到taget那个div*/
    var num = this.id.charAt(this.id.toString().length-1);
    if(event.target.tagName=="DIV" && event.target.nodeType=="1" && hasclass(event.target.className,"edate")){
        $("#day_"+num).html(event.target.innerHTML+"日");
    };
})
$(".MyCalendar_prevmonth").click(function(){
    var num = this.id.charAt(this.id.toString().length-1);
    ClickNum.pre+=1;
    ClickNum.next-=1;
    Calendar.prevmonth(num);
});
$(".MyCalendar_nextmonth").click(function(){
    var num = this.id.charAt(this.id.toString().length-1);
    ClickNum.pre-=1;
    ClickNum.next+=1;
    Calendar.nextmonth(num);
});

/*弹出日期*/
$(".con").click(function(event){
    //event = event.touches[0]/*获取到taget那个div*/
    var num = this.id.charAt(this.id.toString().length-1);
    var date=todataTwo(parseInt($("#day_"+num).html()))+"日"
    // alert($("#year_"+num).html()+$("#month_"+num).html()+date)
    $("#day_"+num).html(date)
    if(Calendar.out.name != undefined){
        alert("如想重新录入住店信息请点击：取消按钮")
        $("#day_"+num).html(Calendar.dateObj.getDate()+"日")
    }
    if(event.target.tagName=="DIV" && event.target.nodeType=="1" && hasclass(event.target.className,"edate")){
        if(Calendar.into.length<2){
            console.log(event.target.innerHTML)
            event.target.innerHTML="<p>"+event.target.innerHTML+"</p>"+"<span class='btn_click'>"+Calendar.into[0]+"</span>";
            event.target.className="edate_click intoedate";
            Calendar.into={
                name:["入店"],
                year:parseInt($("#year_"+num).html()),
                month:parseInt($("#month_"+num).html()),
                date:parseInt(date),
                all:$("#year_"+num).html()+$("#month_"+num).html()+date
            }
            console.log(Calendar.into)
        }else if(Calendar.out.length<2){
            var year=parseInt($("#year_"+num).html())
            var month=parseInt($("#month_"+num).html())
            var date=parseInt(date)
            isPreDate(year,month,date,num)
        }
    };

})
$("#cleartime").click(function(event){
    window.location.reload();//刷新当前页面.
    var touchpros =event.touches[0];

    console.log(touchpros);
    console.log(touchpros.target.innerHTML);

});
$("#nowtime").click(function(){
    if(Calendar.into.length<2){
        alert("请选择入店日期")
    }else {
        if(Calendar.out.length< 2){
            alert("请选择离店日期")
        }else {
            alert( Calendar.into.all+" 到 "+Calendar.out.all)
        }
    }
})


/*你可以绑定以下四种Touch事件来了解基本的touch事件:

 touchstart:手指触摸屏幕上的时候触发

 touchmove:手指在屏幕上移动的时候触发

 touchend:手指从屏幕上拿起的时候触发

 touchcancel:系统取消touch事件的时候触发*/

//===================function===============================
//有无指定类名的判断
function hasclass(str,cla){
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
//获取本月总日数方法
function alldays(dateObj){
    var year=dateObj.getFullYear();
    var month=dateObj.getMonth();
    if(isLeapYear(year)){//闰年
        switch(month) {
            case 0: return "31"; break;
            case 1: return "29"; break; //2月
            case 2: return "31"; break;
            case 3: return "30"; break;
            case 4: return "31"; break;
            case 5: return "30"; break;
            case 6: return "31"; break;
            case 7: return "31"; break;
            case 8: return "30"; break;
            case 9: return "31"; break;
            case 10: return "30"; break;
            case 11: return "31"; break;
            default:
        };
    }else{//平年
        switch(month) {
            case 0: return "31"; break;
            case 1: return "28"; break; //2月
            case 2: return "31"; break;
            case 3: return "30"; break;
            case 4: return "31"; break;
            case 5: return "30"; break;
            case 6: return "31"; break;
            case 7: return "31"; break;
            case 8: return "30"; break;
            case 9: return "31"; break;
            case 10: return "30"; break;
            case 11: return "31"; break;
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
    var month=dateObj.getMonth()
    switch(month) {
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
    var date=dateObj.getDate();
    if(date < 10){
        switch(date) {
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
        return date;
    }


}
function todataTwo(html){
    if(html < 10){
        switch(html) {
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
        return html;
    }
}
/*判断离店日期是否合理*/
function isPreDate(year,month,date,num){
    if(year <= Calendar.into.year && month < Calendar.into.month){
        console.log(year+"b"+month+"a"+date)
        alert("离店日期必须比入店日期晚")

    }else {
        if(month == Calendar.into.month && date <=Calendar.into.date){
            console.log(year+"b"+month+"a"+date)
            alert("离店日期必须比入店日期晚")
        }else{
            if(Calendar.limit == DateLimit.yes){
                if(year > Calendar.into.year || parseInt(month-2)> Calendar.into.month){
                    alert("选取的时间范围不可以超过60天")
                }
                /*首先计算出入店月份的总天数减去入店日，是剩余入店月份的天数*/
                if(year<=Calendar.into.year && month == Calendar.into.month){
                    var alldate=date-Calendar.into.date;
                    if(alldate > 60){
                        alert("选取的时间范围不可以超过60天")
                    }else {
                        event.target.innerHTML="<p>"+event.target.innerHTML+"</p>"+"<span class='btn_click'>"+Calendar.out[0]+"</span>";
                        event.target.className="edate_click intoedate";
                        CalendarSetOut(date,num,alldate)/*离店对象的各种属性*/
                        //alert(Calendar.into.all+"到"+Calendar.out.all+" 住店总天数："+alldate)
                    }
                }
                if(year<=Calendar.into.year && parseInt(month-1)== Calendar.into.month){
                    console.log(parseInt(month+1))
                    var alldate=isAllDate(Calendar.into.year,Calendar.into.month)-Calendar.into.date;
                    alldate+=date;
                    if(alldate > 60){
                        alert("选取的时间范围不可以超过60天")
                    }else {
                        event.target.innerHTML="<p>"+event.target.innerHTML+"</p>"+"<span class='btn_click'>"+Calendar.out[0]+"</span>";
                        event.target.className="edate_click intoedate";
                        CalendarSetOut(date,num,alldate)/*离店对象的各种属性*/
                        //alert(Calendar.into.all+"到"+Calendar.out.all+" 住店总天数："+alldate)
                    }
                }
                if(year<=Calendar.into.year && parseInt(month-2)== Calendar.into.month){
                    var alldate=isAllDate(Calendar.into.year,Calendar.into.month)-Calendar.into.date;/*住店月份天数*/
                    alldate+=isAllDate(Calendar.into.year,parseInt(Calendar.into.month+1))/*住店后一个月总天数*/
                    alldate+=date;/*离店那个月的天数*/
                    if(alldate > 60){
                        alert("选取的时间范围不可以超过60天")
                    }else {
                        event.target.innerHTML="<p>"+event.target.innerHTML+"</p>"+"<span class='btn_click'>"+Calendar.out[0]+"</span>";
                        event.target.className="edate_click intoedate";
                        CalendarSetOut(date,num,alldate)/*离店对象的各种属性*/
                    }
                }
            }else if(Calendar.limit == DateLimit.no){
                event.target.innerHTML="<p>"+event.target.innerHTML+"</p>"+"<span class='btn_click'>"+Calendar.out[0]+"</span>";
                event.target.className="edate_click intoedate";
                CalendarSetOut(date,num,alldate)/*离店对象的各种属性*/
            }
        }

    }



}
function isAllDate(year,month){
    if(isLeapYear(year)){//闰年
        switch(month) {
            case 1: return 31; break;
            case 2: return 29; break; //2月
            case 3: return 31; break;
            case 4: return 30; break;
            case 5: return 31; break;
            case 6: return 30; break;
            case 7: return 31; break;
            case 8: return 31; break;
            case 9: return 30; break;
            case 10: return 31; break;
            case 11: return 30; break;
            case 12: return 31; break;
            default:
        };
    }else{//平年
        switch(month) {
            case 1: return 31; break;
            case 2: return 28; break; //2月
            case 3: return 31; break;
            case 4: return 30; break;
            case 5: return 31; break;
            case 6: return 30; break;
            case 7: return 31; break;
            case 8: return 31; break;
            case 9: return 30; break;
            case 10: return 31; break;
            case 11: return 30; break;
            case 12: return 31; break;
            default:
        };
    };

}
/*给日历设置离店对象的各种属性*/
function CalendarSetOut(date,num,alldate){
    Calendar.out={
        name:["离店"],
        year:parseInt($("#year_"+num).html()),
        month:parseInt($("#month_"+num).html()),
        date:parseInt(date),
        all:$("#year_"+num).html()+$("#month_"+num).html()+date+"日"
    }
    Calendar.alldate=alldate

}
/*还原已经标记的入店和离店样式*/
function  CalendarSaveDate(oneweek,num){
    if(Calendar.into.name != undefined && parseInt($("#month_"+num).html()) == Calendar.into.month &&  parseInt($("#year_"+num).html()) == Calendar.into.year ){
        $(".con div").eq(Calendar.into.date-1+oneweek).html("<p>"+Calendar.into.date+"</p>"+"<span class='btn_click'>"+Calendar.into.name+"</span>").removeClass().addClass("intoedate edate_click")
    }
    /*保留离店信息的背景样式和文字*/
    if(Calendar.out.name != undefined && parseInt($("#month_"+num).html()) == Calendar.out.month &&  parseInt($("#year_"+num).html()) == Calendar.out.year){
        $(".con div").eq(Calendar.out.date-1+oneweek).html("<p>"+Calendar.out.date+"</p>"+"<span class='btn_click'>"+Calendar.out.name+"</span>").removeClass().addClass("intoedate edate_click")
    }

}
