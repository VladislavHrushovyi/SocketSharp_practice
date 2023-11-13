
using SimpleSocket;

var server = new SocketImageApplication("127.0.0.1", 10000);
server.ServerStart();
Console.Read();