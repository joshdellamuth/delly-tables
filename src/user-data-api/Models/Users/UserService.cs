using Microsoft.EntityFrameworkCore;
using UserApi.Models.Users.DTOs;
using UserApi.Data;

namespace UserApi.Models.Users;

public class UserService : IUserService
{
    private readonly UserDataContext _context;

    public UserService(UserDataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
    {
        return await _context.Users
            .Select(u => new UserResponse(
                u.Id,
                u.Name,
                u.Email,
                u.IsObsolete
            ))
            .ToListAsync();
    }
}