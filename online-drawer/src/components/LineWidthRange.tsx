import { ChangeEvent } from "react"
import { Form } from "react-bootstrap"

interface LineWidthRangeProps {
    handleLineWidth: (width: number) => void,
    width: number
}

export const LineWidthRange = ({handleLineWidth, width}:LineWidthRangeProps) => {

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        handleLineWidth(e.target.valueAsNumber)
    }

    return (
        <>
            <Form.Range min={1} max={25} value={width} onChange={handleChange}/>
        </>
    )
}