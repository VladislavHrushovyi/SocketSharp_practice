import { MutableRefObject, useState } from "react";


export interface TypeDrawing {
    buttonsDrawing: {
        isSimpleDrawing: boolean;
        isEraserDrawing: boolean;
        isPipetka: boolean;
    },
    onEraser: () => void;
    onPipetka: () => void;
    onSimpleDrawing: () => void;
}

export const useTypeDrawing = (canvas: MutableRefObject<HTMLCanvasElement | null>, settings: { color: string, lineWidth: number, changeColor: (color: string) => void }) : TypeDrawing => {
    const [buttonsDrawing, setButtonsDrawing] = useState({ isSimpleDrawing: true, isEraserDrawing: false, isPipetka: false });

    const onSimpleDrawing = () => {
        console.log(settings.lineWidth)
        const ctx = canvas.current?.getContext("2d");
        ctx!.lineWidth = settings.lineWidth;
        ctx!.lineCap = "round";
        ctx!.strokeStyle = settings.color;
        setButtonsDrawing(_ => {
            return {
                isEraserDrawing: false,
                isPipetka: false,
                isSimpleDrawing: true,
            }
        })
    }

    const onEraser = () => {
        const ctx = canvas.current?.getContext("2d");
        ctx!.lineWidth = settings.lineWidth;
        ctx!.lineCap = "round";
        ctx!.strokeStyle = "#ffffff";
        setButtonsDrawing(_ => {
            return {
                isEraserDrawing: true,
                isPipetka: false,
                isSimpleDrawing: false,
            }
        })
    }

    const onPipetka = () => {
        setButtonsDrawing(_ => {
            return {
                isEraserDrawing: false,
                isPipetka: true,
                isSimpleDrawing: false,
            }
        })
    }

    return {
        buttonsDrawing,
        onEraser,
        onPipetka,
        onSimpleDrawing
    }
}