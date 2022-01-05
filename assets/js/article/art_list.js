$(function () {
    // 初始化文章的列表数据
    const q = {
      pagenum: 1,
      pagesize: 2,
      cate_id: '',
      state: ''
    }
  
    function initArtList() {
      axios.get('/my/article/list', {
        params: q
      }).then(({ data: res }) => {
        const rows = []
        res.data.forEach(item => {
          // 对时间进行格式化处理
          item.pub_date = dayjs(item.pub_date).format('YYYY-MM-DD HH:mm:ss')
          // 把行添加到 rows 中
          rows.push(`<tr>
          <td><a href="javascript:;" class="link-detail" data-id="${item.id}">${item.title}</a></td>
          <td>${item.cate_name}</td>
          <td>${item.pub_date}</td>
          <td>${item.state}</td>
          <td>
            <!--<button type="button" class="layui-btn layui-btn-xs btn-edit">编辑</button>-->
            <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id="${item.id}">删除</button>
          </td>
        </tr>`)
        })
        $('tbody').html(rows)
  
        // 调用分页的函数
        renderPage(res.total)
      })
    }
  
    initArtList()
    initCateList()
  
    // 初始化文章分类列表
    function initCateList() {
      axios.get('/my/cate/list').then(({ data: res }) => {
        if (res.code === 0) {
          const rows = []
          res.data.forEach(item => {
            rows.push(`<option value="${item.id}">${item.cate_name}</option>`)
          })
          $('[name="cate_id"]').append(rows)
          layui.form.render('select')
        }
      })
    }
  
    // 监听筛选表单的 submit 事件
    $('form').on('submit', function (e) {
      e.preventDefault()
  
      q.cate_id = $('[name="cate_id"]').val()
      q.state = $('[name="state"]').val()
      q.pagenum = 1
  
      initArtList()
    })
  
    // 点击重置按钮
    $('[type="reset"]').on('click', function () {
      q.cate_id = ''
      q.state = ''
      q.pagenum = 1
  
      initArtList()
    })
  
    // 渲染分页效果
    function renderPage(count) {
      layui.laypage.render({
        elem: 'page-box', //注意，这里的 page-box 是 ID，不用加 # 号
        count, //数据总数，从服务端得到
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 当前展示的是第几页的数据
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 5, 10, 15, 20],
        jump: function (obj, first) {
          q.pagenum = obj.curr
          q.pagesize = obj.limit
  
          //首次不执行
          if (!first) {
            //do something
            // 根据最新的“页码值”和“每页的条数”，请求对应的数据
            initArtList()
          }
        }
      })
    }
  
    $('tbody').on('click', '.btn-delete', function () {
      const id = $(this).attr('data-id')
  
      layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
        //do something
        axios.delete('/my/article/info', {
          params: { id }
        }).then(({ data: res }) => {
          if (res.code === 0) {
            layer.msg('删除成功！')
            // 如果当前页 tr 行等于 1，并且当前的页码值大于 1
            if ($('tbody tr').length === 1 && q.pagenum > 1) {
              // 让页码值 -1
              q.pagenum -= 1
            }
            initArtList()
          }
        })
  
        layer.close(index)
      });
    })
  
    $('tbody').on('click', '.link-detail', function () {
      const id = $(this).attr('data-id')
  
      axios.get('/my/article/info', {
        params: { id }
      }).then(({ data: res }) => {
        if (res.code === 0) {
          const art = res.data
          layer.open({
            type: 1,
            area: ['85%', '85%'],
            title: '预览文章',
            content: `<div class="artinfo-box">
            <h1 class="artinfo-title">${art.title}</h1>
            <div class="artinfo-bar">
              <span>作者：${art.nickname || art.username}</span>
              <span>发布时间：${dayjs(art.pub_date).format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>所属分类：${art.cate_name}</span>
              <span>状态：${art.state}</span>
            </div>
            <hr>
            <img src="http://www.liulongbin.top:3008${art.cover_img}" alt="" class="artinfo-cover">
            <div>${art.content}</div>
          </div>`
          })
        }
      })
  
  
    })
  })