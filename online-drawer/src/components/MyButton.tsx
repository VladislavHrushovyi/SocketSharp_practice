import { Button } from "react-bootstrap"

interface MyButtonProps {
    onClick: () => void,
    text: string
}

export const MyButton = ({ onClick, text }: MyButtonProps) => {
    return (
        <>
            <Button
                className="border-2 px-2 py-2 rounded hover:bg-blue-300 hover:text-black"
                onClick={onClick}
            >
                {text}
            </Button>
        </>
    )
}