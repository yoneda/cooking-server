const knexConfig = {
  client: "mysql",
  connection: {
    host: "m7nj9dclezfq7ax1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "a6p9p4y8675jagbb",
    password: "vh2sf4kiobbbdmy7",
    database: "do6sfdqn1wbkjayj"
  }
};
const db = require("knex")(knexConfig);

module.exports = db;
