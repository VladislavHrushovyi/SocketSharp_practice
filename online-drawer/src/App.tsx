import { Col, Row } from 'react-bootstrap'
import './App.css'
import { DrawField } from './components/DrawField'


function App() {

  return (
    <>
      <Col>
        <Row>
          <h1>Малювалка</h1>
        </Row>
        <Row>
        <DrawField />
        </Row>
      </Col>
    </>
  )
}

export default App
