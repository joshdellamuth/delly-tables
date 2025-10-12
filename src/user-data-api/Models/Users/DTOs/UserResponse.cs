namespace UserApi.Models.Users.DTOs;

public record UserResponse(
    Guid Id,
    string Name,
    string Email,
    bool IsObsolete
);