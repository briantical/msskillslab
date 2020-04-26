using System;
namespace msskillslab.Models
{
    public class Account
    {
        public string _id { get; set; }

        public decimal balance { get; set; }

        public string userId { get; set; }

        public string createdDate { get; set; }

        public string modifiedDate { get; set; }
    }
}
