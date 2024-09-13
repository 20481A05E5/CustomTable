using System.ComponentModel.DataAnnotations;

namespace CustomTable.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}