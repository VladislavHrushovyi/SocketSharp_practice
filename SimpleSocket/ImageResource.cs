namespace SimpleSocket;

public sealed class ImageResource
{
    private string _imageBase64 = string.Empty;

    public string Image
    {
        get => _imageBase64;
        set
        {
            if (!string.IsNullOrEmpty(value))
            {
                _imageBase64 = value;
            }  
        }
    }
}