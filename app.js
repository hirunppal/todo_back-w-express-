const express = require("express");

const todoroute = require("./route/todoroute");
const app = express();
app.use(express.json());
app.use("/todos", todoroute);
//err handleing middle wear
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});
const port = 8002;
app.listen(port, () => console.log(`well com to port ${port}`));
