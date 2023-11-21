import { useState } from "react";
import { LineType } from "../types/lineType";
import { Connector } from "./signalrConnection";

export const connectionHandler = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connector, setConnector] = useState<Connector>();
    const [imageData, setImageData] = useState<string>("");
    const [userCount, setUserCount] = useState<number>(0);

    const connect = (url: string) => {
        setConnector(_ => {
          const connector = Connector.getInstance(url);
          if (connector) {
            setIsConnected(true);
            connector?.events((data) => {
              setImageData(data)
            }, 
            (count) =>{
              setUserCount(count);
            })
          }
    
          return connector;
        })
      }
    
      const applyNewImageData = (data: LineType) => {
        connector?.newMessage(JSON.stringify(data))
      }
    
      const disconnect = () => {
        setIsConnected(false);
      }
    return {
        isConnected,
        imageData,
        userCount,
        connect,
        applyNewImageData,
        disconnect
    }
}