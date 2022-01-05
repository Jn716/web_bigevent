$(function () {
    layui.form.verify({
      pwd: [/^\S{6,15}$/, '密码的必须是6-15位的非空字符'],
      samePwd: function (value) {
        const oldPwd = $('[name="old_pwd"]').val()
        if (value === oldPwd) {
          return '新旧密码不能相同！'
        }
      },
      repwd: function (value) {
        const newPwd = $('[name="new_pwd"]').val()
        if (value !== newPwd) {
          return '两次新密码不一致！'
        }
      }
    })
  
    $('#formUpdatePwd').on('submit', function (e) {
      e.preventDefault()
  
      axios.patch('/my/updatepwd', $(this).serialize()).then(({ data: res }) => {
        if (res.code === 0) {
          layer.msg('更新密码成功！')
          $(':password').val('')
        }
      })
    })
  })