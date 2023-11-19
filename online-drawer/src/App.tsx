import { Col, Row } from 'react-bootstrap'
import './App.css'
import { DrawField } from './components/DrawField'
import { useState } from 'react'
import { ConnectionState } from './components/ConnectionState';
import getInstance, { Connector } from "./client/signalrConnection"
import { ConnectionManager } from './components/ConnectionManager';
import { LineType } from './types/lineType';

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [imageData, setImageData] = useState<string>("");
  const [connector, setConnector] = useState<Connector>();

  const connect = (url: string) => {
    setConnector(_ => {
      const connector = getInstance(url);
      if (connector) {
        setIsConnected(true);
        connector?.events((data) => {
          setImageData(data)
        })
      }

      return connector;
    })
  }

  const applyNewImageData = (data: LineType) => {
    connector?.newMessage(JSON.stringify(data))
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
          <Row className='flex content-center items-center justify-center'>
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