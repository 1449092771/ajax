let jobModel=(function(){
  //获取元素
  $tableBox = $('.tableBox'),
    $tbody = $tableBox.children('tbody');

    //获取新增职务元素
    let $addJobName= $('.addJobName'),
        $addJobDesc =$('.addJobDesc'),
        $addJobPower =$('.addJobPower'),
        $submit=$('.submit');


  //render获取元素渲染
  let render =function(){
    axios.get('/job/list').then(result=>{
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
            <a href="javascript:;">编辑</a>
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
                        render();
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
  let addJobData=function($addJobPowerVal){
    axios.post('/job/add',{
      name:$addJobName.val(),
      desc:$addJobDesc.val(),
      power:$addJobPowerVal
      //name=xxx&desc=xxx&power=xxx|xxx
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
      let $addJobPower=checkboxStr();
      console.log(!$addJobPower);
      console.log(!$addJobName.val());
      console.log(!$addJobDesc.val());
      if(!$addJobName.val() || !$addJobDesc.val() || !$addJobPower){
        alert('请填写内容');
        return;
      }
      console.log('走到这里了')
        addJobData($addJobPower);
      
    });
  };

  //新增职务内容结束




  return {
    init(){
      render();
      handleDelegate();
      addJob();
    }
  }
})();

jobModel.init();