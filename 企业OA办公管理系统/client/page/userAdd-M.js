let userAddModel = (function () {
  //=>获取元素
  let $userName=$('.username'),
      $sexRadio=$('.sexRadio'), //性别的你级元素
      $selectBox=$('.selectBox'),
      $selectIndex=0,    //问题：我理解是上面定义一个变量，下面在change,select部门的时候就把这个变量赋值成最新的值，当点击提交的时候把这个值给后台就可以，但是实际上却是这个值都是0
      $selectDuties=$('.selectDuties'),
      $useremail=$('.useremail'),
      $userphone=$('.userphone'),
      $textarea=$('textarea'),
      $submit=$('.submit');



  //=>获取部门
  let departmentMeg =function(){
    let str = `<option value="0">全部</option>`,
        departmentMsg=JSON.parse(localStorage.getItem('departmentMsg'));
				departmentMsg.forEach(item => {
					str += `<option value="${item.id}">${item.name}</option>`;
				});
				$selectBox.html(str);
  }

  //=>获取职务信息  /job/list
  let selectJob = function () {
    axios.get('/job/list').then(result => {
			if (parseInt(result.code) === 0) {
        let str = `<option value="0">全部</option>`;
				result.data.forEach(item => {
					str += `<option value="${item.id}">${item.name}</option>`;
				});
				$selectDuties.html(str);
			}
		}).catch(error=>{
      console.log('111');
    });
  };
  
  //=》改变部门获取选中的部门信息
  $selectBox.on('change', function(){
    let _this=$(this),
    $selectIndex=_this.val(); //我在这里改变的时候把最新的值赋值给了这个变量
  });

  //=>把所有数据提交给后台
  let submitData=function(){
    axios.post('/user/add',{
      name:$userName.val(),
      sex:$('input:radio[name="sex"]:checked').val(),
      email:$useremail.val(),
      phone:$userphone.val(),
      departmentId:$selectBox.find("option:selected").val(),
      jobId:$selectDuties.find("option:selected").val(),
      desc:$textarea.val()
    }).then(result=>{
      if(parseFloat(result.code)===0){
      }
    })
  }


  //=>提交给服务器所有信息
  $submit.on('click',function(){
    //判断信息全不全
    if(!$userName.val()){
      alert('请填写用户名')
    }else if(!$useremail.val()|| !$userphone.val()){
      alert('请输入邮箱或者电话')
    }else if(!$selectBox.find("option:selected").val()){
      alert('请选择部门')
    }else if(!$selectDuties.find("option:selected").val()){
      alert('请选择职务')
    }else if(!$textarea.val()){
      alert('请填写自我介绍')
    }else{
      submitData();
    }
    

      
    
  })





  return {
		init() {
      departmentMeg(); //部门信息
      selectJob();  //职务信息
		}
	}

})();

userAddModel.init();