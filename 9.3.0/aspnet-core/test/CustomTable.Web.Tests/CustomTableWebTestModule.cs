using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using CustomTable.EntityFrameworkCore;
using CustomTable.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace CustomTable.Web.Tests
{
    [DependsOn(
        typeof(CustomTableWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class CustomTableWebTestModule : AbpModule
    {
        public CustomTableWebTestModule(CustomTableEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CustomTableWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(CustomTableWebMvcModule).Assembly);
        }
    }
}