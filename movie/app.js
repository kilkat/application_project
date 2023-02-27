const express = require("express");
const ejs = require("ejs");
const path = require("path");
const { query } = require("express");
var db_config = require(__dirname + "/config/database.js");
const conn = db_config.init();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

db_config.connect(conn);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;

  console.log(id);
  console.log(pw);

  conn.query(`SELECT * FROM user WHERE ID = '${id}' && PW = '${pw}'`, (err, results) => {
    console.log(results);

    if (err) throw err;
    if (results.length > 0) {
      res.send('<script type="text/javascript">alert("로그인 성공!!!"); document.location.href="/";</script>');
  } else {
      res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>');    
  }
  });
});

app.get("/join", (req, res) => {
  res.render("join");
});

app.get("/join/try", (req, res) => {
  const sql = "INSERT INTO user VALUES(?, ?)";
  const userInfo = req.query;
  // console.log(userInfo);
  const params = [userInfo.id, userInfo.pw];
  // console.log(params);

  conn.query(sql, params, (err) => {
    if (err) console.log("query is not excuted. insert fail...\n" + err);
    else console.log("사용자가 생성되었습니다.")
    res.redirect("/");
  });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
