/* 4.12 Updated for SocketIO */

//sets up all the required portions for the server
//change __dirName as needed
var http = require('http');
const express = require('express');
const app = express();
const port = 3000;
const __dirName = "C:/Users/kathu/Documents/VSCode/426gp";
const server = http.createServer(app);
const path = require('path');
const { Chart } = require("chart.js");

//has socket.io listening on the server for requests/responses of the temp data
var io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:8100",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

//used to show connectivity 
server.on("connection", socket => {
    console.log("Connected");
});

//sends html page to be read on the localhost:3000/
app.get('/', function (req, res) {
    res.sendFile(__dirName + '/public/index.html');
});

//grabs all other files in the public folder
app.use(express.static(path.join(__dirName, 'public')));
app.use(express.static(path.join(__dirName, 'public/css')));

//sets up reading the serial port and parsing the bits from the port
//where we get the info from the arduino
const { ReadlineParser } = require('serialport');
const { SerialPort } = require('serialport');

//makes port = the USB port that the arduino is in (for PC)
//path will need to change when using a MAC
var sPort = new SerialPort({
    path: 'COM3',
    baudRate: 9600,
    databits: 8,
    parity:'none',
    stopBits: 1,
    flowControl: false
});

//parses the info from the port into parser
const parser = sPort.pipe(new ReadlineParser({ delimiter: '\r\n' }))

//when the serial port is working, show on
//if the serial port is working, parse info through IO to script.js
sPort.on('open', () => {
    console.log("Serial Port On");
    parser.on('data', data => {
        io.emit('data', data);
        console.log(data);
    })
})

//listening to the port for the server
server.listen(port);