const { json } = require("express/lib/response");
const fs = require("fs/promises");
// const readem = () => {};
exports.readfilE = async () => {
  const data = await fs.readFile("./db/todo.json", "utf-8");
  // console.log(data);
  return JSON.parse(data);
};
exports.writefilE = (data) =>
  fs.writeFile("./db/todo.json", JSON.stringify(data), "utf-8");
