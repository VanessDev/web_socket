// Importe Express pour créer le serveur
const express = require("express");
// Importe le module http
const http = require("http");
// Importe le serveur Socket.IO
const { Server } = require("socket.io");

// Crée l'application Express
const app = express();

// Crée un serveur HTTP avec Express
const server = http.createServer(app);

// Crée l'instance Socket.IO avec la config CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Front autorisé
    methods: ["GET", "POST"],        // Méthodes autorisées
  },
});

// Total partagé entre tous les utilisateurs
let total = 0;

// Quand un utilisateur se connecte
io.on("connection", (socket) => {
  console.log("Un utilisateur connecté :", socket.id);

  // ----- Exercice "bouton" (test) -----
  socket.on("bouton", (data) => {
    console.log("Event bouton :", data, "de", socket.id);
    // renvoie aux autres (sans l'émetteur)
    socket.broadcast.emit("bouton_reponse", data);
  });

  // ----- Chat -----
  socket.on("message", (data) => {
    console.log("Message reçu :", data);
    // renvoie à tous les autres
    socket.broadcast.emit("message_reponse", data);
  });

  // ----- Exercice compteur : envoi d'un nombre -----
  socket.on("send_number", ({ name, value }) => {
    console.log(`Nombre reçu de ${name} :`, value);
    total += value; // on ajoute au total
    // on informe tout le monde du nouveau total
    io.emit("counter_update", { total, from: name || "inconnu" });
  });

  // ----- Exercice compteur : incrément +1 -----
  socket.on("increment_number", ({ name }) => {
    console.log(`Incrément +1 demandé par ${name}`);
    total += 1;
    // on informe tout le monde du nouveau total
    io.emit("counter_update", { total, from: name || "inconnu" });
  });
});

// Le serveur écoute sur le port 3000
server.listen(3000, () => {
  console.log("server OK");
});
