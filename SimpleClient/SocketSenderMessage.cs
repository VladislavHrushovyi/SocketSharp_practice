using System.Net.Sockets;
using System.Text;

namespace SimpleClient;

public class SocketSenderMessage
{
    private readonly TcpClient _tcpClient;
    private readonly NetworkStream _stream;
    public SocketSenderMessage(string ip, int port)
    {
        _tcpClient = new TcpClient();
        _tcpClient.Connect(ip, port);
        _stream = _tcpClient.GetStream();
    }

    public void SendMessage(string text)
    {
        var thread = new Thread((tcpClient) => ReceiveData((TcpClient)tcpClient));
        thread.Start(_tcpClient);

        string s = String.Empty;
        while (!string.IsNullOrEmpty(s = Console.ReadLine()))
        {
            byte[] buffer = Encoding.ASCII.GetBytes(s);
            _stream.Write(buffer, 0, buffer.Length);
        }
        
        _tcpClient.Client.Shutdown(SocketShutdown.Send);
        thread.Join();
        _stream.Close();
        _tcpClient.Close();
        Console.WriteLine("User has been disconected");
        Console.Read();
    }
    private Task ReceiveData(TcpClient tcpC)
    {
        var stream = tcpC.GetStream();
        byte[] buffer = new byte[1024];
        int byteCount;
        
        while ((byteCount = stream.Read(buffer, 0, buffer.Length)) > 0)
        {
            Console.WriteLine(Encoding.ASCII.GetString(buffer, 0, byteCount));
        }
        
        return Task.CompletedTask;
    }
}