/* --------------------------
        Example Usage
   --------------------------*/
   
// connect to a websocket server at the given url. the object server is your connection
var server = connectToServer('wss://url.io', function() {
    // set the room we are chatting in
    server.setRoom('---chat room---');
    
    // add a handler for a raw data message (mostly for testing, not necessary)
    server.onRawMessage((event) => {
        console.log('Server: ' + event.data);
    });
    
    // add a handler for an actual chat message. handler function takes two arguments:
    // text: the body of the message
    // user: the user who sent the message
    server.onChatMessage((text, user) => {
       console.log(user + ': ' + text) 
       $('body').append('<span>' + user + ": " + text + "</span><br>")
    });
    
    // send a chat message
    server.sendChatMessage('text', 'username');
    
    // list the available chat rooms
    server.listRooms((rooms, pops) => {
        console.log(rooms);
        console.log(pops);
    });
});

// include this
function connectToServer(url, onopen) {
    var instance = {};
    
    instance.connection = new WebSocket(url);
    
    instance.connection.onmessage = function(e) {
        try {
            var obj = JSON.parse(e.data);
            if(obj.chat) {
                instance.chatHandler(obj.chat.text, obj.chat.username);
            } else if (obj.roomList && obj.roomPops) {
                if(instance.listRoomCallback) {
                    instance.listRoomCallback(obj.roomList, obj.roomPops);
                }
            } else {
                instance.rawHandler(e);
            }
        } catch (err) {
            instance.rawHandler(e);
        }
    };
    
    if(onopen) {
        instance.connection.onopen = onopen;
    }
    
    instance.sendRawMessage = (message) => {
        instance.connection.send(message);
    }
    
    instance.onRawMessage = (handler) => {
        instance.rawHandler = handler;
    }
    
    instance.room = -1;
    
    instance.setRoom = (room) => {
        instance.connection.send(JSON.stringify({'room': room}));
        instance.room = room;
    }
    
    instance.listRooms = (callback) => {
        instance.connection.send(JSON.stringify({'command': 'rooms'}));
        instance.listRoomCallback = callback;
    }
    
    instance.sendChatMessage = (text, username) => {
        instance.connection.send(JSON.stringify({
            'chat': {
                'text':text,
                'username':username
            }
        }));
    }
    
    instance.onChatMessage = (handler) => {
        instance.chatHandler = handler;
    }
    
    return instance;
}