using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using CustomTable.Authorization.Roles;
using CustomTable.Authorization.Users;
using CustomTable.MultiTenancy;

namespace CustomTable.EntityFrameworkCore
{
    public class CustomTableDbContext : AbpZeroDbContext<Tenant, Role, User, CustomTableDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public CustomTableDbContext(DbContextOptions<CustomTableDbContext> options)
            : base(options)
        {
        }
    }
}
