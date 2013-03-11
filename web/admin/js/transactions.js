$(document).ready(function(){

  // var baseUrl = "http://localhost:8080/rest-api/api";
  var baseUrl = "http://erstegrad.herokuapp.com/api/token";
  // var baseUrl = "http://beeoneapi.elasticbeanstalk.com/api";
  // var baseUrl = "http://10.0.0.165:5000/api/token";
  var user_id = localStorage["user_id"];
  
  console.log(localStorage["X-BeeOne-Auth"]);
  console.log(user_id);
  
  set_name();
  
  var setActive = function(account_index_name, element) {
    console.log("setActive");
    $li = $(element);
    console.log($li.data());
    // todo remove active from other lis
    $li.parent().children().removeClass("active");
    $li.addClass("active");
    // todo store default selection upon click to localstorage
    localStorage[account_index_name] = $("li").index($li);
  };
  
  load_parent_accounts();
  
  load_child_accounts();
  
  // select_index();
  
  $("#add_account_link").click(function() {
    $(this).hide();
    $("#add_account_form").show("fast");
  });
  
  $("#add_account_form").submit(function(e) {
    $("#ajax-spinner-child").show();
    var iban = $("#iban").val();
    // provjeri tko je vlasnik računa
    $.ajax(
      {
        url:baseUrl+"/user/" + user_id + "/search/all",
        data:{"q":iban, "token": localStorage["X-BeeOne-Auth"]},
        type:"GET",
        success: function(data, textStatus, response) {
          console.log(data);
          var $data = $.parseJSON(data);
          $("#ajax-spinner-child").hide();
          $("#account_owner").prepend($("<div>" + $data.accounts.userAccounts[0].name + "</div>").data($data.accounts.userAccounts[0])).show("fast");
        }
    });
    e.preventDefault();
  });
  
  $("#add_account_button").click(function() {
    $("<li style='display:none'><a href='#'>" + $("#iban").val() + "</a></li>").data($("#account_owner div").data()).appendTo($("#child_accounts")).show("fast")
      .click(function() {
        setActive("child_account_index", this);
      });
    save_child_accounts();
  });
  
  $("#child_accounts li").click(function() {
    setActive("child_account_index", this);
  });
  
  $("#suma_btn").click(function() {
    console.log($("#parent_accounts li.active").data());
    console.log($("#child_accounts li.active").data());
    var parent_account_data = $("#parent_accounts li.active").data();
    var child_account_data = $("#child_accounts li.active").data();
    $("#ajax-spinner-suma").show();
    
    var newtransaction = {};
    var kolkopara = parseInt($("#suma").val());
    newtransaction.amount = kolkopara;
    newtransaction.createdOn = new Date();
    newtransaction.senderName = localStorage["username"];
    newtransaction.senderIban = parent_account_data.iban;
    newtransaction.receiverName = child_account_data.name;
    newtransaction.receiverIban = child_account_data.name;
    
    $.ajax({
      url:baseUrl+"/user/" + user_id + "/accounts/" + parent_account_data.iban + "/transactions",
        data:
        {
          "token": localStorage["X-BeeOne-Auth"],
          amount: kolkopara,
          
        },
        type:"GET",
        success: function(data, textStatus, response) {
          console.log(data);
          $("#ajax-spinner-parent").hide();
          var $ul = $("<ul>");
          var $data = $.parseJSON(data);
          console.log($data);
          $data.forEach(function(element) {
            var euros = parseInt(Math.floor(element.availableFunds / 100));
            var cents = parseInt(element.availableFunds % 100);
            if (cents < 0) cents = -cents;
            console.log("euros: " + euros);
            var text = element.settings.name + " (" + euros + "," + cents + "€)" ;
            $("<li><a href='#'>" + text + "</a></li>").appendTo($ul).data(element)
            .click(function() {
              setActive("parent_account_index", this);
            });
          });
          $("#parent_accounts").prepend($ul.children()).show("fast");
          select_index("parent_account_index", "#parent_accounts");
        }
    });
  });
  
  function set_name() {
    $(".name").text(localStorage["username"]);
  }
  
  function load_parent_accounts() {
    $.ajax(
      {
        url:baseUrl+"/user/" + user_id + "/accounts",
        data:{"token": localStorage["X-BeeOne-Auth"]},
        type:"GET",
        success: function(data, textStatus, response) {
          console.log(data);
          $("#ajax-spinner-parent").hide();
          var $ul = $("<ul>");
          var $data = $.parseJSON(data);
          console.log($data);
          $data.forEach(function(element) {
            var euros = parseInt(Math.floor(element.availableFunds / 100));
            var cents = parseInt(element.availableFunds % 100);
            if (cents < 0) cents = -cents;
            console.log("euros: " + euros);
            var text = element.settings.name + " (" + euros + "," + cents + "€)" ;
            $("<li><a href='#'>" + text + "</a></li>").appendTo($ul).data(element)
            .click(function() {
              setActive("parent_account_index", this);
            });
          });
          $("#parent_accounts").prepend($ul.children()).show("fast");
          select_index("parent_account_index", "#parent_accounts");
        }
    });
  }
  
  function load_child_accounts() {
    var child_accounts_unescaped = localStorage["child_accounts"];
    if (child_accounts_unescaped) {
      var child_accounts = $(unescape(child_accounts_unescaped));
      child_accounts.appendTo($("#child_accounts"));
    }
  }
  
  function save_child_accounts() {
    var div=$('<div></div>');
    $("#child_accounts").children().clone().removeAttr("style").appendTo(div);
    localStorage["child_accounts"] = escape(div.html());
  }
  
  function select_index(account_index_name, id) {
    var account_index = localStorage[account_index_name];
    if (account_index) {
      $(id).eq(account_index).addClass("active");
    }
  }
});
