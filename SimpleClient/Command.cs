namespace SimpleClient;

public class Command
{
    public int i;
    public int j;
    public int value;

    public Command(string stringCommand)
    {
        var commandSplit = stringCommand.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        i = int.Parse(commandSplit[0]);
        j = int.Parse(commandSplit[1]);
        value = int.Parse(commandSplit[2]);
    }
}