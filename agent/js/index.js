/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-07-19 17:28:01
 * @version $Id$
 */

 $(function(){    
    $("button").click(function(){
        login();
    });
 });



 /** 登录 s **/
 function login() {
    var userName = $.trim($("#username").val());
    var passWord = $.trim($("#password").val());
    if(userName == null || userName.length==0){
        alert("请输入用户名");
        return;
    };
    if(passWord == null || passWord.length==0){
        alert("请输入密码");
        return;
    };
    $.ajax({    
        type: "POST",
        dataType:'json',
        contentType: "application/json",
        url: 'http://47.111.87.132:8066/api/User/Login', 
        data : JSON.stringify({  
                    userName: userName,
                    password: passWord
                }),
        success: function (result) { 
            if(true == result.success){ 
                var token = result.data.token;  
                var userName = result.data.userInfo.userName; 
                $.cookie('userName', userName, { expires: 7, path: '/' });  
                $.cookie('token', token, { expires: 7, path: '/' }); //登录token保存7天
                alert("登录成功");
                window.location.href = "menu.html";
            }else{
                alert("登录失败，"+result.message);
            }
        },
        error: function(data) {
            alert("服务器错误");
        } 
    });
 }
/** 登录 e **/