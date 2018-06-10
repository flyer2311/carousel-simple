/**
 *
 * @authors flyer2311
 * @date    2018-06-06 02:18:34
 * @version v1.0
 */
/*
 主要函数为carousel(obj),obj是主要显示窗口
*/
function carousel(obj) {
    var content=document.getElementById(obj);
    //给主视口相对定位
    content.style.position='relative';
    content.style.overflow = 'hidden';
    var ct_ww=parseFloat(getstyle(content,'width'));
    //获取ul兼容写法,复制ul节点
    var mainframe=getfirstsubelement(content);
    mainframe.className='carousel-clearfix carousel-ul'
    //获取li数量兼容写法
    var li_num=mainframe.children.length;
    //把第一个li和最后一个li的复制分别放在最后一个和第一个上
    var li_first=getfirstsubelement(mainframe);
    var clone_first=li_first.cloneNode(true);
    var li_last=mainframe.lastElementChild?mainframe.lastElementChild:mainframe.lastChild;
    var clone_last=li_last.cloneNode(true);
    //左右按钮创建
    var left_click=document.createElement('div');
    var right_click=document.createElement('div');
    //左右按钮添加css样式
    left_click.className='carousel-left-click';
    right_click.className='carousel-right-click';
    //按钮共用参数
    var onoff=true;
    var num=0;
    var num_last=0;
    var carousel_onoff=true;
    //轮播下面的点跳转按钮
    var ul_dot=document.createElement('ul');
    for(var j=li_num-1;j>=0;j--){
        var li_dot=document.createElement('li');
        li_dot.className='carousel-li-dot';
        li_dot.index=li_num-1-j;
        ul_dot.appendChild(li_dot);
    }
    ul_dot.className='carousel-ul-dot';
    ul_dot.children[num].className='carousel-li-dot carousel-li-dot-active';
    //左右按钮,clone_ul,dot_ul载入dom树
    var docfrag=document.createDocumentFragment();
    mainframe.appendChild(clone_first);
    mainframe.insertBefore(clone_last,li_first);
    var clone_ul=mainframe.cloneNode(true);
    clone_ul.style.width=(li_num+2)*ct_ww+'px';
    clone_ul.style.left=-ct_ww+'px';
    var li=clone_ul.getElementsByTagName('li');
    for(var i=li.length-1;i>=0;i--){
        li[i].style.width=ct_ww+'px';
        li[i].className='carousel-li';
    }
    docfrag.appendChild(clone_ul);
    docfrag.appendChild(left_click);
    docfrag.appendChild(right_click);
    docfrag.appendChild(ul_dot);
    mainframe.parentNode.removeChild(mainframe);
    content.appendChild(docfrag);
    //给左右按钮和点按钮添加事件
    addEvent(left_click,'click',leftclick.bind(this,clone_ul),false);
    addEvent(right_click,'click',rightclick.bind(this,clone_ul),false);
    addEvent(ul_dot,'click',deputeli.bind(this,clone_ul),false);
    addEvent(clone_ul,'mouseenter',mouseenter,false);
    addEvent(clone_ul,'mouseleave',mouseleave,false);
    addEvent(left_click,'mouseenter',mouseenter,false);
    addEvent(left_click,'mouseleave',mouseleave,false);
    addEvent(right_click,'mouseenter',mouseenter,false);
    addEvent(right_click,'mouseleave',mouseleave,false);
    addEvent(ul_dot,'mouseenter',mouseenter,false);
    addEvent(ul_dot,'mouseleave',mouseleave,false);
    //自动右轮播
    function carousel_settimeout(obj) {
        if(carousel_onoff){
            rightclick(obj);
        }
        setTimeout(carousel_settimeout.bind(this,obj), 2000);
    }
    carousel_settimeout(clone_ul);
    //左点击事件
    function leftclick(obj) {
        if(!onoff){
            return;
        }
        onoff=false;
        //计算动态路程
        num--;
        var move=-(num+1)*ct_ww;
        animation_jsonAcceleration(obj,{'left':move},1,function() {
            if(num==-1){
                num+=li_num;
                obj.style.left=-(num+1)*ct_ww+'px';
            }
            onoff=true;
        });
        ul_dot.children[num_last<=-1?num_last+li_num:num_last].className='carousel-li-dot';
        ul_dot.children[num<=-1?num+li_num:num].className='carousel-li-dot carousel-li-dot-active';
        num_last=num;
    }
    //右点击事件
    function rightclick(obj) {
        if(!onoff){
            return;
        }
        onoff=false;
        //计算动态路程
        num++;
        var move=-(num+1)*ct_ww;
        animation_jsonAcceleration(obj,{'left':move},1,function() {
            if(num==li_num){
                num-=li_num;
                obj.style.left=-(num+1)*ct_ww+'px';
            }
            onoff=true;
        });
        ul_dot.children[num_last>=li_num?num_last-li_num:num_last].className='carousel-li-dot';
        ul_dot.children[num>=li_num?num-li_num:num].className='carousel-li-dot carousel-li-dot-active';
        num_last=num;

    }
    //ul-dot委托事件
    function deputeli(obj,e) {
        var event=e||window.event;
        var et=event.target||event.srcElement;
        if(et.nodeName.toLowerCase()=='li'){
            dotclick(et.index,obj);
        }
    }
    //li-dot点击事件
    function dotclick(dotnum,obj) {
        if(!onoff){
            return;
        }
        onoff=false;
        num=dotnum;
        if(num_last==li_num){
            num_last-=li_num;
        }
        if(num_last==-1){
            num_last+=li_num;
        }
        ul_dot.children[num_last].className='carousel-li-dot';
        ul_dot.children[num].className='carousel-li-dot carousel-li-dot-active';
        var move=-(num+1)*ct_ww;
        animation_jsonAcceleration(obj,{'left':move},1,function() {
            if(num==li_num){
                num=num-li_num;
                obj.style.left=-(num+1)*ct_ww+'px';
            }
            onoff=true;
        });
        num_last=num;
    }
    //鼠标mouseenter事件
    function mouseenter() {
        carousel_onoff=false;
    }
    //鼠标mouseleave事件
    function mouseleave() {
        carousel_onoff=true;
    }
}


