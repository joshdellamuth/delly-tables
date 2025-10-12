using System.ComponentModel.DataAnnotations;

namespace UserApi.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    public bool IsObsolete { get; set; } = false;


    public User(string name, string email)
    {
        Name = name;
        Email = email;
    }
}