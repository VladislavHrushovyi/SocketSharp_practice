using System.Text;

namespace SimpleSocket;

public class TableResource
{
    private readonly int[,] _table =
    {
        { 1, 1, 1 },
        { 2, 2, 2 },
        { 3, 3, 3 }
    };
    
    public string Text = "Initial";
    
    public string ConvertTableToString()
    {
        var builder = new StringBuilder();
        for (int i = 0; i < _table.GetLength(0); i++)
        {
            for (int j = 0; j < _table.GetLength(1); j++)
            {
                builder.Append(_table[i, j].ToString()).Append(' ');
            }

            builder.AppendLine();
        }

        return builder.ToString();
    }
    
    public void UpdateTable(string tableString)
    {
        string[] rows = tableString.Split("\n", StringSplitOptions.RemoveEmptyEntries);
        
        for (int i = 0; i < _table.GetLength(0); i++)
        {
            string[] values = rows[i].Split(" ", StringSplitOptions.RemoveEmptyEntries);
            for (int j = 0; j < _table.GetLength(1); j++)
            {
                if (int.TryParse(values[j], out int intValue))
                {
                    _table[i, j] = intValue;
                }
            }
        }
    }
}