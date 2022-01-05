$(function () {

    // 退出登录
    $('.logout').on('click', function () {
      console.log('ok')
      // 提示用户是否确认退出登录
      // 清空 localStorage 中的 token
      // 跳转到登录页面
      layer.confirm('确认退出登录吗？', { icon: 3, title: '提示' }, function (index) {
        //do something
        localStorage.removeItem('token')
        location.href = '/login.html'
  
        layer.close(index)
      })
    })
  
    initUserInfo()
  })
  
  // 获取用户的基本信息
  function initUserInfo() {
    axios.get('/my/userinfo').then(({ data: res }) => {
      if (res.code === 0) {
        renderUserInfo(res.data)
      }
    }, (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        location.href = '/login.html'
      }
    })
  }
  
  // 渲染用户的基本信息
  function renderUserInfo(data) {
    if (data.user_pic) {
      // 有头像
      // 头部区域
      $('#header-avatar').html(`<img src="${data.user_pic}" class="layui-nav-img">个人中心`)
      // 侧边栏区域
      $('.user-info-box').html(`<img src="${data.user_pic}" class="layui-nav-img">
      <span class="welcome">&nbsp;欢迎&nbsp; ${data.nickname || data.username}</span>`)
    } else {
      // 没有头像，需要渲染文字头像
      const uname = data.nickname || data.username
      const firstChar = uname.charAt(0).toUpperCase()
      // 头部区域
      $('#header-avatar').html(`
        <div class="text-avatar">${firstChar}</div>
        个人中心`)
      // 侧边栏区域
      $('.user-info-box').html(`
        <div class="text-avatar">${firstChar}</div>
        <span class="welcome">&nbsp;欢迎&nbsp; ${data.nickname || data.username}</span>`)
    }
    layui.element.render('nav')
  }
  
  function highlight(kw) {
    $('dd').removeClass('layui-this')
    $(`dd:contains('${kw}')`).addClass('layui-this')
  }