using Microsoft.AspNetCore.SignalR;

namespace SignalRServer.Hubs;

public class ImageHub : Hub
{
    private readonly ImageResource _imageResource = new();
    public async Task NewMessage(string data)
    {
        Console.WriteLine("RECEIVE REQ");
        Console.WriteLine(string.Join("",data.Skip(data.Length - 20).Take(20)));
        _imageResource.ImageBase64 = data;
        await Clients.All.SendAsync("ImageReceived", _imageResource.ImageBase64);
    }
}