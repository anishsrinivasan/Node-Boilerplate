global.env =
  process.env.NODE_ENV === undefined ? "development" : process.env.NODE_ENV;
const env = global.env;

const CronJob = require("cron").CronJob;
const mysqldump = require("mysqldump");
const config = require("./config.json");
const moment = require("moment");
const init = process.env.INIT === "true" ? true : false;

(() => {
  const jobAt12 = new CronJob(
    "0 2 * * *",
    () => {
      console.log("CRON - Every Day at 12", new Date().toString());
      dumpDB();
    },
    null,
    true,
    "Asia/Kolkata"
  );
  jobAt12.start();
})();

console.log("\nStarted Backup Cron \n\n", config.db.mysql[env], env, "\n");

if (init) dumpDB();

function dumpDB() {
  try {
    const momentDateString = moment().format("DD-MM-YYYY HH-mm");
    const dumpToFile = `./backups/${momentDateString}-DUMP.sql.gz`;

    mysqldump({
      connection: {
        host: config.db.mysql[env].host,
        user: config.db.mysql[env].username,
        password: config.db.mysql[env].password,
        database: config.db.mysql[env].database,
        port: config.db.mysql[env].port,
      },
      dumpToFile,
      compressFile: true,
    });
    console.log("Backup Successful - ", momentDateString, "\n");
  } catch (err) {
    console.log("dumpDBErr", err);
  }
}
