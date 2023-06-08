const dotenv = require("dotenv");

dotenv.config();

exports.DISCORD_TOKEN = process.env.DISCORD_TOKEN;
exports.CLIENT_ID = process.env.CLIENT_ID;
exports.ASSIGNEE_URL = process.env.ASSIGNEE_URL;
exports.MONGODB_URL = process.env.MONGODB_URL;
