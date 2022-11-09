const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask")

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// connecting to database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("connected to db");

  app.listen(3000, () => console.log('server is running'));
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
  res.render("todo.ejs", { todoTasks: tasks });
  });
});

// Add a Todo task to a Todo collection
app.post("/",async (req, res) => {
  const todoTask = new TodoTask({
  content: req.body.content
  });
    try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

//  Update a particular Todo task 
app
 .route("/edit/:id")
 .get((req, res) => {
   const id = req.params.id;
   TodoTask.find({}, (err, tasks) => {
   res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
  });
})

 .post((req, res) => {
   const id = req.params.id;
   TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
   if (err) return res.send(500, err);
   res.redirect("/");
  });
});

// Delete Todo task
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
  if (err) return res.send(500, err);
  res.redirect("/");
  });
});


// Retrieve all Todo tasks 
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Tutorial.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message 
      });
    });
};

