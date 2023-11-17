interface ConnectionStateProps {
    isConnected: boolean
}

export const ConnectionState = ({ isConnected }: ConnectionStateProps) => {

    return (
        <>
            <h3>{ 'Connection ' + isConnected }</h3>
        </>
    )
}