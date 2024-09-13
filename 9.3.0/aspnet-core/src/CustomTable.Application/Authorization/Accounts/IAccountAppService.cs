using System.Threading.Tasks;
using Abp.Application.Services;
using CustomTable.Authorization.Accounts.Dto;

namespace CustomTable.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
