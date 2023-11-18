import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { ColorPicker } from "./ColorPicker";
import { LineWidthRange } from "./LineWidthRange";
import { MyButton } from "./MyButton";

interface DrawFieldProps {
    sendImage: (data: string) => void,
    data: string
}

export const DrawField = ({ sendImage, data }: DrawFieldProps) => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [color, setColor] = useState<string>("#ffffff")
    const [lineWidth, setLineWidth] = useState<number>(12); 

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

    const changeColor = (color: string) => {
        setColor(color);
    }

    const changeLineWidth = (width: number) => {
        setLineWidth(width);
    }

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
            ctx!.lineWidth = lineWidth;
            ctx!.lineCap = "round";
            ctx!.strokeStyle = color;
            ctx!.moveTo(pos.x, pos.y);
            setPosition(e);
            const base64Canvas = canvas.current?.toDataURL();
            sendImage(base64Canvas!);
            ctx!.lineTo(pos.x, pos.y);
            ctx!.stroke();
        }
    };

    const clear = () => {
        const ctx = canvas.current?.getContext("2d");
        ctx?.beginPath();
        ctx?.clearRect(0, 0, canvas.current?.width!, canvas.current?.height!);
    };

    const endDrawing = () => {
        const base64Canvas = canvas.current?.toDataURL();
        sendImage(base64Canvas!);
    }

    useEffect(() => {
        resize();
    }, []);

    useEffect(() => {
        function changeImage() {
            console.log("effect")
            if (data !== "") {
                const ctx = canvas.current?.getContext("2d");
                const newImage = new Image();
                newImage.onload = () => {
                    ctx?.clearRect(0, 0, canvas.current?.width!, canvas.current?.height!);
                    ctx?.drawImage(newImage, 0, 0);
                };
                newImage.src = data;
            }
        }

        changeImage()
    }, [data]);

    return (
        <Row className="flex gap-3">
            <Col md={2} lg={2} className="">
                <Row>
                    <ColorPicker handleColor={changeColor} color={color} />
                </Row>
                <Row>
                    <LineWidthRange width={lineWidth} handleLineWidth={changeLineWidth}/>
                </Row>
                <Row>
                    <MyButton onClick={clear} text="Clear"/>
                </Row>
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