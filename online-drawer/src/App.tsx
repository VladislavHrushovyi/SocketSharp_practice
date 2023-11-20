import { Col, Row } from 'react-bootstrap'
import './App.css'
import { DrawField } from './components/DrawField'
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { connectionHandler } from './client/connectionHandler';

function App() {
  const connHandler = connectionHandler();
  return (
    <>
      <Row className=''>
        <Col>
          <h1 className='text-lg'>Малювалка</h1>
        </Col>
        <Col className='flex-row'>
          <Row>
            <ConnectionState isConnected={connHandler.isConnected} />
          </Row>
          <Row className='flex content-center items-center justify-center'>
            <ConnectionManager onConnect={connHandler.connect} onClose={connHandler.disconnect} />
          </Row>
        </Col>
        <Row>
          <DrawField sendImage={connHandler.applyNewImageData} data={connHandler.imageData} />
        </Row>
      </Row>
    </>
  );
}

export default App;