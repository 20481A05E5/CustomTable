using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using CustomTable.Authorization;

namespace CustomTable
{
    [DependsOn(
        typeof(CustomTableCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class CustomTableApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<CustomTableAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(CustomTableApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
