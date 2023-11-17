import { Form, InputGroup } from "react-bootstrap"
import { MyButton } from "./MyButton"
import { ChangeEvent, useState } from "react"

interface ConnectionManagerProps {
    onConnect: (url: string) => void,
    onClose: () => void,
}

export const ConnectionManager = ({ onClose, onConnect }: ConnectionManagerProps) => {

    const [url, setUrl] = useState<string>("");

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value)
    }   

    function connect() {
        if(url !== ""){
            onConnect(url)
        }
    }

    function disconnect() {
        onClose()
    }

    return (
        <>
            <InputGroup className="mb-3">
                <InputGroup.Text 
                    id="basic-addon1"
                    className="px-2 py-3"
                    >
                        URL</InputGroup.Text>
                <Form.Control
                    className="w-[300px]"
                    placeholder="Connection string"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={url}
                    onChange={handleChange}
                />
            </InputGroup>
            <MyButton onClick={connect} text="Connect" />
            <MyButton onClick={disconnect} text="Disconnect" />
        </>
    )
}