// Importe les hooks React
import { useEffect, useState } from "react"; 
// Importe le fichier CSS
import "./App.css"; 
// Importe le client Socket.io
import { io } from "socket.io-client"; 


// Se connecte au serveur Socket.io
const socket = io("http://localhost:3000"); 

function App() { 
  // Stocke le message écrit
  const [message, setMessage] = useState(""); 
  // Stocke tous les messages
  const [messages, setMessages] = useState([]); 
  // Stocke le nom de l'utilisateur
  const [name, setName] = useState(''); 
  const [counter,setCounter] = useState(0);
  const [inputcounter, set inputcounter] = useState(0);

  // Fonction du bouton Test
  function btnClick() { 
    // Envoie un message au serveur
    socket.emit("bouton", "coucou les gens"); 
  }


// S'exécute au chargement du composant
  useEffect(() => { 

// Écoute la réponse du serveur
    socket.on("bouton_reponse", (data) => { 
      // Affiche la réponse dans la console
      console.log(data); 
    });

    // Écoute les messages reçus
    socket.on("message_reponse", (data) => { 
      // Ajoute le message à la liste
      setMessages((prev) => [...prev, data[0] + ": " + data[1]]); 
    });


    // Nettoyage à la fermeture du composant
    return () => { 
      // Supprime l'écoute du bouton
      socket.off("bouton_reponse"); 
      // Supprime l'écoute des messages
      socket.off("message_reponse"); 
    };
  }, []); // Le useEffect s'exécute une seule fois


  // Fonction du bouton Envoyer
  function envoyer() { 
    // Vérifie si le message est vide (⚠ petite erreur ici)
    if (message.trim === "") { 
      // Arrête la fonction
      return; 
    }

    // Ajoute mon message à l'écran
    setMessages((prev) => [...prev, "Moi:" + message]); 

    // Envoie le message au serveur
    socket.emit("message", message); 
    socket.emit("message", [name, message]); // Envoie le nom + message
  }

  return ( // Affichage du composant
    <>
      <input type="text"
        value={name} // Valeur du champ = name
        onChange={(e) => setName(e.target.value)} // Met à jour le name
      />

      <div>{counter}</div>
      <input type="number"
      value={inputcounter}
      onChange={(e) => setInputCounter(e.target.value)}
      />

      <button onClick={incrementer}>Incrementer</button>

      <h1>Exo websocket</h1> // Titre de la page

      <button onClick={btnClick}>Test</button> // Bouton qui envoie "coucou les gens"

      <input
        type="text"
        value={message} // Valeur du champ = message
        onChange={(e) => setMessage(e.target.value)} // Met à jour le message
      />

      <button onClick={envoyer}>Envoyer</button> // Bouton d'envoi du message

      <div>
        {messages.map((message, index) => ( // Parcourt tous les messages
          <div key={index}>{message}</div> // Affiche chaque message
        ))}
      </div>
    </>
  );
}

export default App; // Exporte le composant
