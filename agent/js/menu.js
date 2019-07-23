/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-07-20 15:57:16
 * @version $Id$
 */ 

 $(function(){  
    
 	//非admin用户不显示用户管理按钮
    if("admin" != $.cookie('userName')){
        $("#userAdmBtn").hide();
    }

 	//1.初始化Table
    var oTable = new TableInit();
    oTable.Init(); 

    $("#statusSelect").change(function () { 
         $("button[name='refresh']").trigger("click"); 
    });

    setInterval(refreshData,10000);
    refreshData();

    $("#userNameSpan").text("欢迎："+$.cookie('userName'));  
 });

 /**定时刷新 **/
function refreshData() {
    $("button[name='refresh']").trigger("click"); 
}

/*状态 0:未扫码  1:扫码成功  -1:扫码失败*/
function getStatus(sta) {
	if(0 == sta) {
		return "未扫码";
	}else if(1 == sta) {
		return "扫码成功";
	}else if(-1 == sta) {
		return "扫码失败";
	}else{
		return "状态异常："+sta;
	}
};

/** 图片形式新增二维码 s **/
function uploadTrainProduct(){   
    let fileList = [];
    const fileCatcher = $('#addbyimg');    
	let formData = new FormData(fileCatcher[0]);  
    $.ajax({
        url : "http://47.111.87.132:8066/api/qrcode/uploadqrcodeform",
        type : 'POST',
        data : formData, 
        processData : false,                  
        contentType : false,
        headers: {
            Authorization: $.cookie('token')
        },
        async : false,
        success : function(data) { 
            if(true == data.success){
            	alert('添加成功');
            	$('#myModal').modal('hide');
            }else if(401 == data.code){
                alert("当前未登录，请登录");
                window.location.href = "login.html";
            }else{
            	alert("添加失败，请确认是否为可识别的二维码图片");
            }
        }
    });
}
/** 图片形式新增二维码 e **/

//清空
function btnAddCon() {
	$("#inputTextarea").val('');
}

//清空
function btnAddImg() { 
    $("input[name='files']").val('');
}

/** 内容方式新增二维码 s **/
function subAddForm() {

	var numArr = [];
    var content = $("#inputTextarea").val().split("\n"); 
    $.each(content, function(i, val){
       if($.trim(val).length > 0){ 
         numArr.push($.trim(val));   
        }
    }); 

    if(numArr.length < 1) {
    	alert("请添加内容");
    	return;
    }
	 $.ajax({
        type: "POST",
        dataType:'json',
        contentType: "application/json",
        headers: {
            Authorization: $.cookie('token')
        },
        url: 'http://47.111.87.132:8066/api/qrcode/uploadqrcode', 
        data : JSON.stringify({  
			  qrCodes: numArr
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
/** 内容方式新增二维码 e **/ 

/** bootstrapTable动态表格赋值 s **/
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_').bootstrapTable({
            url: 'http://47.111.87.132:8066/api/qrcode/getqrcodelist',         //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
             ajaxOptions:{
                headers:{"Authorization":$.cookie('token')}
            },                
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
                field: 'path',
                title: '二维码', 
             	formatter:function(value,row,index){ 
                    if (row.status == 1) { //已经扫过
                        return '<img style="width:100px" src="images/erweima_bad.png">';
                    }else if(-1 == row.status) { //扫失败的
                        return "扫码失败";
                    }else if(0 == row.status){ //可以扫的 onmousemove="imgBig('+this+')"
                        return '<img style="width:100px" src="http://47.111.87.132:8066/' + row.path + '">';
                    }  
                } 
            }, {
                field: 'status',
                title: '状态',
                 class: 'W60',
                formatter:function(value,row,index){ 
                    var value="";
                    if(0 == row.status) {
                        return "<span style='color:green'>未扫码</span>";
                    }else if(1 == row.status) {
                        return "扫码成功";
                    }else if(-1 == row.status) {
                        return "<span style='color:red'>扫码失败</span>";
                    }else{
                        return "<span style='color:red'>状态异常："+row.status + "</span>";
                    } 
                    return value; 
                }   
            }, {
                field: 'content',
                title: '内容',
                 class: 'W300',
              
            }
            //, {
            //     field: 'version',
            //     title: '版本',
            //      class: 'W80',
                
            // }
            // , {
            //     field: 'addTime',
            //     title: '添加时间',
            //     class: 'W80' 
            // }
            // , {
            //     field: 'addUserRealName',
            //     title: '添加人',
            //      class: 'W120',
               
            // }
            // , {
            //     field: 'updateTime',
            //     title: '修改时间',
            //      class: 'W160',
               
            // }
            // , {
            //     field: 'updateUserRealName',
            //     title: '修改人' ,
            //      class: 'W120',
            // }  
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