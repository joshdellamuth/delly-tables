using UserApi.Models.Users.DTOs;

namespace UserApi.Models.Users;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users")
            .WithOpenApi();  // For Swagger documentation

        // GET /api/users
        group.MapGet("/", GetAllUsers)
            .WithName("GetAllUsers")
            .WithSummary("Get all users")
            .Produces<IEnumerable<UserResponse>>(StatusCodes.Status200OK);
    }

    private static async Task<IResult> GetAllUsers(IUserService userService)
    {
        var users = await userService.GetAllUsersAsync();
        return Results.Ok(users);
    }
}