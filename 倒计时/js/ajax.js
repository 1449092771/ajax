/*
 * 支持的参数配置项
 *    url 
 *    method:'GET',
 *    data:'json',
 *    async:true,
 *    cache:true,
 *    success:null,
 *    error:null,
 *    headers:null,
 *    timeout:0
 */
~ function () {
	function ajax(options) {
		return new init(options);
	}
  /*==AJAX处理的核心== */
  let regGet=/^(GET|DELETE|HEAD|OPTIONS)$/i
  let defaults={ //=>请求的API
    url:'',
    method:'GET', //=>请求方式Get/Post/DELETE/PUT/HEAD/OPTIONS
    data:null,    //传递给服务器的信息，支持格式STRING和OBJECT,如果是对象OBJECT我们需要把其处理为x-www-form-urlencoded;GET请求是把信息作为问号参数传递给服务器，POST请求是放到请求主体中传递给服务器；
    dataType:'JSON', //=》把服务器返回结果处理成为对应的格式 JSON/NEXT/XML
    async:true,   //=》是否异步请求
    cache:true,   //=》只对GET请求有作用：设置为FALASH,在URL的末尾加随机数来清除缓存
    timeout:null, //超时时间
    headers:null, //设置请求头信息（请求头信息不能是中文，所以我们需要为其编码 ）
    success:null, //从服务器获取成功后扫行，把获取的结果。状态信息，XHR传递给它
    error:null    //获取失败后执行，把错误信息传递给它
  }
	function init(options={}) {
    //=>参数初始化，把传递的配置项替换默认的配置项
    this.options=Object.assign(defaults,options);
    this.xhr=null;
    this.send();
	}

	ajax.prototype = {
		constructor: ajax,
    version: 1.0,
    //发送ajax请求
    send(){
      let xhr=null,
      {url,method,async,data,cache,timeout,dataType,headers,success,error} = this.options;
      this.xhr=new XMLHttpRequest;
      //=>处理DATA,如果是GET请求把处理后的data放在url末尾传递给服务器
      data=this.handleData();
      if(data !==null && regGet.test(method)){
        url+=`${this.checkASK(url)}${data}`;
        data=null;
      }

      //=> 处理catch：如果是get并且catch是false需要清除缓存
      if(cache===false && regGet.test(method)){
        url+=`${this.checkASK(url)}_=${Math.random()}`;
      }

      xhr.open(method,url,async);
      //超时处理
      timeout!==null? xhr.timeout=timeout:null;
      if(Object.prototype.toString.call(headers)==="[object Object]"){
        for(let key in headers){
          if(!headers.hasOwnProperty(key)) break;
          xhr.setRequestHeader(key,encodeURIComponent(headers[key]));
        }
      };
      xhr.onreadystatechange=()=>{
        // let status=xhr.status,
        //     statusText=xhr.statusText,
        //     state=xhr.readyState;
        let{
          status,
          statusText,
          readyState:state,
          responseText,
          responseXML
        } = xhr;
        if(/^(2|3)\d{2}$/.test(status)){
          //成功
          if(state===4){
            success && success(responseText,statusText,xhr);
          }
          return;
        }
        typeof error==='function'?error(statusText,xhr): null;
      }
      xhr.send(data);
    },
    //=>关于DATA参数的处理
    handleData(){
      let {data}=this.options;
      if(data===null || typeof data==='string') return data;
      //只有DATA是一个对象，我们需要把它变为xxx=xxx&xxx=xxx这种格式字符串
      let str=``;
      for(let key in data){
        if(!data.hasOwnProperty(key)) break;
        str+=`${key}=${data[key]}&`
      }
      str=str.substring(0,str.length-1);
      return str;
    },
    //=> 检测URL中是否存在问号
    checkASK(url){
      return url.indexOf('?') === -1 ?'?':'&';
    }
	};
	init.prototype = ajax.prototype;

	window._ajax = ajax;
}();