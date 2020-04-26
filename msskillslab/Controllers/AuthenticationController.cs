﻿using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using msskillslab.MongoDBHelper;

namespace msskillslab.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        public AuthenticationController()
        {
        }

        [HttpPost("signin")]
        public object SignIn([FromBody] SignInPayload input)
        {
            try
            {
                FilterDefinition<BsonDocument>[] filters = new FilterDefinition<BsonDocument>[]
                    { Builders<BsonDocument>.Filter.Eq("email", input.email),
                    Builders<BsonDocument>.Filter.Eq("password", input.password)};

                List<BsonDocument> userRecords = MongoDBHelperSingleton.instance.GetRecords("UserCollection", filters);

                if (userRecords.Count == 0)
                {
                    return new
                    {
                        success = false,
                        message = "User not found",
                        errorCode = "404"
                    };
                }

                return new
                {
                    success = true,
                    data = new { userId = userRecords[0].GetValue("_id").AsString, signInComplete = true }
                };
            }
            catch (Exception e)
            {
                return new
                {
                    success = true,
                    message = e.Message,
                    errorCode = "500"
                };
            }
        }
    }

    public class SignInPayload
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}