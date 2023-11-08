// See https://aka.ms/new-console-template for more information

using SimpleClient;

var sender  = new SocketSenderMessage("127.0.0.1", 10000);
var text = string.Empty;
while (text != "exit")
{
    text = Console.ReadLine();
    sender.SendMessage(text);
}