import { Button } from "react-bootstrap"
import { socket } from "../client/clientSocket";

export const ConnectionManager = () => {

    function connect() {
        socket.connect();
      }
    
      function disconnect() {
        socket.disconnect();
      }

    return (
        <>
            <Button
                onClick={connect}
            >
                Connect
            </Button>
            <Button
                onClick={disconnect}
            >
                Disconnect
            </Button>
        </>
    )
}