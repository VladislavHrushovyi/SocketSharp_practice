using Microsoft.AspNetCore.Http.Connections;
using SignalRServer.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(opt =>
{
    opt.MaximumReceiveMessageSize = 1024 * 1000;
    opt.EnableDetailedErrors = true;
});
builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(x => x.AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());
app.UseHttpsRedirection();

app.MapHub<ImageHub>("/image", opt =>
{
    opt.TransportMaxBufferSize = 1024 * 500;
    opt.Transports = HttpTransportType.WebSockets;
    opt.TransportSendTimeout = TimeSpan.FromSeconds(10);
});

app.Run();