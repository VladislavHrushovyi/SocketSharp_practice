using System.Net;
using System.Net.Sockets;
using System.Text;

namespace SimpleSocket;

public class SocketImageApplication
{
    private readonly IDictionary<int, TcpClient> _clients = new Dictionary<int, TcpClient>();
    private readonly ImageResource _imageResource = new ();
    private readonly object _lockObject = new();
    private readonly TcpListener _tcpListener;

    public SocketImageApplication(string ip, int port)
    {
        IPAddress localAddress = IPAddress.Parse(ip);
        _tcpListener = new TcpListener(localAddress, port);
        _tcpListener.Start();
    }

    public void ServerStart()
    {
        try
        {
            while (true)
            {
                TcpClient client = _tcpListener.AcceptTcpClient();

                lock (_lockObject) _clients.Add(_clients.Count + 1, client);
                Console.WriteLine($"Connected: {client.Client.AddressFamily}");

                Task.Run(() => HandleClient(_clients.Count));
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

    private async Task HandleClient(int clientsCount)
    {
        int id = clientsCount;
        TcpClient client;

        lock (_lockObject)
        {
            if (!_clients.ContainsKey(clientsCount))
            {
                return;
            }

            client = _clients[id];
        };
        try
        {
            while (true)
            {
                NetworkStream stream = client.GetStream();

                byte[] buffer = new byte[1024 * 1024];
                if (stream == null)
                {
                   break;
                }
                int byte_count = await stream.ReadAsync(buffer, 0, buffer.Length);

                if (byte_count == 0)
                {
                    // No data available, continue to the next iteration
                    break;
                }

                string data = Encoding.UTF8.GetString(buffer, 0, byte_count);
                _imageResource.Image = data;
                BroadcastData(_imageResource.Image);
                Console.WriteLine(_imageResource.Image + "OTUT");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
        finally
        {
            lock (_lockObject) _clients.Remove(id);
            client.Client.Shutdown(SocketShutdown.Both);
            Console.WriteLine("Client disconnected");
            client.Close();
        }
    }

    private void BroadcastData(string data)
    {
        byte[] buffer = Encoding.UTF8.GetBytes(data);
        Console.WriteLine("send " + buffer.Length + " bytes");
        lock (_lockObject)
        {
            foreach (var client in _clients.Values)
            {
                NetworkStream stream = client.GetStream();
                if (client != null)
                {
                    stream.Write(buffer, 0, buffer.Length);
                }
            }
        }
    }
}