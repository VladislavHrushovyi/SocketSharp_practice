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
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.buttons !== 1) {
            return;
        }

        const ctx = canvas.current?.getContext("2d");
        if (ctx) {
            ctx!.beginPath();
            ctx!.lineWidth = toolbox.lineWidth;
            ctx!.lineCap = "round";
            ctx!.strokeStyle = toolbox.color;
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
        sendData({
            x: pos.x,
            y: pos.y,
            lineWidth: toolbox.lineWidth,
            color: toolbox.color
        });
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
                <Toolbox toolboxUtils={toolbox}/>
            </Col>
            <Col lg={5} className="">
                <canvas
                    className=""
                    ref={canvas}
                    onMouseMove={(e) => draw(e)}
                    onMouseDown={(e) => setPosition(e)}
                    onMouseEnter={(e) => setPosition(e)}
                    onMouseUp={endDrawing}
                ></canvas>
            </Col>
        </Row>
    );
}