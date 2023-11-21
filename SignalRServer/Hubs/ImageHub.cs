using Microsoft.AspNetCore.SignalR;

namespace SignalRServer.Hubs;

public class ImageHub : Hub
{
    private static int _countConnection = 0;
    public async Task NewMessage(string data)
    {
        await Clients.All.SendAsync("ImageReceived", data);
    }

    public override Task OnConnectedAsync()
    {
        _countConnection++;
        Console.WriteLine($"Users: {_countConnection}");
        this.Clients.All.SendAsync("AmountConnection",_countConnection);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _countConnection--;
        Console.WriteLine($"Users: {_countConnection}");
        this.Clients.All.SendAsync("AmountConnection",_countConnection);
        return base.OnDisconnectedAsync(exception);
    }
}