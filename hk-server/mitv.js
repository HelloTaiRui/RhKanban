const axios = require("axios/dist/node/axios.cjs");
const winston = require("winston");
const fs = require("fs");
const path = require("path");
const express = require("express");
const { format } = require("date-fns");
require("winston-daily-rotate-file");

// 创建一个 logger 实例
const logger = winston.createLogger({
  level: "info", // 设置最低日志级别：info 及以上的级别（warn, error）会被记录
  format: winston.format.combine(
    //winston.format.timestamp(), // 添加时间戳
    winston.format.json() // 日志格式设为 JSON，便于后续分析
  ),
  transports: [
    // 配置每日轮转文件传输
    new winston.transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log", // %DATE% 会被 datePattern 替换
      datePattern: "YYYY-MM-DD", // 按天轮转
      zippedArchive: true, // 启用压缩归档
      maxSize: "20m", // 单个文件超过20MB也会触发轮转
      maxFiles: "14d", // 保留最近14天的日志
    }),
  ],
});

// 如果不在生产环境，则额外添加到控制台的输出
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(), // 在控制台使用简单格式
    })
  );
}

const info = (ip, content) => {
  logger.info({
    target: ip,
    time: format(new Date(), "yyyy/MM/dd HH:mm:ss"),
    detail: content,
  });
};
const error = (ip, content) => {
  if (typeof content == "object" && content.message) {
    content = content.message;
  }
  logger.error({
    target: ip,
    time: format(new Date(), "yyyy/MM/dd HH:mm:ss"),
    detail: content,
  });
};

/** 电视IP列表 */
const ipList = [];
let config;

const configPath = path.join(process.cwd(), "config.json");
try {
  const rawData = fs.readFileSync(configPath, "utf8");
  config = JSON.parse(rawData);
  info("加载配置文件", config);
  axios.defaults.timeout = config.timeout;
  ipList.length = 0;
  ipList.push(...config.ipList.map((item) => item.Value));
} catch (err) {
  error("读取配置文件出错", err);
}

/** 状态列表。0是离线，1是在线 */
const stateMap = new Map(ipList.map((ip) => [ip, 0]));

/** 查询小米电视状态的API地址 */
const mitv_info_url = (ip) => `http://${ip}:6095/request?action=isalive`;
/** 启动电视app的API地址 */
const mitv_startapp_url = (ip) =>
  `http://${ip}:6095/controller?action=startapp&type=packagename&packagename=${config.packageName}`;

/** 检查电视 */
const checkTv = async (ip) => {
  const lastState = stateMap.get(ip) || 0;
  try {
    const response = await axios.get(mitv_info_url(ip));
    if (response.status == 200 && response.data.msg == "success") {
      if (lastState == 0) {
        try {
          info(ip, response.data);
          repeatStart(ip, 0);
        } catch (err) {
          stateMap.set(ip, 0);
          error(ip, `启动app超时！${err}`);
        }
      } else {
        info(ip, "运行中");
      }
    } else {
      stateMap.set(ip, 0);
      error(ip, response.data.msg);
    }
  } catch (err) {
    stateMap.set(ip, 0);
    error(ip, err);
  }

  setTimeout(() => {
    checkTv(ip);
  }, config.interval);
};

const repeatStart = async (ip, num = 0) => {
  try {
    if (num >= config.maxRepeatStartNum) {
      info(ip, `重复启动次数已达指定的上限次数：${num}！结束重复！`);
      return;
    }
    const startResponse = await axios.get(mitv_startapp_url(ip));
    if (startResponse.status == 200 && startResponse.data.msg == "success") {
      stateMap.set(ip, 1);
      info(ip, `app启动成功！重复次数：${num}！`);
    } else {
      stateMap.set(ip, 0);
      info(
        ip,
        `app启动失败！重复次数：${num}！错误信息：${startResponse.data.msg}`
      );
    }
    setTimeout(() => {
      repeatStart(ip, num + 1);
    }, config.interval);
  } catch (err) {
    stateMap.set(ip, 0);
    error(ip, err);
  }
};

ipList.forEach((ip) => checkTv(ip));

const app = express(); // create an application object
app.disable("x-powered-by");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());

app.get("/", function (req, res) {
  //console.log(req.params);
  info("Server", "GET调用");
  res.json({
    state: ipList.map((ip) => ({ ip: ip, state: stateMap.get(ip) })),
    config: config,
  });
});

const server = app.listen(config.curServerPort, function () {
  info("Server", `server is running on ${config.curServerPort}`);
  //debug("Express server listening on port " + server.address().port);
});
