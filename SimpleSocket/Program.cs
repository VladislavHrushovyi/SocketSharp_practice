
using SimpleSocket;

var server = new SocketTableApplication("127.0.0.1", 10000);
server.ServerStart();
Console.Read();