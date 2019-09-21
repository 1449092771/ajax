
let departmentModel=(function(){
  //获取元素
  $tableBox = $('.tableBox'),
    $tbody = $tableBox.children('tbody'),
    $departmentList=$('.departmentList'),
    $spandepname=$('.spandepname'),
    $spandepdesc=$('.spandepdesc');

    //来判断是新增还是编辑
    let departmentId=null,
        isUpdate=false;

    //这里是获取新增部门里的元素
    let $addDepName=$('.addDepName'), //名称
        $addDesc = $('.addDesc'),
        $addDepSubmit=$('.submit');


    //新增部门获取结束

    
    let power = localStorage.getItem('power') || '';
    power = decodeURIComponent(power);

  let render = function () {
		//=>获取数据
		return axios.get('/department/list').then(result => {
			let {
        code,
        data
      } =result;
      if(parseFloat(code)===0){
        return data;
      }
      return Promise.reject();
		}).then(data=>{
      let str=``;
      data.forEach(item => {
        let {
          id,
          name,
          desc,
        } =item;
        str+=`<tr data-id='${id}' data-name='${name}'>
				<td class="w10">${id}</td>
				<td class="w20">${name}</td>
				<td class="w40">${desc}</td>
				<td class="w20">
					<a href="departmentadd.html?departmentId=${id}">编辑</a>
					<a href="javascript:;">删除</a>
				</td>
			</tr>`;
      });
      $tbody.html(str);
    }).catch(()=>{
      $tbody.html(`<p style="text-align:center;padding:20px;font-size:16px">没有内容</p>`)
    });
  };
  
  //=>基于事件委托处理员工的相关操作
  let handleDelegate = function () {
    $tbody.click(function (ev) {
			let target = ev.target,
				tarTag = target.tagName,
				tarVal = target.innerText,
        $target = $(target);

    //=>删除
			if (tarTag === 'A' && tarVal === "删除") {
        let $grandpa=$target.parent().parent(),
            departmentId=$grandpa.attr('data-id'),
            userName=$grandpa.attr('data-name');
        alert(`确定要删除 ${userName}吗？`,{
          title: '警告！警告！当前操作很重要！',
          confirm: true,
          handled: msg => {
						if (msg !== 'CONFIRM') return;
						axios.get('/department/delete', {
							params: {
								departmentId
							}
						}).then(result => {
							if(parseInt(result.code)===0){
                alert('当前操作成功，即将返回列表页',{
                  handled:()=>{
                    render();
                    window.location.href="departmentlist.html";
                  }
                })
                return;
              }
              return Promise.reject();
						}).catch(()=>{
              alert('当前操作失败，请稍后重试！');
            });
					}
        },1000)

      }

      //=>编辑
			

    });
  }


  //新增部门内容
  let addSubmitData=function(URL){
    // console.log(URL);
    axios.post(URL,{
      departmentId:departmentId,
      name:$addDepName.val(),//departmentId=1&name=xxx&desc=xxx
      desc:$addDesc.val()   
    }).then(result=>{
      if(parseInt(result.code)===0){
        alert('当前操作成功，即将返回列表页',{
          handled:()=>{
            window.location.href="departmentlist.html";
          }
        })
        return;
      }
      return Promise.reject();
    }).catch(()=>{
      alert('新增部门信息失败')
    })
  };

//从服务器获取基本信息，显示在表单中
let queryBaseInfo=function(){
  return axios.get('/department/info',{
    params:{
      departmentId
    }
  }).then(result=>{
    if(parseInt(result.code)===0){
      let {
        id,
        name,
        desc
      } =result.data;
      $addDepName.val(name);
      $addDesc.val(desc);
      return;
    }
    return Promise.reject();
  })
}

  let addDepartment = function(){
    
    $addDepSubmit.on('click',function(){
      if(!depUserName() || !depUserDesc()) return;
      //判断是修改还是增加
      let URL=isUpdate ? '/department/update':'/department/add';
      console.log(URL)
        addSubmitData(URL);
        
    })
  };



  //新增部门内容结束

//=>表单验证
let depUserName = function () {
  let usernameVal = $addDepName.val().trim();
  if (usernameVal.length === 0) {
    $spandepname.html('用户名为必填项，不能为空！');
    return false; //=>验证失败要返回FALSE
  }
  $spandepname.html('');
  return true; //=>验证成功要返回TRUE
};
let depUserDesc = function () {
  let userDesc = $addDesc.val().trim();
  if (userDesc.length === 0) {
    $spandepdesc.html('用户名为必填项，不能为空！');
    return false; //=>验证失败要返回FALSE
  }
  $spandepdesc.html('');
  return true; //=>验证成功要返回TRUE
};




  return {
    init() {
      //=>表单验证
			$addDepName.on('blur', depUserName);
			$addDesc.on('blur', depUserDesc);
      //=>获取地址栏中问号传参信息
      let paramsObj=window.location.href.queryURLParams();
      if('departmentId' in paramsObj){
        departmentId=paramsObj.departmentId;
        isUpdate=true;
      }
      
      render().then(()=>{
        if(isUpdate){
          return queryBaseInfo();
        }
      }).then(()=>{
        addDepartment()  //新增部门信息
      });
      handleDelegate(); //编辑，删除
      
     
		}
  }

})();

departmentModel.init();