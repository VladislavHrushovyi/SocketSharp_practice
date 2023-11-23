import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { LineType } from "../types/lineType";
import { Toolbox } from "./Toolbox";
import { useToolbox } from "../hooks/useToolbox";

interface DrawFieldProps {
    sendImage: (data: LineType) => void,
    data: string
}

export const DrawField = ({ sendImage: sendData, data }: DrawFieldProps) => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const toolbox = useToolbox(canvas);
    const setPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.buttons !== 1) {
            return;
        }

        const canvasRect = canvas.current?.getBoundingClientRect();
        if (canvasRect) {
            setPos({
                x: e.clientX - canvasRect.left,
                y: e.clientY - canvasRect.top
            });
        }
    };



    const resize = () => {
        const ctx = canvas.current?.getContext("2d");
        ctx!.canvas.width = 1000;
        ctx!.canvas.height = 600;
        if (ctx) {
            ctx!.lineWidth = toolbox.lineWidth;
            ctx!.lineCap = "round";
            ctx!.strokeStyle = toolbox.color;
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(toolbox.typeDrawing.buttonsDrawing.isPipetka) return;
        if (e.buttons !== 1) {
            return;
        }

        const ctx = canvas.current?.getContext("2d");
        if (ctx) {
            ctx!.beginPath();
            ctx!.moveTo(pos.x, pos.y);
            setPosition(e);
            sendData({
                x: pos.x,
                y: pos.y,
                lineWidth: toolbox.lineWidth,
                color: toolbox.color
            });
            ctx!.lineTo(pos.x, pos.y);
            ctx!.stroke();
        }
    };


    const endDrawing = () => {
        if(toolbox.typeDrawing.buttonsDrawing.isPipetka) return;
        sendData({
            x: pos.x,
            y: pos.y,
            lineWidth: toolbox.lineWidth,
            color: toolbox.color
        });
    }

    const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (toolbox.typeDrawing.buttonsDrawing.isPipetka) {
            const bounding = canvas.current?.getBoundingClientRect();
            const ctx = canvas.current?.getContext("2d");
            const x = e.clientX - bounding!.left;
            const y = e.clientY - bounding!.top;
            const pixel = ctx!.getImageData(x, y, 1, 1);
            const data = pixel.data;

            const hexColor = `#${data[0].toString(16)}${data[1].toString(16)}${data[2].toString(16)}`;
            toolbox.changeColor(hexColor)
        }
    }

    useEffect(() => {
        resize();

    }, []);

    useEffect(() => {
        function changeImage() {
            if (data !== "") {
                const ctx = canvas.current?.getContext("2d");
                if (ctx) {
                    const dotData: LineType = JSON.parse(data)
                    ctx!.beginPath();
                    ctx!.lineWidth = dotData.lineWidth;
                    ctx!.lineCap = "round";
                    ctx!.strokeStyle = dotData.color;
                    ctx!.moveTo(dotData.x, dotData.y);
                    ctx!.lineTo(dotData.x, dotData.y);
                    ctx!.stroke();
                }
            }
        }

        changeImage()
    }, [data]);

    return (
        <Row className="flex gap-3">
            <Col md={2} lg={2} className="">
                <Toolbox toolboxUtils={toolbox} />
            </Col>
            <Col lg={5} className="">
                <canvas
                    className=""
                    ref={canvas}
                    onMouseMove={(e) => draw(e)}
                    onMouseDown={(e) => setPosition(e)}
                    onMouseEnter={(e) => setPosition(e)}
                    onMouseUp={endDrawing}
                    onClick={onClick}
                ></canvas>
            </Col>
        </Row>
    );
}