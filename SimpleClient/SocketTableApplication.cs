using System.Net.Sockets;
using System.Text;

namespace SimpleClient;

public class SocketTableApplication
{
    private readonly TcpClient _tcpClient;
    private readonly NetworkStream _stream;
    private readonly Table _table = new ();
    private readonly object _lock = new();
    
    public SocketTableApplication(string ip, int port)
    {
        _tcpClient = new TcpClient();
        _tcpClient.Connect(ip, port);
        _stream = _tcpClient.GetStream();
    }

    public void SendMessage()
    {
        var task = Task.Run(() => ReceiveData(_tcpClient));

        string s = String.Empty;
        while (!string.IsNullOrEmpty(s = Console.ReadLine()))
        {
            if (!string.IsNullOrEmpty(s))
            {
                // Command command = new(s);
                // _table.UpdateTable(command);
                // s = _table.ConvertTableToString();
                
                lock (_lock)
                {
                    byte[] buffer = Encoding.ASCII.GetBytes(s);
                    _stream.Write(buffer, 0, buffer.Length);   
                }
            }
        }
        
        _tcpClient.Client.Shutdown(SocketShutdown.Send);
        lock (_lock)
        {
            _stream.Close();
        }
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
            string data = Encoding.ASCII.GetString(buffer, 0, byteCount);
            
            //lock(_lock) _table.UpdateTable(data);
            
            Console.Clear();
            //Console.WriteLine(_table.ConvertTableToString());
            Console.WriteLine(data);
        }
        
        return Task.CompletedTask;
    }
}