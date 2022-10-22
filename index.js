const httpServer = require('http').createServer()
const socketIO = require('socket.io')(httpServer)
const express = require('express');
const app = express();
var port = process.env.PORT || 3000;

app.use(express.json());
var clients = {};

socketIO.on('connection', (socket)=> {
  console.log('Connected...', socket.id);  
  socket.on("signin", (id) => {
    clients[id]=socket;
    console.log(id);
  })

  //listens for new messages coming in
  socket.on('message', (data)=> {
    console.log(data);
    //socketIO.emit('message', data);
    let targetId=data.targetId;
    if (clients[targetId]) clients[targetId].emit('message', data);
  });

  //check
  app.route("/check").get((req,res)=>{
    return res.json("Your app working fine :)");
  });

  //listens when a user is disconnected from the server
  socket.on('disconnect', ()=> {
    console.log('Disconnected...', socket.id);
  });

//listens when there's an error detected and logs the error on the console
  socket.on('error', (err)=> {
    console.log('Error detected', socket.id);
    console.log(err);
  })
});

httpServer.listen(port, (err)=> {
  if (err) console.log(err);
  console.log('Listening on port', port);
});
