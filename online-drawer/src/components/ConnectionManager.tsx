import { MyButton } from "./MyButton"

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
            <MyButton onClick={connect} text="Connect"/>
            <MyButton onClick={disconnect} text="Disconnect"/>
        </>
    )
}