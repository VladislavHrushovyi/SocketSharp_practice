import { HubConnection } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";

const URL = "http://localhost:5002/image";

export class Connector {
    private connection : HubConnection;
    public events : (onMessageReceive: (data: string) => void) => void

    static instance: Connector;

    constructor(){
        this.connection = new signalR.HubConnectionBuilder().withUrl(URL).withAutomaticReconnect().build();
        this.connection.start().catch(err => console.log(err));

        this.events = (onImageReceived) => {
            this.connection.on("ImageReceived", (data) => {
                console.log("received data")
                onImageReceived(data);
            })
        }
    }

    public newMessage = (data: string) => {
        console.log("send req")
        this.connection.send("NewMessage", data).then(_ => console.log("sent"));
    }

    public static getInstance(): Connector {
        if(!Connector.instance){
            Connector.instance = new Connector();
        }

        return Connector.instance;
    }
}

export default Connector.getInstance;