// Importe Socket depuis le module dgram (non utilisé ici)
const { Socket } = require("dgram"); 
// Importe Express pour créer le serveur
const express = require("express"); 
// Importe le module http
const http = require('http'); 
// Importe le serveur Socket.IO
const { Server } = require('socket.io'); 

// Crée l'application Express
const app = express(); 

// Crée un serveur HTTP avec Express
const server = http.createServer(app); 



const io = new Server(server, {
  cors: {
    // Autorise les requêtes depuis ce site
    origin: "http://localhost:5173", 
    // Autorise ces méthodes
    methods: ["GET", "POST"] 
  }
});

// Quand un utilisateur se connecte
io.on("connection", (socket) => { 
  socket.on("bouton", (data) =>{
    console.log(data, socket.id)
  socket.broadcast.emit("bouton_reponse",data);
  })
});

// Le serveur écoute sur le port 3000
server.listen(3000, () => ( 
    // Message de confirmation
  console.log('server OK') 
));
