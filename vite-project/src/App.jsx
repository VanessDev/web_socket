import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  function btnClick() {
    socket.emit("bouton", "coucou les gens");
  }

  useEffect(() => {
    socket.on("bouton_reponse", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("bouton_reponse");
    };
  }, []);

  function envoyer() {
    if(message.trim === "") 
    {
      return
    }

    setMessages((prev) => [...prev, "Moi:" + message]);
    
      
  }

  return (
    <>
      <h1>Exo websocket</h1>

      <button onClick={btnClick}>Test</button>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={envoyer}>Envoyer</button>

      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </>
  );
}

export default App;
