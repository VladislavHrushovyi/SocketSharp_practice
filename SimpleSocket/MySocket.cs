using System.Net;
using System.Net.Sockets;
using System.Text;

public class MySocket
{
    private readonly TcpListener _tcpListener;

    public MySocket(string ip, int port)
    {
        IPAddress localAddress = IPAddress.Parse(ip);
        _tcpListener = new TcpListener(localAddress, port);
    }

    public void ServerStart()
    {
        _tcpListener.Start();
        try
        {
            while (true)
            {
                TcpClient client = _tcpListener.AcceptTcpClient();

                NetworkStream stream = client.GetStream();
                byte[] data = new byte[256];
                int bytesRead = stream.Read(data, 0, data.Length);
                string message = Encoding.ASCII.GetString(data, 0, data.Length);
                Console.WriteLine("Користувач: " + message);
                byte[] reply = Encoding.ASCII.GetBytes("Повідомлення отримано");
                stream.Write(reply, 0, reply.Length);

                client.Close();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        finally
        {
            _tcpListener.Stop();
        }
    }
}