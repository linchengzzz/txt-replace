const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// 敏感词库路径
const sensitivePath = "./sensitive.csv";
// 替换文件路径
const inputPath = "./input.txt";

function getSensitiveWords(sPath) {
  const wordMap = new Map();
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, sPath))
      .pipe(csv())
      .on("data", (data) => wordMap.set(data["敏感词"], data["替换词"]))
      .on("end", () => resolve(wordMap))
      .on("error", (error) => reject(error));
  });
}

async function main() {
  try {
    const wordMap = await getSensitiveWords(sensitivePath);
    const inputData = fs.readFileSync(path.join(__dirname, inputPath), "utf-8");
    let outputData = inputData;

    for (let [key, value] of wordMap) {
      outputData = outputData.replaceAll(key, value);
    }

    fs.writeFileSync(path.join(__dirname, "./output.txt"), outputData, "utf-8");
    console.log("数据处理完成");
  } catch (error) {
    console.log("数据处理错误");
  }
}

main().then();
