// Update with your config settings.

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "tuy8t6uuvh43khkk.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      database: "pa4cpcclmf6ps1ff",
      user: "tquwcfdj27o9faux",
      password: "m9brv58bygvynqwf"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./migrations",
      tableName: "init"
    },
    seeds: {
      directory: "./seeds"
    }
  },
  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "mysql",
    connection: {
      host: "tuy8t6uuvh43khkk.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      database: "pa4cpcclmf6ps1ff",
      user: "tquwcfdj27o9faux",
      password: "m9brv58bygvynqwf"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./migrations",
      tableName: "init"
    },
    seeds: {
      directory: "./seeds"
    }
  }
};
