import {useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";

export const DrawField = () => {
    const canvas = useRef<HTMLCanvasElement>();
    const [pos, setPos] = useState({x:0,y:0});

    const setPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setPos({
            x: e.clientX,
            y: e.clientY
        });
    };

    const resize = () => {
        const ctx = canvas.current?.getContext("2d");
        ctx!.canvas.width = window.innerWidth;
        ctx!.canvas.height = window.innerHeight;
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.buttons !== 1) {
            return;
        }
        const ctx = canvas.current?.getContext("2d");
        ctx!.beginPath();
        ctx!.lineWidth = 10;
        ctx!.lineCap = "butt";
        ctx!.strokeStyle = "green";
        ctx!.moveTo(pos.x, pos.y);
        setPosition(e);
        ctx!.lineTo(pos.x, pos.y);
        ctx!.stroke();
    };

    const clear = () => {
        const ctx = canvas.current?.getContext("2d");
        ctx?.clearRect(0,0, canvas.current?.width!, canvas.current?.height!);
    }

    useEffect(() => {
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <div>
            <style>
                {`
          #canvas {
            border: 1px solid black;
          }
        `}
            </style>
            <canvas
                ref={canvas}
                onMouseMove={draw}
                onMouseDown={setPosition}
                onMouseEnter={setPosition}
                id="canvas"
            ></canvas>
            <Button
                onClick={clear}
            >
                CLEAR
            </Button>
        </div>
    );
}