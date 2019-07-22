/**
 * userad
 * @authors Your Name (you@example.org)
 * @date    2019-07-22 18:37:45
 * @version $Id$
 */

 $(function(){   
 	
    if("admin" != $.cookie('userName')){
        window.location.href = "login.html";
    }

 	//1.初始化Table
    var oTable = new TableInit();
    oTable.Init();  
 
    $("#userNameSpan").text("欢迎："+$.cookie('userName')); 
 });


/** bootstrapTable动态表格赋值 s **/
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_').bootstrapTable({
            url: 'http://47.111.87.132:8066/api/User/GetUsers',         //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            ajaxOptions:{
		        headers:{"Authorization":$.cookie('token')}
		    },
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParamsType: "",
            queryParams: oTableInit.queryParams,//传递参数（*） 
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10,20],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            //height: 700,                     //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表onEditableSave
            responseHandler: function (res) {
            	if(401 == res.code){
	                alert("当前未登录，请登录");
	                window.location.href = "login.html";
	            }
                 var totalCount = res.totalCount; 
                 return {
                    "total": res.totalCount,//总页数
                    "rows": res.data   //数据 
                 }; 
                },
            columns: [
            // {
            //     checkbox: false
            // }, 
            // {
            //     field: 'id',
            //     title: 'id',
            //     class: 'W200',
            // }, 
            {
                field: 'userName',
                title: '用户名' 
            }, {
                field: 'status',
                title: '状态',
                 class: 'W60',
                formatter:function(value,row,index){ 
                    var value="";
                    if(0 == row.status) {
                        return "<span style='color:green'>正常</span>";
                    }else{
                        return "<span style='color:red'>异常</span>";
                    } 
                    return value; 
                }   
            }, {
                field: 'realName',
                title: '姓名',
                 class: 'W300', 
            }
            , {
                field: 'phone',
                title: '手机号',
                 class: 'W300', 
            }
            , {
                field: 'addTime',
                title: '新建时间',
                 class: 'W80',
                
            }
            , {
                field: 'addUserRealName',
                title: '新建人',
                class: 'W80' 
            } 
            ], 
        });
    }; 

   //得到查询的参数
  oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的 
            status: $('#statusSelect').val(),
            pageSize: params.pageSize,
            pageIndex: params.pageNumber 
        };
        return temp;
    };
    return oTableInit;
};
/** bootstrapTable动态表格赋值 e **/ 


//清空
function btnAdd() { 
	 $("#addUser")[0].reset();
}

/** 新增 s **/
function subAddForm() {   
	 $.ajax({
        type: "POST",
        dataType:'json',
        contentType: "application/json",
        headers: {
	        Authorization: $.cookie('token')
	    },
        url: 'http://47.111.87.132:8066/api/User/AddUser',  
        data : JSON.stringify({  
 				userName: $("#userName").val(),
 				password: $("#password").val(),
 				realName: $("#realName").val(),
 				phone: $("#phone").val()
 		}), 
        success: function (result) { 
        	if(true == result.success){
        		$('#addModal').modal('hide');
        		alert(result.message);
        	}else if(401 == result.code){
                alert("当前未登录，请登录");
                window.location.href = "login.html";
            }else{
        		alert("添加失败，提示："+data.message);
        	}
        },
        error: function(data) {
            alert("服务器错误");
         } 
    });
}
/** 新增 e **/ 

//退出
function loginOut() { 
	 $.ajax({
        type: "POST",
        dataType:'json',
        contentType: "application/json",
        headers: {
	        Authorization: $.cookie('token')
	    },
        url: 'http://47.111.87.132:8066/api/User/Logout', 
        data : "",
        success: function (result) { 
        	if(true == result.success){
        		$.cookie('token', null, { expires: 7, path: '/' }); //清空本地token
        		$.cookie('userName', null, { expires: 7, path: '/' }); //清空本地token
        		alert("退出成功");
        		window.location.href = "login.html";
        	}else{
        		alert("失败，提示："+result.message);
        	}
        },
        error: function(data) {
            alert("服务器错误");
         } 
    });
}
