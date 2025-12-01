// Importe les hooks React
import { useEffect, useState } from "react";
// Importe le fichier CSS
import "./App.css";
// Importe le client Socket.io
import { io } from "socket.io-client";

// Se connecte au serveur Socket.io
const socket = io("http://localhost:3000");

function App() {
  // Stocke le message écrit (chat)
  const [message, setMessage] = useState("");
  // Stocke tous les messages du chat
  const [messages, setMessages] = useState([]);
  // Stocke le nom de l'utilisateur
  const [name, setName] = useState("");
  // Stocke le total partagé reçu du serveur
  const [counter, setCounter] = useState(0);
  // Valeur saisie dans l'input pour envoyer un nombre
  const [inputCounter, setInputCounter] = useState("");

  // Bouton "Test" (exercice précédent)
  function btnClick() {
    socket.emit("bouton", "coucou les gens");
  }

  // Bouton "Envoyer le nombre" (envoie la valeur de inputCounter au serveur)
  function envoyerNombre() {
    const value = Number(inputCounter);
    if (isNaN(value)) return;
    // on envoie le nombre + le nom au serveur
    socket.emit("send_number", { name, value });
    setInputCounter("");
  }

  // Bouton "Incrementer" (demande au serveur d'ajouter 1 au total)
  function incrementer() {
    socket.emit("increment_number", { name });
  }

  // Bouton "Envoyer" du chat
  function envoyerMessage() {
    if (message.trim() === "") {
      return;
    }

    // Ajoute mon message en local
    setMessages((prev) => [...prev, "Moi: " + message]);

    // Envoie le message au serveur (avec le nom)
    socket.emit("message", [name, message]);

    setMessage("");
  }

  // S'exécute au chargement du composant
  useEffect(() => {
    // Réponse du bouton "Test"
    socket.on("bouton_reponse", (data) => {
      console.log(data);
    });

    // Messages reçus du serveur (chat)
    socket.on("message_reponse", (data) => {
      setMessages((prev) => [...prev, data[0] + ": " + data[1]]);
    });

    // Mise à jour du compteur partagé
    socket.on("counter_update", (data) => {
      // data = { total, from }
      setCounter(data.total);
      setMessages((prev) => [
        ...prev,
        `Serveur: total = ${data.total} (modifié par ${data.from})`,
      ]);
    });

    // Nettoyage à la fermeture du composant
    return () => {
      socket.off("bouton_reponse");
      socket.off("message_reponse");
      socket.off("counter_update");
    };
  }, []);

  // Affichage du composant
  return (
    <>
      {/* Nom */}
      <input
        type="text"
        placeholder="Ton nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Affichage du total partagé */}
      <h2>Total partagé : {counter}</h2>

      {/* Envoi d'un nombre de départ */}
      <input
        type="number"
        placeholder="Nombre à envoyer"
        value={inputCounter}
        onChange={(e) => setInputCounter(e.target.value)}
      />
      <button onClick={envoyerNombre}>Envoyer le nombre</button>

      {/* Incrément (+1) */}
      <button onClick={incrementer}>Incrementer (+1)</button>

      <h1>Exo websocket</h1>

      {/* Bouton test de l'exercice précédent */}
      <button onClick={btnClick}>Test</button>

      {/* Chat */}
      <input
        type="text"
        placeholder="Ton message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={envoyerMessage}>Envoyer</button>

      {/* Liste des messages */}
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </>
  );
}

export default App;
