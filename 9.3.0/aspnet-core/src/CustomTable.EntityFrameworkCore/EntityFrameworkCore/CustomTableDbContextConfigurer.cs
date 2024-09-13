using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace CustomTable.EntityFrameworkCore
{
    public static class CustomTableDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<CustomTableDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<CustomTableDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
