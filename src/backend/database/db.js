const path = require("path");
const Datastore = require("nedb-promises");

const users = Datastore.create({ filename: path.join(__dirname, "users.db"), autoload: true });

module.exports = { users };
