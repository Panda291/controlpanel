var url = "https://controlpanel.ovde.be/api"
var accessToken
var panel = ""
var header
var add = "<div id='add'><form><input type='button' value='new' onclick='addnew()'</form></div>"
var addform = ""
var editpanel = "name: <input type='text' name='name' id='name' class='field' /><br />pin[0 - 40]: <input type='text' name='pin' id='pin' class='field' /><br /><input type='button' value='update' onclick='update("
var check = true

$(document).ready(function(){

    // jQuery methods go here...
    var url = "https://controlpanel.ovde.be/api"
    var accessToken
    var panel = ""
    $("#panel").hide()
    $("#addpanel").hide()
    $("#errorpanel").hide()
    $("#editpanel").hide()
});

$("#loginbutton").click(() => {
    var username = $("#username").val()
    var password = $("#password").val()
    
    data = { "username": username, "password": password }
    login(username, password)
});

function enable(id) {
    $.ajax({
        url: url + '/output/' + id + '/enable',
        dataType: "json",
        type: 'GET',
        headers: header,
        success: (r) => {
            list()
        }
    });
};

function list() {
    $("#editpanel").hide()
    $("#login").hide()
    $("#addpanel").hide()
    $("#errorpanel").hide()
    $.ajax({
         url: url + '/output',
         dataType: "json",
         type: 'GET',
         headers: header,
         success: (r) => {
             panel = ""
             for (entry in r.data)
             {
                 //console.log()
                 console.log(r.data[entry])
                 //console.log(entry.name)
                 panel = panel + "<div id='entry'>naam: " + r.data[entry].name + "<br />pin: " + r.data[entry].pin + "<br />active: " + r.data[entry].active + "<br /><form><input type='button' value='disable' onclick='disable(" + r.data[entry].id + ")' /><input type='button' value='enable' onclick='enable(" + r.data[entry].id + ")' /><input type='button' value='remove' onclick='remove(" + r.data[entry].id + ")' /><input type='button' value='edit' onclick='edit(" + r.data[entry].id + ",\"" + r.data[entry].name + "\",\"" + r.data[entry].pin + "\")' /></form></div>"
             }
             $("#panel").show()
             $("#panel").html(panel + add)
         }
    })
 };

 function login(username, password) {
    $.ajax({
        url: url + "/login",
        dataType: "json",
        type : "POST",
        data: { username, password },
        success : (r) => {
          accessToken = r.data.accessToken
          header = {
            'Authorization': "Bearer " + accessToken,
            'Accept': 'application/json'}
            list(header)
        },
        error: (r) => {
            if (check)
            {
                $("#login").append("<p class='error'>error: username or password wrong</p>")
                check = false
            }
        }
      });
};

function disable(id) {
    $.ajax({
        url: url + '/output/' + id + '/disable',
        dataType: "json",
        type: 'GET',
        headers: header,
        success: (r) => {
            list(header)
        }
    });
};

function addnew() {
    $("#errorpanel").hide()
    $("#panel").hide()
    $("#addpanel").show()
};

function create() {
    pin = $("#newpin").val()
    name = $("#newname").val()
    pin = parseInt(pin)
    console.log(name)
    console.log(pin)
    $.ajax({
        url: url + '/output',
        dataType: 'json',
        type: 'POST',
        headers: header,
        data: { "name": name, "pin": pin },
        success: (r) => {
            console.log(r)
            $("#panel").show()
            $("#addpanel").hide()
            list()
        },
        error: (r) => {
            console.log(r)
            errorpanel = "<p>name: " + r.responseJSON.errors.name + "</p><p>pin: " + r.responseJSON.errors.pin + "</p><form><input type='button' value='return' onclick='addnew()' /></form>"
            $("#addpanel").hide()
            $("#errorpanel").show()
            $("#errorpanel").html(errorpanel)
        }
    });
};

function remove(id) {
    $.ajax({
        url: url + '/output/' + id,
        dataType: 'json',
        type: 'DELETE',
        headers:header,
        success: (r) => {
            list()
        }
    });
};

function showlist() {
    $("#editpanel").hide()
    $("#addpanel").hide()
    $("#panel").show()
};

function edit(id, name, pin) {
    $("#panel").hide()
    $("#errorpanel").hide()
    $("#editpanel").show()
    $("#editpanel").html("name: <input type='text' name='name' id='editname' class='field' value='" + name + "'/><br />pin[0 - 40]: <input type='text' name='pin' id='editpin' class='field' value='" + pin + "'/><br /><input type='button' value='update' onclick='update(" + id + ")' /><input type='button' value='return' onclick='showlist()' />")
};

function update(id) {
    name = $("#editname").val()
    pin = parseInt($("#editpin").val())
    
    $.ajax({
        url: url + '/output/' + id,
        dataType: 'json',
        type: 'PUT',
        headers: header,
        data: {name, pin},
        success: (r) => {
            list()
        },
        error: (r) => {
            errorpanel = "<p>name: " + r.responseJSON.errors.name + "</p><p>pin: " + r.responseJSON.errors.pin + "</p><form><input type='button' value='return' onclick='edit(" + id + ",\"" + name + "\",\"" + pin + "\")' /></form>"
            $("#editpanel").hide()
            $("#errorpanel").show()
            $("#errorpanel").html(errorpanel)
        }
    });
};