using System.Threading.Tasks;
using Abp.Application.Services;
using CustomTable.Sessions.Dto;

namespace CustomTable.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
