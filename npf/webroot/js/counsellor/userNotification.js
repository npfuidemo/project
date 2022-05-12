//var nameInput = document.getElementById("name-input"),
//	messageInput = document.getElementById("message-input");
//
//function handleKeyUp(e) {
//	if (e.keyCode === 13) {
//		sendMessage();
//	}
//}
//function sendMessage() {
//	var name = nameInput.value.trim(),
//		message = messageInput.value.trim();
//
//	if (!name)
//		return alert("Please fill in the name");
//
//	if (!message)
//		return alert("Please write a message");
//
//	var ajax = new XMLHttpRequest();
//	ajax.open("POST", "php-send-message.php", true);
//	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//	ajax.send("name=" + name + "&message=" + message);
//
//	messageInput.value = "";
//}
//var userId = window.userId;
// web sockets
window.WebSocket = window.WebSocket || window.MozWebSocket;

var connection = new WebSocket('wss://testqanoden.nopaperforms.in?uid=' + window.userId);
var connectingSpan = document.getElementById("connecting");
connection.onopen = function () {
    connectingSpan.style.display = "none";
};
connection.onerror = function (error) {
    connectingSpan.innerHTML = "Not able to connect.";
};
connection.onmessage = function (message) {
    var data = JSON.parse(message.data);

    var notificationCountSpan = document.getElementById("notificationCount");
    notificationCountSpan.style.display = "block";
    notificationCountSpan.innerHTML = data.count;
    
//    var div = document.createElement("div");
//    var author = document.createElement("span");
//    author.className = "author";
//    author.innerHTML = data.count;
//    var message = document.createElement("span");
//    message.className = "messsage-text";
//    message.innerHTML = data.message;
//
//    div.appendChild(author);
//    div.appendChild(message);
//
//    document.getElementById("message-box").appendChild(div);

}

// A connection was closed
connection.onclose = function(code, reason) {
    connection.close();
}

// Close the connection when the window is closed
window.addEventListener('beforeunload', function() {
    connection.close();
});