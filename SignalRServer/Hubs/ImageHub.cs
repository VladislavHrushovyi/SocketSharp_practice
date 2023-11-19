using Microsoft.AspNetCore.SignalR;

namespace SignalRServer.Hubs;

public class ImageHub : Hub
{
    public async Task NewMessage(string data)
    {
        await Clients.All.SendAsync("ImageReceived", data);
    }
}