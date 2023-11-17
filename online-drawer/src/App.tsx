import { Col, Row } from 'react-bootstrap'
import './App.css'
import { DrawField } from './components/DrawField'
import { useState } from 'react'
import { ConnectionState } from './components/ConnectionState';
import getInstance, { Connector } from "./client/signalrConnection"
import { ConnectionManager } from './components/ConnectionManager';

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [imageData, setImageData] = useState<string>("");
  const [connector, setConnector] = useState<Connector>();

  const connect = () => {
    setConnector(_ => {
      const connector = getInstance();
      if (connector) {
        setIsConnected(true);
        connector?.events((data) => {
          console.log("Receive data")
          setImageData(data)
        })
      }

      return connector;
    })
  }

  const applyNewImageData = (data: string) => {
    connector?.newMessage(data)
  }

  const disconnect = () => {
    setIsConnected(false);
  }

  return (
    <>
      <Row className=''>
        <Col>
          <h1 className='text-lg'>Малювалка</h1>
        </Col>
        <Col className='flex-row'>
          <Row>
            <ConnectionState isConnected={isConnected} />
          </Row>
          <Row>
            <ConnectionManager onConnect={connect} onClose={disconnect} />
          </Row>
        </Col>
        <Row>
          <DrawField sendImage={applyNewImageData} data={imageData} />
        </Row>
      </Row>
    </>
  );
}

export default App;