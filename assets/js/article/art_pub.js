$(function () {
    initCateList()
  
    // 初始化分类列表
    function initCateList() {
      axios.get('/my/cate/list').then(({ data: res }) => {
        if (res.code === 0) {
          const rows = []
          res.data.forEach(item => {
            rows.push(`<option value="${item.id}">${item.cate_name}</option>`)
          })
          $('[name="cate_id"]').append(rows)
  
          // 添加样式忽略
          $('.ql-toolbar select').attr('lay-ignore', '')
          // 重新渲染 select 下拉菜单
          layui.form.render('select')
          // 隐藏下拉菜单
          $('.ql-toolbar select').hide()
        }
      })
    }
  
    layui.form.verify({
      title: [/^.{1,30}$/, '标题长度为1-30个字符']
    })
  
    // 工具栏的配置项
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike', 'image'],        // toggled buttons
      ['blockquote', 'code-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
  
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
  
      ['clean']                                         // remove formatting button
    ]
    const quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions
      },
    })
  
    // 选择封面
    $('.btn-choose-img').on('click', function () {
      $('#file').click()
    })
  
    // 用户选择了封面
    let file = null
    $('#file').on('change', function (e) {
      const files = e.target.files
      if (files.length === 0) {
        return file = null
      }
  
      const imgURL = URL.createObjectURL(files[0])
      $('#image').attr('src', imgURL)
      file = files[0]
    })
  
    let state = '已发布'
    $('.btn_cg').on('click', function () {
      state = '草稿'
    })
  
    $('.form-pub').on('submit', function (e) {
      e.preventDefault()
      if (!file) return layer.msg('请选择文章封面！')
  
      const fd = new FormData()
      fd.append('title', $('[name="title"]').val())
      fd.append('cate_id', $('[name="cate_id"]').val())
      fd.append('content', quill.root.innerHTML)
      fd.append('cover_img', file)
      fd.append('state', state)
  
      axios.post('/my/article/add', fd).then(({ data: res }) => {
        if (res.code === 0) {
          window.parent.highlight('文章列表')
          location.href = '/article/art_list.html'
        }
      })
    })
  })