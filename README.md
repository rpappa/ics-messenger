## Backend usage:

1) open a terminal window (window > new terminal)

2) navigate to the directory this file is in

3) install nodejs-websocket with npm ("npm i nodejs-websocket")

4) run the file with node.js ("node server.js")

## Frontend usage:

1) copy function connectToServer from frontend.js

2) create a new server instance

    var server = connectToServer(...)
    
## Example usage:
````
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

/////////////////////////////////
// INSERT connectToServer HERE //
/////////////////////////////////

function connectToServer(url, onopen) {
    ...
````
