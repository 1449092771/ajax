
let departmentModel=(function(){
  //获取元素
  $tableBox = $('.tableBox'),
    $tbody = $tableBox.children('tbody'),
    $departmentList=$('.departmentList');
    
    let power = localStorage.getItem('power') || '';
    power = decodeURIComponent(power);

  let render = function () {
		//=>获取数据
		axios.get('/department/list').then(result => {
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
					<a href="javascript:;">编辑</a>
					<a href="javascript:;">删除</a>
				</td>
			</tr>`;
      });
      $tbody.html(str);
    }).catch(()=>{
      $tbody.html('没有内容')
    });
  };
  
  //=>基于事件委托处理员工的相关操作
  let handleDelegate = function () {
    $tbody.click(function (ev) {
			let target = ev.target,
				tarTag = target.tagName,
				tarVal = target.innerText,
        $target = $(target);
        alert(1111);

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
							if (parseInt(result.code) === 0) {
                // render();
                $departmentList.click();
								return;
							}
							alert('当前操作失败，请稍后重试！');
						});
					}
        })

      }

    });
  }


  //新增部门内容
  



  //新增部门内容结束



  return {
    init() {
      render();
      handleDelegate(); //编辑，删除
		}
  }

})();

departmentModel.init();