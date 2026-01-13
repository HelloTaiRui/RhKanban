const crypto = require("crypto");
const axios = require("axios"); // 需安装: npm install axios
const express = require("express");
const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false }); // 禁用证书验证（不推荐用于生产环境）
axios.defaults.httpsAgent = agent;

// 加密工具函数 - 使用Web Crypto API
const cryptoUtils = {
  // HMAC-SHA256加密
  async hmacSHA256(message, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message)
    );

    const uint8Array = new Uint8Array(signature);
    return this.base64Encode(uint8Array);
  },

  // Base64编码
  base64Encode(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  // URL安全的Base64编码
  base64EncodeURL(buffer) {
    return this.base64Encode(buffer)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  },
};
const appKey = "26620986";
const secretKey = "zwG5rB5DABWez4BJ0dlq";
const nonce = "eb6e6ca1-0d9b-4b91-8510-e402a7ff61bf";
const HikvisionHelper = {
  getDeviceList(
    body = {
      pageNo: 1,
      pageSize: 20,
    }
  ) {
    return this.request("POST", "/artemis/api/resource/v1/regions/root", body);
  },

  async request(method, path, body, params) {
    try {
      const requestBody = JSON.stringify(body);
      //debugger;
      // 1. 生成签名
      const authInfo = await this.generateSignature(method, path, requestBody);

      // 2. 组装请求头
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
        //Accept: 'application/json',
        "X-Ca-Key": appKey,
        "X-Ca-Nonce": nonce,
        "X-Ca-Signature": authInfo.signature,
        "X-Ca-Signature-Headers": "x-ca-key,x-ca-nonce,x-ca-timestamp",
        "X-Ca-Timestamp": authInfo.timestamp + "",
      };
      console.log(authInfo, headers);
      // 3. 发送请求
      const baseURL = "https://192.168.8.189:443"; // 替换为实际域名
      const response = await axios({
        method: method.toLowerCase(),
        url: `${baseURL}${path}`,
        headers: headers,
        params: params,
        data: body,
        timeout: 10000,
      });

      if (response.status != 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.data;
      if (result.code == "0") return result.data;
      else throw `【错误代码】${result.code}【错误消息】${result.msg}`;
    } catch (error) {
      if (typeof error == "string") throw error;
      else if (error instanceof Error) throw error.message;
      else throw JSON.stringify(error);
    }
  },

  // 生成GMT格式时间戳
  generateTimestamp() {
    //return 1758788981618;
    return new Date().getTime();
  },

  // 构建待签名字符串 (请根据官方文档调整此规则)
  buildStringToSign(method, contentType, timestamp, path, body = "") {
    // 这是常见规则示例，实际请参考官方文档
    const components = [
      method.toUpperCase(),
      "*/*",
      //'', // Content-MD5 (通常为空)
      contentType,
      `x-ca-key:${appKey}`,
      `x-ca-nonce:${nonce}`,
      `x-ca-timestamp:${timestamp}`,
      path,
    ];

    return components.join("\n");
  },

  // 生成签名
  async generateSignature(
    method,
    path,
    body = "",
    contentType = "application/json"
  ) {
    const timestamp = this.generateTimestamp();

    // 构建待签名字符串
    const stringToSign = this.buildStringToSign(
      method,
      contentType,
      timestamp,
      path,
      body
    );

    console.log("String to sign:", stringToSign); // 调试用

    // 计算HMAC-SHA256签名
    const signature = await cryptoUtils.hmacSHA256(stringToSign, secretKey);

    return {
      timestamp,
      signature,
      authorization: `HMAC-SHA256 appkey="${appKey}",signature="${signature}"`,
    };
  },
};

//HikvisionHelper.getDeviceList();

const app = express(); // create an application object
app.disable("x-powered-by");
app.use(function (req, res, next) {
  console.log(
    `【请求】${req.url}`,
    req.ip || req.socket.remoteAddress || req.connection.remoteAddress
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json()); // connect middleware that parses json
//app.use(bodyParser.urlencoded({ extended: false })); // connect middleware that parses urlencoded bodies

app.get("/", function (req, res) {
  console.log(req.body);
  res.send("hello!");
});

app.post("/invoke", async function (req, res) {
  const data = req.body;
  console.log(data);
  const { method, path, body, params } = data;
  try {
    const result = await HikvisionHelper.request(method, path, body, params);
    res.status(200).json({ Success: true, Attach: result });
  } catch (error) {
    res.status(200).json({ Success: false, Message: error });
  }
  //res.end();
});

const server = app.listen(5002, function () {
  console.log("server is running on 5002");
  //debug("Express server listening on port " + server.address().port);
});
