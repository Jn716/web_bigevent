$(function () {
    initCateList()
  
    // 初始化分类列表数据
    function initCateList() {
      axios.get('/my/cate/list').then(({ data: res }) => {
        if (res.code === 0) {
          const rows = []
          res.data.forEach((item, index) => {
            rows.push(`<tr>
              <td>${index + 1}</td>
              <td>${item.cate_name}</td>
              <td>${item.cate_alias}</td>
              <td>
                <button type="button" class="layui-btn layui-btn-xs btn-edit" data-id="${item.id}">修改</button>
                <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id="${item.id}">删除</button>
              </td>
            </tr>`)
          })
          $('tbody').html(rows)
        }
      })
    }
  
    // 点击添加分类的按钮
    let addIndex = null
    $('#btnShowAdd').on('click', function () {
      addIndex = layer.open({
        type: 1,
        title: '添加文章分类',
        area: ['500px', '250px'],
        content: $('#template-add').html()
      })
    })
  
    // 表单验证
    layui.form.verify({
      name: [/^\S{1,10}$/, '分类名称必须是1-10位的非空字符串'],
      alias: [/^[a-zA-Z0-9]{1,15}$/, '分类别名必须是1-15位的字母和数字']
    })
  
    // 添加分类
    $('body').on('submit', '#form-add', function (e) {
      e.preventDefault()
  
      axios.post('/my/cate/add', $(this).serialize()).then(({ data: res }) => {
        if (res.code === 0) {
          // 提示用户
          layer.msg('添加分类成功！')
          // 关闭弹出层
          layer.close(addIndex)
          // 刷新列表数据
          initCateList()
        }
      })
    })
  
    // 点击修改按钮
    let editIndex = null
    $('tbody').on('click', '.btn-edit', function () {
      const id = $(this).attr('data-id')
      if (id == 1 || id == 2) return layer.msg('不允许修改！', { icon: 7 })
  
      editIndex = layer.open({
        type: 1,
        title: '修改文章分类',
        area: ['500px', '250px'],
        content: $('#template-edit').html()
      })
  
      axios.get('/my/cate/info', {
        params: { id }
      }).then(({ data: res }) => {
        if (res.code === 0) {
          layui.form.val('form-edit', res.data)
        }
      })
    })
  
    // 修改分类
    $('body').on('submit', '#form-edit', function (e) {
      e.preventDefault()
  
      const data = $(this).serialize()
      axios.put('/my/cate/info', data).then(({ data: res }) => {
        if (res.code === 0) {
          layer.close(editIndex)
          initCateList()
        }
      })
    })
  
    // 删除
    $('tbody').on('click', '.btn-delete', function () {
      const id = $(this).attr('data-id')
      if (id == 1 || id == 2) return layer.msg('不允许删除！', { icon: 7 })
  
      layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
        //do something
        axios.delete('/my/cate/del', {
          params: { id }
        }).then(({ data: res }) => {
          if (res.code === 0) {
            layer.msg('删除成功！', { icon: 1 })
            initCateList()
          }
        })
  
        layer.close(index);
      });
    })
  })