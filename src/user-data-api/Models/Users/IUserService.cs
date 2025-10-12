using UserApi.Models.Users.DTOs;

namespace UserApi.Models.Users;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetAllUsersAsync();
}