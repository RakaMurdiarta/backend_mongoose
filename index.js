const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const UserRouter = require("./routes/user.routes");
const cartRouter = require("./routes/cart.routes");
const connectToDatabase = require("./util/database");
const cookieParser = require("cookie-parser");
const path = require("path");
const User = require("./models/users.model");
const cors = require("cors");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const AuthRouter = require("./routes/auth.routes.js");
const corsOptions = require("./config/corsOptions.js");

console.log(corsOptions);

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

connectToDatabase()
  .then(() => {
    console.log("Berhasil terhubung ke database MongoDB.");
  })
  .catch((error) => {
    console.error("Gagal terhubung ke database MongoDB:", error.message);
  });

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use((req, res, next) => {
  User.findById("6445284494cd8d27f5494f35")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// app.use('/admin',isAuth)
app.use("/admin", UserRouter);
app.use("/admin", cartRouter);
app.use("/auth", AuthRouter);

app.use((error, req, res, next) => {
  console.log(error.statusCode);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.listen(8000, () => {
  console.log(connectToDatabase);
});

app.use((req, res, next) => {
  res.status(404).send("<h1>Page Not Found</h1>");
  next();
});
