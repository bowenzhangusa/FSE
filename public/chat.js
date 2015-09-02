window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
 
    socket.on('message', function (data) {
       console.log("inside chat.js"); 
       if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
	       if (messages[i].username) {
	           html += '<b>' + messages[i].username + ': </b>';
		}
		html += messages[i].message + '<br />';
               if (messages[i].username) {
                   html += messages[i].timestamp + '<br />';
	       }
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
       if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
	    var currentDate = new Date();
            socket.emit('send', { message: text, username: name.value, timestamp: new Date() });
        }
    };
 
}
