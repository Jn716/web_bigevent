$(function () {
    // 点击选择图片
    $('#btnChooseImg').on('click', function () {
      $('#file').click()
    })
  
    let file = null
    // 选中了图片
    $('#file').on('change', function (e) {
      const files = e.target.files
      if (files.length === 0) {
        return file = null
      }
  
      file = files[0]
      url = URL.createObjectURL(file)
      $('#image').attr('src', url)
    })
  
    // 点击了上传头像的按钮
    $('#btnUploadImg').on('click', function () {
      if (!file) {
        return layer.msg('请先选择头像！')
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', function () {
        axios.patch('/my/update/avatar', { avatar: reader.result }).then(({ data: res }) => {
          if (res.code === 0) {
            layer.msg('更新头像成功！')
            window.parent.initUserInfo()
          }
        })
      })
    })
  })