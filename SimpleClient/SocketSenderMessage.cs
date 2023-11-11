using System.Net.Sockets;
using System.Text;

namespace SimpleClient;

public class SocketSenderMessage
{
    private readonly TcpClient _tcpClient;
    private readonly NetworkStream _stream;
    private readonly object _lock = new();
    private int[,] _table = { { 0, 0, 0 }, { 0, 0, 0 }, { 0, 0, 0 } };
    public SocketSenderMessage(string ip, int port)
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
            var entryData = s.Split(" ", StringSplitOptions.RemoveEmptyEntries);
            if (entryData.Length == 3)
            {
                var i = int.Parse(entryData[0]);
                var j = int.Parse(entryData[1]);
                var value = int.Parse(entryData[2]);
                _table[i, j] = value;
                s = ConvertTableToString();
                lock (_lock)
                {
                    byte[] buffer = Encoding.ASCII.GetBytes(s);
                    _stream.Write(buffer, 0, buffer.Length);   
                }

                //ReceiveData(_tcpClient);
            }
        }
        
        _tcpClient.Client.Shutdown(SocketShutdown.Send);
        _stream.Close();
        _tcpClient.Close();
        Console.WriteLine("User has been disconected");
        Console.Read();
    }

    private string ConvertTableToString()
    {
        var sb = new StringBuilder();
        for (int i = 0; i < _table.GetLength(0); i++)
        {
            for (int j = 0; j < _table.GetLength(1); j++)
            {
                sb.Append(_table[i, j]).Append(' ');
            }

            sb.AppendLine();
        }

        return sb.ToString();
    }
    private Task ReceiveData(TcpClient tcpC)
    {
        var stream = tcpC.GetStream();
        byte[] buffer = new byte[1024];
        int byteCount;
        
        while ((byteCount = stream.Read(buffer, 0, buffer.Length)) > 0)
        {
            string data = Encoding.ASCII.GetString(buffer, 0, byteCount);
            lock (_lock)
            {
                string[] rows = data.Split("\n", StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < rows.Length; i++)
                {
                    var values = rows[i].Split(" ", StringSplitOptions.RemoveEmptyEntries);
                    for (int j = 0; j < values.Length; j++)
                    {
                        if (int.TryParse(values[j], out int value))
                        {
                            _table[i, j] = value;
                        }
                    }
                }
            }
            Console.Clear();
            Console.WriteLine(data);
        }
        
        return Task.CompletedTask;
    }
}