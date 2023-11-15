using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

public class SocketServerAnother
{
    private readonly List<TcpClient> _clients = new List<TcpClient>();
    private TcpListener _listener;

    public async Task Start(string ip, int port)
    {
        try
        {
            _listener = new TcpListener(IPAddress.Parse(ip), port);
            _listener.Start();

            Console.WriteLine($"Server started on {ip}:{port}");

            while (true)
            {
                TcpClient client = await _listener.AcceptTcpClientAsync();
                _clients.Add(client);

                _ = HandleClient(client);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
        finally
        {
            _listener.Stop();
        }
    }

    private async Task HandleClient(TcpClient client)
    {
        try
        {
            NetworkStream stream = client.GetStream();

            byte[] buffer = new byte[1024 * 50];
            int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);

            string request = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            if (IsWebSocketHandshake(request))
            {
                await SendWebSocketAcceptHeader(stream, request);
                Console.WriteLine("WebSocket connection established");
                await ReceiveWebSocketData(client);
            }
            else
            {
                Console.WriteLine("Invalid WebSocket handshake");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
        finally
        {
            _clients.Remove(client);
            client.Close();
            Console.WriteLine("Client disconnected");
        }
    }

    private bool IsWebSocketHandshake(string request)
    {
        return request.Contains("Upgrade: websocket") && request.Contains("Connection: Upgrade");
    }

    private async Task SendWebSocketAcceptHeader(NetworkStream stream, string request)
    {
        const string webSocketGuid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        string key = GetWebSocketKey(request);

        using (SHA1 sha1 = SHA1.Create())
        {
            byte[] hash = sha1.ComputeHash(Encoding.UTF8.GetBytes(key + webSocketGuid));
            string acceptKey = Convert.ToBase64String(hash);

            string response = "HTTP/1.1 101 Switching Protocols\r\n" +
                              "Upgrade: websocket\r\n" +
                              "Connection: Upgrade\r\n" +
                              $"Sec-WebSocket-Accept: {acceptKey}\r\n\r\n";

            byte[] responseBytes = Encoding.UTF8.GetBytes(response);
            await stream.WriteAsync(responseBytes, 0, responseBytes.Length);
        }
    }

    private string GetWebSocketKey(string request)
    {
        const string keyField = "Sec-WebSocket-Key: ";
        int start = request.IndexOf(keyField) + keyField.Length;
        int end = request.IndexOf("\r\n", start);
        return request.Substring(start, end - start).Trim();
    }

    private async Task ReceiveWebSocketData(TcpClient client)
    {
        NetworkStream stream = client.GetStream();

        while (true)
        {
            byte[] headerBuffer = new byte[2];
            await stream.ReadAsync(headerBuffer, 0, 2);

            byte opcode = (byte)(headerBuffer[0] & 0x0F);
            bool isFinalFrame = (headerBuffer[0] & 0x80) != 0;

            if (opcode == 0x8) // Connection close frame
            {
                break;
            }

            byte[] payload = await ReadWebSocketPayload(stream, headerBuffer[1]);
            string message = Encoding.UTF8.GetString(payload);

            Console.WriteLine($"Received: {message}");

            if (isFinalFrame)
            {
                BroadcastData(message);
            }
        }

        Console.WriteLine("WebSocket connection closed");
    }

    private async Task<byte[]> ReadWebSocketPayload(NetworkStream stream, byte payloadLength)
    {
        int length = payloadLength & 0x7F;

        if (length == 126)
        {
            byte[] lengthBytes = new byte[2];
            await stream.ReadAsync(lengthBytes, 0, 2);
            length = BitConverter.ToUInt16(lengthBytes, 0);
        }
        else if (length == 127)
        {
            byte[] lengthBytes = new byte[8];
            await stream.ReadAsync(lengthBytes, 0, 8);
            length = (int)BitConverter.ToUInt64(lengthBytes, 0);
        }

        byte[] mask = new byte[4];
        await stream.ReadAsync(mask, 0, 4);

        byte[] payload = new byte[length];
        await stream.ReadAsync(payload, 0, length);

        for (int i = 0; i < length; i++)
        {
            payload[i] ^= mask[i % 4];
        }

        return payload;
    }

    private void BroadcastData(string data)
    {
        byte[] payload = Encoding.UTF8.GetBytes(data);

        foreach (var client in _clients)
        {
            if (client.Connected)
            {
                NetworkStream stream = client.GetStream();

                byte[] header = new byte[2];
                header[0] = 0x81; // Text frame opcode
                header[1] = (byte)payload.Length;

                stream.Write(header, 0, header.Length);
                stream.Write(payload, 0, payload.Length);
            }
        }
    }
}

