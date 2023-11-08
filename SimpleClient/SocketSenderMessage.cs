using System.Net;
using System.Net.Sockets;
using System.Text;

namespace SimpleClient;

public class SocketSenderMessage
{
    private readonly TcpClient _tcpClient;
    public SocketSenderMessage(string ip, int port)
    {
        _tcpClient = new TcpClient();
        _tcpClient.Connect(ip, port);
    }

    public void SendMessage(string text)
    {
        try
        {
            using NetworkStream stream = _tcpClient.GetStream();
            byte[] data = Encoding.ASCII.GetBytes(text);
            stream.Write(data, 0, data.Length);


            data = new byte[256];
            string responseText = String.Empty;
            int readBytes = stream.Read(data, 0, data.Length);
            responseText = Encoding.ASCII.GetString(data, 0, readBytes);
            Console.WriteLine("Відповідь: " + responseText);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}