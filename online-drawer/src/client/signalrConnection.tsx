import { HubConnection } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";

export class Connector {
    private connection : HubConnection;
    public events : (onMessageReceive: (data: string) => void) => void

    static instance: Connector;

    constructor(url: string){
        this.connection = new signalR.HubConnectionBuilder().withUrl(url).withAutomaticReconnect().build();
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

    public static getInstance(url: string): Connector {
        if(!Connector.instance){
            Connector.instance = new Connector(url);
        }

        return Connector.instance;
    }
}

export default Connector.getInstance;