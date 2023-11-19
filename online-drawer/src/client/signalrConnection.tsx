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
                onImageReceived(data);
            })
        }
    }

    public newMessage = (data: string) => {
        this.connection.send("NewMessage", data);
    }

    public static getInstance(url: string): Connector {
        if(!Connector.instance){
            Connector.instance = new Connector(url);
        }

        return Connector.instance;
    }
}

export default Connector.getInstance;