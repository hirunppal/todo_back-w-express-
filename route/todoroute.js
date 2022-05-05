const express = require("express");
const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const { readfilE, writefilE } = require("../services/file");
const CreateErr = require("../utils/create_err.js");

const router = express.Router();
// router.use(express.json());
/// Create todo : Post /todos
//title required , completed = false duedate = //
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      title = req.body.title,
      completed = false,
      duedate = null,
    } = req.body;

    //   console.log(typeof title);
    if (typeof title !== "string") {
      CreateErr("string is not valid", 400);
    }

    if (typeof completed !== "boolean") {
      CreateErr("Bad Request conpleted is not valid", 400);
    }
    // console.log(duedate);
    //   console.log(typeof duedate);
    if (duedate !== null && !validator.isDate(duedate + "")) {
      CreateErr("Bad Request :duedate is not valid", 400);
    }
    //    res.status(200).json("YEY valid Ready to create");
    const todos = await readfilE();
    todos.push({
      id: uuidv4(),
      title,
      completed,
      duedate: duedate === null ? new Date(Date.now()) : new Date(duedate),
    });
    await writefilE(todos);
  } catch (err) {
    CreateErr(err);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const todos = await readfilE();
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});
// grt todo by ID GET / todo / :id   /// param.id = id
router.get("/:id", async (req, res, next) => {
  const param = req.params;
  try {
    const todos = await readfilE();
    const tar = todos.find((el) => el.id === param.id);
    return res.status(200).json({ todo: tar || "to do is not found" });
  } catch (err) {
    next(err);
  }
});
router.delete("/:id", async (req, res, next) => {
  const param = req.params;
  try {
    const todos = await readfilE();
    const idx = todos.findIndex((el) => el.id === param.id);

    if (idx === -1) {
      CreateErr("todo is not found ", 400);
    }
    const deledtodo = todos.splice(idx, 1);
    await writefilE(todos);
    res.status(200).json({ todo: todos, deletedtodo: deledtodo });
  } catch (err) {
    next(err);
  }
});
//Update Todo PUT
//Body : tittle ,completed (defalut=false), duedate
router.put("/:id", async (req, res, next) => {
  const param = req.params;
  const body = req.body;

  try {
    if (typeof body.title !== "string") {
      CreateErr("title is not valid", 400);
    }

    if (typeof body.completed !== "boolean") {
      CreateErr("Bad Request conpleted is not valid", 400);
    }
    console.log(body.duedate);
    //   console.log(typeof duedate);
    if (
      body.duedate !== (null || undefined) &&
      !validator.isDate(body.duedate + "")
    ) {
      CreateErr("Bad Request :duedate is not valid", 400);
    }
    const todos = await readfilE();
    const idx = todos.findIndex((el) => el.id === param.id);

    if (idx === -1) {
      CreateErr("todo is not found ", 400);
    }
    todos[idx] = {
      id: param.id,
      title: body.title,
      completed: body.completed,
      duedate:
        body.duedate === null ? new Date(Date.now()) : todos[idx].duedate,
    };
    await writefilE(todos);
    res.status(200).json({ todo: todos, updatedtodo: todos[idx] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
