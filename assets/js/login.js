$(function () {
    //点击注册账号
    $('#link-reg').on('click',function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link-login').on('click',function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    let form= layui.form
    let layer= layui.layer
    layui.form.verify({
        uname:  [/^[a-zA-Z0-9]{1,10}$/, '用户名必须是1-10位字母和数字'],
        pwd: [/^[\S]{6,12}$/,'密码需为6~12位，且不能有空格!'],
        repwd: function (value) {
        var pwd = $('.reg-box [name=password]').val()    
        if (pwd !== value) {
            return '两次密码不一致'
            
        }    
    }
        
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit',function (e) {
    e.preventDefault()
    // let data = {
    //     username: $('#form.reg [name=username]').val(),
    //     password: $('#form.reg [name=password]').val()
    // }
    axios.post('/api/reg',$(this).serialize()),then(({data:res})=> {
        if (res.code === 0) {
            layer.msg('注册成功，请登录');
            $('#link-login').click()
            //return console.log(res.message)
        }else{
           
             return layer.msg(res.message)
        }
        
    })
    
    })

    $('#form_login').on('submit',function (e) {
        e.preventDefault()
        // let data = {
        //     username: $('#form.reg [name=username]').val(),
        //     password: $('#form.reg [name=password]').val()
        // }
        axios.post('/api/login',$(this).serialize()),then(({data:res})=> {
            if (res.code===0) {
                 layer.msg('登录成功!');
                 localStorage.setItem('token', res.token)
                 location.href = '/index.html'
                //$('#link-login').click()
                //return console.log(res.message)
            }else{
               
                return layer.msg('登录失败!')
            }
            
        })
        
        })


})