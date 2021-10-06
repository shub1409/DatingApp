using System.Threading.Tasks;
using API.Entities;

namespace API.Service
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser appUser);
    }
}