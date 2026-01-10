using Microsoft.OpenApi.Models;
using UserApi.Data;
using Microsoft.EntityFrameworkCore;
using UserApi.Models.Users;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);


// Fix: Use the correct method to add the DbContext with Npgsql
builder.Services.AddDbContext<UserDataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register the services
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Creates the endpoint /openapi/v1.json
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/openapi/v1.json", "User API V1");
    });

    //app.UseReDoc(options =>
    //{
    //    options.SpecUrl = "/openapi/v1.json";
    //});
}   

app.MapUserEndpoints();

app.MapGet("api/example-hello-world", () => "Hello World!");

app.Run();
