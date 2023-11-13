import { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

interface DrawFieldProps{
    stringImage: string,
    setNewImageString: (data: string) => void;
}

export const DrawField = ({ stringImage, setNewImageString: sendImage }:DrawFieldProps) => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {

    }, []) 

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
        ctx!.canvas.width = 900;
        ctx!.canvas.height = 500;
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.buttons !== 1) {
            return;
        }

        const ctx = canvas.current?.getContext("2d");
        if (ctx) {
            ctx!.beginPath();
            ctx!.lineWidth = 5;
            ctx!.lineCap = "round";
            ctx!.strokeStyle = "red";
            ctx!.moveTo(pos.x, pos.y);
            setPosition(e);
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
        const ctx = canvas.current?.getContext("2d");
        const base64Canvas = canvas.current?.toDataURL().split(';base64,')[1];
        sendImage(base64Canvas!);
        const newImage = "data:image/png;base64,"+stringImage;
        const img = new Image();
        img.src = newImage;
        ctx?.drawImage(img, canvas.current?.width!, canvas.current?.height!)
    }

    useEffect(() => {
        resize();
    }, []);

    return (
        <Row>
            <Col>
                <canvas
                    ref={canvas}
                    onMouseMove={(e) => draw(e)}
                    onMouseDown={(e) => setPosition(e)}
                    onMouseEnter={(e) => setPosition(e)}
                    onMouseUp={endDrawing}
                ></canvas>
            </Col>
            <Col>
                <Button
                    onClick={clear}
                >
                    CLEAR
                </Button>
                <Button
                    onClick={resize}
                >
                    ReSIZE
                </Button>
            </Col>
        </Row>
    );
}