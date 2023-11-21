import { MutableRefObject, useState } from "react";

export interface ToolboxUtils {
    color: string,
    lineWidth: number,
    changeColor: (color: string) => void,
    changeLineWidth: (width: number) => void,
    clear: () => void
}

export const useToolbox = (canvas : MutableRefObject<HTMLCanvasElement | null>) : ToolboxUtils => {

    const [color, setColor] = useState<string>("#000000")
    const [lineWidth, setLineWidth] = useState<number>(12);

    const changeColor = (color: string) => {
        setColor(color);
    }

    const changeLineWidth = (width: number) => {
        setLineWidth(width);
    }

    const clear = () => {
        if(canvas){
            const ctx = canvas.current?.getContext("2d");
             ctx?.beginPath();
            ctx?.clearRect(0, 0, canvas.current?.width!, canvas.current?.height!);
        }
    };

    return {
        color,
        lineWidth,
        changeColor,
        changeLineWidth,
        clear
    }
}