using Abp.Application.Services;
using CustomTable.MultiTenancy.Dto;

namespace CustomTable.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

