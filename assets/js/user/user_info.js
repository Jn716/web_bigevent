$(function () {
    layui.form.verify({
      nickname: [/^\S{1,10}$/, '昵称的长度为1-10的非空字符串']
    })
  
    // 初始化用户的基本信息
    function initUserInfo() {
      axios.get('/my/userinfo').then(({ data: res }) => {
        console.log(res)
        layui.form.val('user-form', res.data)
      })
    }
  
    initUserInfo()
  
    // 触发了表单的提交
    $('.layui-form').on('submit', function (e) {
      e.preventDefault()
  
      const data = $(this).serialize()
  
      axios.put('/my/userinfo', data).then(({ data: res }) => {
        if (res.code === 0) {
          window.parent.initUserInfo()
          layer.msg(res.message)
        }
      })
    })
  
    // 点击重置按钮
    $('[type="reset"]').on('click', function (e) {
      e.preventDefault()
      initUserInfo()
    })
  })