const { model, Schema } = require("mongoose");

// Define the schema for the logs collection
let logschema = new Schema({
    Guild: String,             // The ID of the guild (server) where the log system is set up
    UtilityChannel: String,           // The ID of the utility log channel
    ModerationChannel: String, // The ID of the moderation log channel
});

// Export the model based on the logschema
module.exports = model("logs", logschema);
