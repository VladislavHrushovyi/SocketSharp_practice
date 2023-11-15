import { Col, Row } from 'react-bootstrap'
import './App.css'
import { DrawField } from './components/DrawField'
import {useState } from 'react'
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';


function App() {
  const [isConnected, setConnected] = useState<boolean>(false);
  const [receivedMessage, setReceivedMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connect = () => {
    if (socket) {
      socket.close();
    }

    const newSocket = new WebSocket('ws://127.0.0.1:10000', 'websocket');
    newSocket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    newSocket.onopen = () => {
      setConnected(true);
      newSocket.send('aloo');
      console.log('WebSocket connection opened');
    };

    newSocket.onmessage = (event) => {
      const receivedData = event.data;
      setReceivedMessage(receivedData);
      console.log('Received:', receivedData);
    };

    newSocket.onclose = () => {
      setConnected(false);
      console.log('WebSocket connection closed');
    };

    setSocket(newSocket);
  };

  const closeSocket = () => {
    if (socket) {
      socket.close();
      setConnected(false);
      console.log('WebSocket connection closed');
    }
  };

  const sendMessage = (data: string) => {
    if (socket) {
      socket.send(data);
    }
  };

  return (
    <>
      <Col>
        <Row>
          <h1>Малювалка</h1>
        </Row>
        <Row>
          <Col>
            <ConnectionState isConnected={isConnected} />
          </Col>
          <Col>
            <ConnectionManager onConnect={connect} onClose={closeSocket} />
          </Col>
        </Row>
        <Row>
          <DrawField setNewImageString={sendMessage} stringImage={receivedMessage} />
        </Row>
      </Col>
    </>
  );
}

export default App;