const delayUpdateTask = (id,done) => {
  return new Promise((resolve,reject)=>{
    const mysql = require("mysql");
    const connection = mysql.createConnection({
      host: "zj2x67aktl2o6q2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "a6gy1hq79u3dsfkr",
      password: "ios34vdfh0jbsoj3",
      database: "kqp69lp9xo2uinaf",
      port:"3306",
    });
    connection.connect();
    connection.query("update tasks set done = ? where id = ?",[done,id],(err,results,fields)=>{
      const info = JSON.parse(JSON.stringify(results));
      resolve(info);
    })
    connection.end();
  })
}

module.exports = delayUpdateTask;