using SocketIOSharp.Server;

namespace ImageDrawingSocketIo;

public class ImageSocketChangerApp
{
    private readonly SocketIOServer _ioServer;

    public ImageSocketChangerApp(int port)
    {
        _ioServer = new SocketIOServer(new SocketIOServerOption(3000));
    }

    public void ServerStart()
    {
        _ioServer.OnConnection((sender) =>
        {
            Console.WriteLine($"Client connected: {sender.Server}");
        });
        
    }
}