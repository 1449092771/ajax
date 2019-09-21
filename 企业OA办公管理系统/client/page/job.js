let jobModel=(function(){
  //获取元素
  $tableBox = $('.tableBox'),
    $tbody = $tableBox.children('tbody');

    //获取新增职务元素
    let $addJobName= $('.addJobName'),
        $addJobDesc =$('.addJobDesc'),
        $spanjobname=$('.spanjobname'),
        $spanjobdesc=$('.spanjobdesc'),
        $addJobPower =$('.addJobPower'),
        $checkboxs=$addJobPower.find('input[type="checkbox"]'),
        $submit=$('.submit');
    //来判断是新增还是编辑
    let jobId=null,
        isUpdate=false;

  //render获取元素渲染
  let render =function(){
    return axios.get('/job/list').then(result=>{
      let {
        code,
        data
      } = result;
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
          power
        } =item;
          str+=` <tr data-id='${id}' data-name='${name}'>
          <td class="w8">${id}</td>
          <td class="w10">${name}</td>
          <td class="w20">${desc}</td>
          <td class="w50">${power}</td>
          <td class="w12">
            <a href="jobadd.html?jobId=${id}">编辑</a>
            <a href="javascript:;">删除</a>
          </td>
        </tr>`
      });
      $tbody.html(str);
    }).catch(()=>{
      $tbody.html('没有内容')
    })
  };

  //操作删除数据
  //=>基于事件委托处理员工的相关操作
  let handleDelegate = function(){
    $tbody.click(function(ev){
      let target=ev.target;
          tarTag = target.tagName,
          tarVal = target.innerText,
          $target=$(target);

          if (tarTag === 'A' && tarVal === "删除") {
            let $grandpa=$target.parent().parent(),
                jobId=$grandpa.attr('data-id'),
                userName=$grandpa.attr('data-name');
                alert(`确定要删除 ${userName}吗？`,{
                  title: '警告！警告！当前操作很重要！',
                  confirm: true,
                  handled: msg => {
                    if (msg !== 'CONFIRM') return;
                    axios.get('/job/delete', {
                      params: {
                        jobId
                      }
                    }).then(result => {
                      if (parseInt(result.code) === 0) {
                        alert('当前操作成功，即将返回列表页',{
                          handled:()=>{
                            // render();
                            window.location.href="joblist.html";
                          }
                        })
                        return;
                      }
                      alert('当前操作失败，请稍后重试！');
                    });
                  }
                })
          }
      })
  };


  //新增职务内容
  let addJobData=function($addJobPowerVal,URL){
    console.log('11==='+$addJobPowerVal);
    axios.post(URL,{
      jobId,
      name:$addJobName.val(),
      desc:$addJobDesc.val(),
      power:$addJobPowerVal,
      //name=xxx&desc=xxx&power=xxx|xxx
    }).then(result=>{
      if(parseInt(result.code)===0){
        alert('当前操作成功，即将返回列表页',{
          handled:()=>{
            window.location.href="joblist.html";
          }
        })
        return;
      }
      return Promise.reject();
    }).catch(reason=>{

    })
  }
  //拼接字符串xxx|xxx
  let checkboxStr=function(){
    var chk_value =[]; 
    $('input[type="checkbox"]:checked').each(function(){ 
        chk_value.push(this.value); //push 进数组
    });
    //数组转字符串
    return chk_value.length==0 ? '' : chk_value.join("|");
  }
  let addJob=function(){
    $submit.click(function(){
      if(!jobUserName() || !JobDesc()) return;
      //判断是修改还是增加
      let URL=isUpdate ? '/job/update':'/job/add';
      let $addJobPower=checkboxStr();
      console.log('aaa==='+$addJobPower)
      addJobData($addJobPower,URL);
      
    });
  };

  //新增职务内容结束
//表单验证
  let jobUserName = function () {
		let addJobName = $addJobName.val().trim();
		if (addJobName.length === 0) {
			$spanjobname.html('用户名为必填项，不能为空！');
			return false; //=>验证失败要返回FALSE
		}
		$spanjobname.html('');
		return true; //=>验证成功要返回TRUE
  };
  let JobDesc = function () {
		let addJobDesc = $addJobDesc.val().trim();
		if (addJobDesc.length === 0) {
			$spanjobdesc.html('用户名为必填项，不能为空！');
			return false; //=>验证失败要返回FALSE
		}
		$spanjobdesc.html('');
		return true; //=>验证成功要返回TRUE
	};


  return {
    init(){
      //=>表单验证
			$addJobName.on('blur', jobUserName);
			$addJobDesc.on('blur', JobDesc);
      //=>获取地址栏中问号传参信息
      let paramsObj=window.location.href.queryURLParams();
      if('jobId' in paramsObj){
        jobId=paramsObj.jobId;
        isUpdate=true;
      }
      
      //从服务器获取基本信息，显示在表单中
      let queryBaseInfo=function(){
        return axios.get('/job/info',{
          params:{
            jobId
          }
        }).then(result=>{
          if(parseInt(result.code)===0){
            let {
              id,
              name,
              desc,
              power
            } =result.data;
            $addJobName.val(name);
            $addJobDesc.val(desc);
            console.log('power=='+power);
            let powerArr=power.split('|');
            // $checkboxs.forEach((index)=>{
            //   $checkboxs[0].prop('checked')===true;
            // });
            console.log($($checkboxs[0]));
            
            $checkboxs.each((index)=>{
              $checkbox = $($($checkboxs[index]));
              if (powerArr.includes($checkbox.val()) ) {
                $checkbox.prop('checked', 'checked');
              }
            });

            /**

            powerArr.filter((item,index)=>{
              console.log('index=='+index);
              $checkboxs.each((index)=>{
                $checkbox = $($($checkboxs[index]));
                if ($checkbox.val() == item ) {
                  $checkbox.prop('checked', 'checked');
                }

              });

            });
            **/
            return;
          }
          return Promise.reject();
        })
      }



      render().then(()=>{
        if(isUpdate){
          return queryBaseInfo();
        }
      }).then(()=>{
        addJob();
      });
      handleDelegate();
      
    }
  }
})();

jobModel.init();