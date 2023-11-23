import { HexColorPicker } from "react-colorful"

interface ColorPickerProps {
    handleColor: (colorHex: string) => void,
    color: string
}

export const ColorPicker = ({ handleColor, color }: ColorPickerProps) => {
    return (
        <>
            <HexColorPicker
                className=""
                color={color}
                onChange={(e) => {
                    handleColor(e);
                }} />
        </>
    )
}