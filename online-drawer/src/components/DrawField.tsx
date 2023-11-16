import { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

interface DrawFieldProps {
    sendImage: (data: string) => void,
    data: string
}

export const DrawField = ({ sendImage, data }: DrawFieldProps) => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

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
            ctx!.lineWidth = 15;
            ctx!.lineCap = "round";
            ctx!.strokeStyle = "black";
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
        const base64Canvas = canvas.current?.toDataURL();
        console.log(base64Canvas)
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