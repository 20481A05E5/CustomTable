using Abp.Authorization;
using CustomTable.Authorization.Roles;
using CustomTable.Authorization.Users;

namespace CustomTable.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
