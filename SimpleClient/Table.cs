using System.Text;

namespace SimpleClient;

public class Table
{
    private readonly int[,] _table = { { 0, 0, 0 }, { 0, 0, 0 }, { 0, 0, 0 } };
    private readonly object _lock = new();

    public void UpdateTable(Command command)
    {
        _table[command.i, command.j] = command.value;
    }
    
    public void UpdateTable(string data)
    {
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
    }
    
    public string ConvertTableToString()
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
}