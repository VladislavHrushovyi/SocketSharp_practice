import { Row } from "react-bootstrap"
import { LineWidthRange } from "./LineWidthRange"
import { ColorPicker } from "./ColorPicker"
import { MyButton } from "./MyButton"
import { ToolboxUtils } from "../hooks/useToolbox"

interface ToolboxProps {
    toolboxUtils: ToolboxUtils
}

export const Toolbox = ({toolboxUtils}: ToolboxProps) => {
    return (
        <>
            <Row>
                <ColorPicker handleColor={toolboxUtils.changeColor} color={toolboxUtils.color} />
            </Row>
            <Row>
                <LineWidthRange width={toolboxUtils.lineWidth} handleLineWidth={toolboxUtils.changeLineWidth} />
            </Row>
            <Row>
                <MyButton onClick={toolboxUtils.clear} text="Clear" />
            </Row>
        </>
    )
}