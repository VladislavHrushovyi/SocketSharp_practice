interface ConnectionStateProps {
    isConnected: boolean,
    userCount: number
}

export const ConnectionState = ({ isConnected, userCount }: ConnectionStateProps) => {

    return (
        <>
            <h3>{'Connection ' + isConnected}</h3>
            <h3>{'Users: ' + userCount}</h3>
        </>
    )
}