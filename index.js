require("dotenv").config(); // Load biến môi trường từ file .env

const express = require("express");
const { createServer } = require("node:http");

const { join } = require("node:path");

const { Server } = require("socket.io");

const path = require("path");

const database = require("./config/database");

const systemConfix = require("./config/system");

const methodOverride = require("method-override");

const flash = require("express-flash");

const moment = require("moment");
// require('moment/locale/vi');

const cookieParser = require("cookie-parser");

const session = require("express-session");

const route = require("./routes/client/index.route");

const routeAdmin = require("./routes/admin/index.route");

const app = express();
const port = process.env.PORT || 3000;

//Socket IO
const server = createServer(app);
const io = new Server(server,{
  maxHttpBufferSize: 2e7 
});
//Đặt thành biến global
global._io=io;
//End Socket IO


app.use(methodOverride("_method"));

// Phân tích dữ liệu từ form HTML
app.use(express.urlencoded({ extended: true }));

database.connect();

app.set("view engine", "pug"); // Đặt template engine là Pug
app.set("views", `${__dirname}//views`); // Thư mục chứa file Pug

//Flash
app.use(cookieParser("da shyzzz"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//End Flash

//TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
//End TinyMCE

// Chỉnh thời gian về tiếng việt
// moment.locale('vi');

//App local variable (Đặt tên là prefixAdmin)
app.locals.prefixAdmin = systemConfix.prefixAdmin;
app.locals.moment = moment;

// Cấu hình thư mục chứa file tĩnh
app.use(express.static(`${__dirname}/public`));

// Routes
// require("./routes/index.route")(app);
route(app);
routeAdmin(app);

app.use((req, res, next) => {
  res.status(404).render("client/pages/errors/404", {
    title: "404 Not Found",
    url: req.originalUrl
  });
});



server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

