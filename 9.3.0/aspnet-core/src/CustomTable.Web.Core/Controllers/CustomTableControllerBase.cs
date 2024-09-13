using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace CustomTable.Controllers
{
    public abstract class CustomTableControllerBase: AbpController
    {
        protected CustomTableControllerBase()
        {
            LocalizationSourceName = CustomTableConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
