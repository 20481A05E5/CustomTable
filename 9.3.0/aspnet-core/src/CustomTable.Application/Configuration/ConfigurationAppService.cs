using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using CustomTable.Configuration.Dto;

namespace CustomTable.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : CustomTableAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
