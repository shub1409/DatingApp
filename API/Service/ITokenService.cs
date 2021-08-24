using API.Entities;

namespace API.Service
{
    public interface ITokenService
    {
        string CreateToken(AppUser appUser);
    }
}