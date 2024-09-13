using CustomTable.Debugging;

namespace CustomTable
{
    public class CustomTableConsts
    {
        public const string LocalizationSourceName = "CustomTable";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "7c33310faacf400bba971a038872fe5d";
    }
}
