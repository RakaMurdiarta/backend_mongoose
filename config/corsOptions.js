const allowOrigin = require("./allowOrigin.js");

console.log(allowOrigin);

const corsOptions = {
  origin: (origin, callback) => {
    if (allowOrigin.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