//获取第一个子元素节点
function getfirstsubelement(obj) {
    return obj.firstElementChild?obj.firstElementChild:obj.firstChild;
}
//注册事件
function addEvent(obj,type,fn,boolean) {
    boolean=boolean||false;
    obj[type+fn.name+boolean]=handlefunc;//把handlefunc变为obj的属性
    if(obj.addEventListener){
        obj.addEventListener(type,obj[type+fn.name+boolean],boolean);//注册事件  chrome firefox
        if(type=='mousewheel'){
            obj.addEventListener('DOMMouseScroll',obj[type+fn.name+boolean],boolean)// 注册事件 firefox
        }
    }else{
        obj.attachEvent('on'+type,obj[type+fn.name+boolean]);//注册事件 兼容ie
    }

    function handlefunc(e) {
        var ev=e||window.event;//参数e  兼容ie
        ev.target=ev.target||ev.srcElement//兼容委托事件
        ev.wheel=ev.wheelDelta?ev.wheelDelta:ev.detail*-40;//兼容滚轮参数
        fn.call(obj,ev);//兼容ie this指向和传参e
        ev.preventDefault?ev.preventDefault():ev.returnValue=false;//阻止默认事件 兼容
    }
}
//移除事件
function removeEvent(obj,type,fn,boolean) {
    boolean=boolean||false;
    if(obj.removeEventListener){
        obj.removeEventListener(type,obj[type+fn.name+boolean],boolean);
        if(type=='mousewheel'){
            obj.removeEventListener('DOMMouseScroll',obj[type+fn.name+boolean],boolean);
        }
    }else{
        obj.detachEvent('on'+type,obj[type+fn.name+boolean]);
    }
}
//运动函数
function animation_jsonAcceleration(obj,json,time,callback){
    var a={},b={},target={},acceleration={};
    for(var attr in json){
        b[attr]=a[attr]=parseFloat(getstyle(obj,attr));
        target[attr]=parseFloat(json[attr]);
        acceleration[attr]=2*Math.abs(target[attr]-a[attr])/Math.pow(time,2);
        acceleration[attr]=target[attr]>a[attr]?acceleration[attr]:-acceleration[attr];
    }
    var time_last=new Date();
    function fn(){
        var time_now=new Date();
        var time_difference=(time_now-time_last)/1000;
        time_difference=time_difference>=time?time:time_difference;
        for(var attr in json){
            a[attr]=b[attr]+0.5*acceleration[attr]*Math.pow(time_difference,2);
            if(attr=='opacity'){
                obj.style[attr]=a[attr];
                obj.style.filter='alpha(opacity:'+a[attr]*100+')';
            }else{
                obj.style[attr]=a[attr]+'px';
            }
        }
        if(a[attr]==target[attr]){
            callback&&callback();
        }else{
            requestAnimationFrame(fn);
        }
    }
    fn();
}
//获取dom的css
function getstyle(obj,attr) {
    return !window.getComputedStyle?obj.currentStyle[attr]:window.getComputedStyle(obj)[attr];
}
