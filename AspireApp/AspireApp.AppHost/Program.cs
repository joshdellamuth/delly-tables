// Create the distributed application builder
var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var apiService = builder.AddProject<Projects.AspireApp_ApiService>("apiservice");

builder.AddProject<Projects.AspireApp_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService);


var api = builder.AddProject<Projects.user_data_api>("user-api");

// Call Build() to materialize the configuration into a runnable AppHost.
// Call Run() to start orchestration; services launch in dependency order.
builder.Build().Run();
