$(function () {
    // 点击“去注册”链接
    $('#link-reg').on('click', function () {
      // 展示注册
      $('.reg-box').show()
      // 隐藏登录
      $('.login-box').hide()
    })
  
    // 点击“去登录”链接
    $('#link-login').on('click', function () {
      // 展示登录
      $('.login-box').show()
      // 隐藏注册
      $('.reg-box').hide()
    })
  
    // 自定义表单的校验规则
    layui.form.verify({
      uname: [/^[a-zA-Z0-9]{1,10}$/, '用户名必须是1-10位字母和数字'],
      pwd: [/^\S{6,15}$/, '密码长度必须是6-15位的非空字符串'],
      repwd: function (value) {
        if (value !== $('.reg-box [name="password"]').val()) {
          return '两次密码不一致！'
        }
      }
    })
  
    // 注册新用户
    $('.reg-box form').on('submit', function (e) {
      e.preventDefault()
      axios.post('/api/reg', $(this).serialize()).then(({ data: res }) => {
        if (res.code === 0) {
          // 提示用户注册成功
          layer.msg('注册成功，请登录~')
          // 展示登录的盒子
          $('#link-login').click()
        } else {
          layer.msg(res.message)
        }
      })
    })
  
    // 用户登录
    $('.login-box form').on('submit', function (e) {
      e.preventDefault()
  
      axios.post('/api/login', $(this).serialize()).then(({ data: res }) => {
        if (res.code === 0) {
          // 登录成功
          layer.msg('登录成功！')
          localStorage.setItem('token', res.token)
          location.href = '/index.html'
        } else {
          // 登录失败
          layer.msg('登录失败！')
        }
      })
    })
  })