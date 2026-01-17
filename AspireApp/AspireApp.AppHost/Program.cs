// Create the distributed application builder
using Aspire.Hosting;


var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var apiService = builder.AddProject<Projects.AspireApp_ApiService>("apiservice");

builder.AddProject<Projects.AspireApp_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService);

// Pull the connection string from appsettings.Development.json. 
//var cosmosConnectionString = "";


var api = builder.AddProject<Projects.user_data_api>("user-api");


var elasticsearch = builder.AddElasticsearch("elasticsearch")
    .WithEnvironment("xpack.security.enabled", "false");

var kibana = builder.AddContainer("kibana", "docker.elastic.co/kibana/kibana", "8.15.0")
    .WithReference(elasticsearch)
    .WithHttpEndpoint(port: 5601, targetPort: 5601, name:"kibana-http", isProxied:true)
    .WaitFor(elasticsearch);

var ui = builder.AddJavaScriptApp("main-ui", "../../src/delly-tables-ui")
    .WithHttpEndpoint(name: "ui-http", env: "PORT");

// Call Build() to materialize the configuration into a runnable AppHost.
// Call Run() to start orchestration; services launch in dependency order.
builder.Build().Run();
