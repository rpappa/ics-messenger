/* server.js

Backend server for a chat site.
Usage:
1) open a terminal window (window > new terminal)
2) navigate to the directory this file is in
3) install nodejs-websocket with npm ("npm i nodejs-websocket")
4) run the file with node.js ("node server.js")

Note to those reading this code, especially in the context of Intro to Computer Science:
There is heavy usage of javascript arrow functions, aka "fat arrows", notated like
(param1, param2, ...) => { ... }
This is equivalent to
function(param1, param2, ...) { ... }
Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

Copyright (c) 2016 Ryan Pappa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var http = require('http');
var ws = require("nodejs-websocket")

var connections = [];
var rooms = {rooms:[], pops:[]};

var server = ws.createServer((conn) => {
    // console.log("New connection")
    conn.room = Math.random();
    conn.on("text", (str) => {
        // console.log("Received "+str)
        
        try {
            var object = JSON.parse(str);
            if(object.room) {
                conn.room = object.room;
                rooms = {rooms:[], pops:[]};;
                for(i = 0; i < connections.length; i++) {
                    var index = rooms.rooms.indexOf(connections[i].room);
                    if(index == -1) {
                        rooms.rooms.push(connections[i].room);
                        rooms.pops.push(1);
                    } else {
                        rooms.pops[index]+=1;
                    }
                }
                console.log(rooms);
            }
            if(object.chat) {
                for(i = 0; i < connections.length; i++) {
                    if(connections[i].room == conn.room) {
                        connections[i].sendText(JSON.stringify(object))
                    }
                }
            }
            if(object.command) {
                if(object.command == 'rooms') {
                    conn.sendText(JSON.stringify({'roomList': rooms.rooms, 'roomPops': rooms.pops}))
                }
            }
        } catch (err) {
            conn.sendText(str.toUpperCase()+" RECEIVED")
        }
    });
    // console.log(connections);
    
    conn.on("close", (code, reason) => {
        // console.log("Connection closed")
        
        var index = rooms.rooms.indexOf(conn.room);
        if(rooms.pops[index] == 1) {
            rooms.rooms.splice(index, 1);
            rooms.pops.splice(index, 1);
        } else {
            rooms.pops[index] -= 1;
        }
        
        index = connections.indexOf(conn);
 
        if (index > -1) {
           connections.splice(index, 1);
        }
        console.log(rooms);
    });
    connections.push(conn);
}).listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0")

// http.createServer((req, res) => {
//     console.log('req');
//     res.end('test');
// }).listen(process.env.PORT || 80, process.env.IP || "0.0.0.0");