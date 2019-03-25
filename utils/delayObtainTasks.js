const delayObtainTasks = () => {
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
    connection.query("select * from tasks",(err,results,fields)=>{
      const entities = JSON.parse(JSON.stringify(results));
      const filtered = entities.filter((entity)=>entity.removed===0);
      const tasks = filtered.map((entity)=>({id:entity.id,name:entity.name,done:entity.done}));
      resolve(tasks);
    })
    connection.end();
  })
}

module.exports = delayObtainTasks;