const whiteList = [
  "http://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
export const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      //TODO: Only for developement - !origin
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  optionsSuccessStatus: 200,
};
