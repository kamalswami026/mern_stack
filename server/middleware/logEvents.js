import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";

export const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(path.resolve(), "logs"))) {
      await fsPromises.mkdir(path.join(path.resolve(), "logs"));
    }

    await fsPromises.appendFile(
      path.join(path.resolve(), "logs", logName),
      logItem
    );
  } catch (err) {
    console.error("Error occured");
    console.log(err);
  }
};

export const logger = (req, res, next) => {
  logEvents(
    `${req.method} \t ${req.headers.origin} \t ${req.url}`,
    "reqLog.txt"
  );
  next();
};
