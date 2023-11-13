// See https://aka.ms/new-console-template for more information

using SimpleClient;

var sender  = new SocketTableApplication("127.0.0.1", 10000);
sender.SendMessage();