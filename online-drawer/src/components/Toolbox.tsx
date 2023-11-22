import { Button, Row } from "react-bootstrap"
import { LineWidthRange } from "./LineWidthRange"
import { ColorPicker } from "./ColorPicker"
import { MyButton } from "./MyButton"
import { ToolboxUtils } from "../hooks/useToolbox"
import { EraserFill, Eyedropper, PencilFill } from "react-bootstrap-icons"
interface ToolboxProps {
    toolboxUtils: ToolboxUtils
}

export const Toolbox = ({toolboxUtils}: ToolboxProps) => {
    return (
        <>
            <Row>
                <ColorPicker handleColor={toolboxUtils.changeColor} color={toolboxUtils.color} />
            </Row>
            <Row className="py-4 flex justify-center space-x-4" >
                <Button className="border rounded-lg p-2 hover:bg-green-300"> 
                    <PencilFill size={20}/> 
                </Button >
                <Button className="border rounded-lg p-2 hover:bg-green-300">
                    <EraserFill size={20}/>
                </Button>
                <Button className="border rounded-lg p-2 hover:bg-green-300">
                    <Eyedropper size={20}/>
                </Button>
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