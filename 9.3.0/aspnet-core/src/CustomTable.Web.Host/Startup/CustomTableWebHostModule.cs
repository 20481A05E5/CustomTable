using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using CustomTable.Configuration;

namespace CustomTable.Web.Host.Startup
{
    [DependsOn(
       typeof(CustomTableWebCoreModule))]
    public class CustomTableWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public CustomTableWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CustomTableWebHostModule).GetAssembly());
        }
    }
}
