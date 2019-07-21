/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-07-20 15:57:16
 * @version $Id$
 */ 

 $(function(){  
 	//list();

 	//1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

 });

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

/** 传统html显示 s **/
 function list() {
 	$.ajax({ 
 		type : 'post', 
 		url  : 'http://47.111.87.132:8066/api/qrcode/getqrcodelist', 
 		contentType: "application/json",
 		data : JSON.stringify({  
 				status:0,
 				pageIndex: 1,
 				pageSize: 10 
 		}), 
 		success : function(res){
 			$("#dataeara").html(""); 
 			var data = res.data;  
 			$.each(data, function (i, item) {
 				var tr = "<tr>";
 				tr += "<td><input class='checkboxes' type=\"checkbox\" name=\"checkbox\" ></td>";
 				tr += "<td>" + (i+1) + "</td>";
 				tr += "<td>" + "<img style='width:30px' src='http://47.111.87.132:8066/" + item.path + "'>" + "</td>";
 				tr += "<td>" + item.id + "</td>";   
 				tr += "<td>" + getStatus(item.status) + "</td>";   
 				tr += "<td>" + item.content + "</td>";
 				tr += "<td>" + item.version + "</td>";
 				tr += "<td>" + item.addTime + "</td>";
 				tr += "<td>" + item.addUserRealName + "</td>";
 				tr += "<td>" + item.updateTime + "</td>";
 				tr += "<td>" + item.updateUserRealName + "</td>"; 
 				tr += "</tr>"; 
 				$("#dataeara").append(tr);
 			});
 		}         
 	})
 }
 /** 传统html显示 e **/

function btnAddImg() { 
	$("input[name='files']").val('');
}

/** 图片形式新增二维码 s **/
function uploadTrainProduct(){ 
    let fileList = [];
    const fileCatcher = $('#addbyimg');  
    const files = $("#files");
	let formData = new FormData(fileCatcher[0]);  
    $.ajax({
        url : "http://47.111.87.132:8066/api/qrcode/uploadqrcodeform",
        type : 'POST',
        data : formData, 
        processData : false,                  
        contentType : false,
        async : false,
        success : function(data) { 
            if(true == data.success){
            	alert('添加成功');
            	$('#myModal').modal('hide');
            }else{
            	alert("添加失败，提示："+data.message);
            }
        }
    });
}
/** 图片形式新增二维码 e **/

function btnAddCon() {
	$("input[name='qrCodes']").val('');
}

/** 内容方式新增二维码 s **/
function subAddForm() { 
	var numArr = [];
	var txt = $('#addbycon').find(':text');  
    for (var i = 0; i < txt.length; i++) {
    	if($.trim(txt.eq(i).val()).length > 0){ 
        	numArr.push(txt.eq(i).val());  
        }
    }
    if(numArr.length < 1) {
    	alert("请添加内容");
    	return;
    }
	 $.ajax({
        type: "POST",
        dataType:'json',
        contentType: "application/json",
        url: 'http://47.111.87.132:8066/api/qrcode/uploadqrcode', 
        data : JSON.stringify({  
			  qrCodes: numArr
 		}),
        success: function (result) { 
        	if(true == result.success){
        		$('#addModal').modal('hide');
        		alert(result.message);
        	}else{
        		alert("添加失败，提示："+data.message);
        	}
        },
        error: function(data) {
            alert("error:"+data.responseText);
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
            queryParamsType: "",
            queryParams: oTableInit.queryParams,//传递参数（*） 
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10,20],        //可供选择的每页的行数（*）
            search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 700,                     //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表onEditableSave
            responseHandler: function (res) { 
                 var totalCount = res.totalCount; 
                 return {
                    "total": res.totalCount,//总页数
                    "rows": res.data   //数据 
                 }; 
                },
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: 'id',
                class: 'W200',
            }, {
                field: 'path',
                title: '二维码', 
             	formatter:function(value,row,index){ 
                	let imghtm = '<img style="width:30px" src="http://47.111.87.132:8066/' + row.path + '">';
                	return imghtm; 
                }  
            }, {
                field: 'status',
                title: '状态',
                 class: 'W60',
                formatter:function(value,row,index){ 
                	var value="";
                	if(0 == row.status) {
                		return "未扫码";
                	}else if(1 == row.status) {
                		return "扫码成功";
                	}else if(-1 == row.status) {
                		return "扫码失败";
                	}else{
                		return "状态异常："+row.status;
                	} 
                	return value; 
                }  
            }, {
                field: 'content',
                title: '内容',
                 class: 'W300',
              
            }, {
                field: 'version',
                title: '版本',
                 class: 'W80',
                
            }
            , {
                field: 'addTime',
                title: '添加时间',
                 class: 'W80',
               
            }
            , {
                field: 'addUserRealName',
                title: '添加人',
                 class: 'W120',
               
            }
            , {
                field: 'updateTime',
                title: '修改时间',
                 class: 'W160',
               
            }
            , {
                field: 'updateUserRealName',
                title: '修改人' ,
                 class: 'W120',
            }  
            ],
         // 　　onEditableSave: function (field, row, oldValue, $el) {
         //     $.ajax({
         //         type: "post",
         //         url: "http://47.111.87.132:8066//api/QrCode/UpdateQrCodeStatus",
         //         data: { strJson: JSON.stringify(row.id) },
         //         success: function (data, status) {
         //             if (status == "success") {
         //                 alert("编辑成功");
         //             }
         //         },
         //         error: function () {
         //             alert("Error");
         //         },
         //         complete: function () {

         //         } 
         //     });
         // }
        });
    }; 

   //得到查询的参数
  oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的 
            status:0,
            pageSize: params.pageSize,
            pageIndex: params.pageNumber 
        };
        return temp;
    };
    return oTableInit;
};
/** bootstrapTable动态表格赋值 e **/