import { Button } from "react-bootstrap"

interface ConnectionManagerProps {
    onConnect: () => void,
    onClose: () => void,
}

export const ConnectionManager = ({onClose, onConnect}:ConnectionManagerProps) => {

    function connect() {
        onConnect()
      }
    
      function disconnect() {
        onClose()
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