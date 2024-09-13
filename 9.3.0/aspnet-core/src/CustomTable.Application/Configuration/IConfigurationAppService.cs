using System.Threading.Tasks;
using CustomTable.Configuration.Dto;

namespace CustomTable.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
