import { Col, Row } from 'react-bootstrap'
import './App.css'
import { DrawField } from './components/DrawField'
import { useEffect, useState } from 'react'
import { socket } from './client/clientSocket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';


function App() {

  const [isConnected, setConnected] = useState<boolean>(socket.connected);
  const [stringImage, setStringImage] = useState<string>("");


  const sendImage = (data: string) => {
    console.log("send image")
    socket.emit("new data", data, function(dataFromServer: string){
      console.log(dataFromServer + "allo")
    })
  }

  useEffect(() => {
    function onConnect(){
      setConnected(true)
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onChangeImageString(value:string) {
      setStringImage(_ => value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('change iamge', onChangeImageString);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onChangeImageString);
    };
  },[])

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
            <ConnectionManager />
          </Col>
        </Row>
        <Row>
          <DrawField stringImage={stringImage} sendImage={sendImage} />
        </Row>
      </Col>
    </>
  )
}

export default App
