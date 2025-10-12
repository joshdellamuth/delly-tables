using Microsoft.OpenApi.Models;
using UserApi.Data;
using Microsoft.EntityFrameworkCore;
using UserApi.Models.Users;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<UserDataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


// Register the services
builder.Services.AddScoped<IUserService, UserService>();



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "User API", Version = "v1" });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "User API V1");
    });
}

app.MapUserEndpoints();

app.MapGet("api/example-hello-world", () => "Hello World!");


app.Run();
