$(document).ready(function(){

    // var baseUrl = "http://localhost:8080/rest-api/api";
    var baseUrl = "http://erstegrad.herokuapp.com/api/get";
    // var baseUrl = "http://beeoneapi.elasticbeanstalk.com/api";
    // var baseUrl = "http://10.0.0.165:5000/api/get";
    
    $.support.cors = true;

    $(".form").submit(function(e){
      authenticateUser();
      e.preventDefault();
    });

    var authenticateUser = function(){
      $("#ajax-spinner").show();
      $.ajax(
        {
          url:baseUrl+"/login",//?username="+$("#username").val()+"&password="+$("#password").val(),
          // beforeSend: function(xhr){
            // xhr.setRequestHeader("X-BeeOne-Auth", "true");
            // xhr.setRequestHeader('X-Request', 'JSON');
          // },
          data:{"username":$("#username").val(),"password":$("#password").val()},
          // data:{username:"tester1",password:"pwd"},
          type:"GET",
          success: function(data, textStatus, response) {
            $("#ajax-spinner").hide();
            var $data = $.parseJSON(data);
            // console.log(response.getAllResponseHeaders());
            // console.log(response.getResponseHeader('X-BeeOne-Auth'));
            localStorage["X-BeeOne-Auth"] = $data.headers["x-beeone-auth"];//response.getResponseHeader('X-BeeOne-Auth');
            localStorage["user_id"] = $data.id;
            localStorage["username"] = $data.name;
            console.log($data);
            console.log($data.name);
            window.location = "transactions";
          }
      });
    };
});
