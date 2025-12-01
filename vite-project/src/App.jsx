import './App.css'
import { io } from 'socket.io-client'


const socket = io("http://localhost:3000");

function App() {
 

  return (
    <>
  <h1>Exo websocket</h1>
    </>
  )
}

export default App
