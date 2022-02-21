const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middlewares/checkLogin");

// GET ALL THE TODOS
// router.get("/", async (req, res) => {
//     await Todo.find({ status: "inactive" }, (err, data) => {
//         if (err) {
//             res.status(500).json({
//                 error: "There was a server side error!",
//             });
//         } else {
//             res.status(200).json({
//                 result: data,
//                 message: "success!",
//             });
//         }
//     })
// })
// GET ALL THE TODOS
router.get("/", checkLogin, async (req, res) => {

    await Todo.find({})
        .populate("user", "name username -_id")
        .select({
            _id: 0,
            _v: 0,
            date: 0
        }).limit(5).exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    result: data,
                    message: "success!",
                });
            }
        });
})

// GET A TODO by ID
router.get("/:id", async (req, res) => {
    await Todo.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                result: data,
                message: "success!",
            });
        }
    })
})


// POST A TODO
router.post("/", checkLogin, async (req, res) => {
    const newTodo = new Todo({
        ...req.body,
        user: req.userId
    });
    try {
        const todo = await newTodo.save();
        await User.updateOne({
            _id: req.userId
        }, {
            $push: {
                todos: todo._id
            }
        })
        res.status(200).json({
            message: "Todo was inserted successfully!",
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: "There was a server side error!",
        });
    }

})


// POST MULTIPLE TODO
router.post("/all", async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Todos were inserted successfully!",
            });
        }
    })
})

// PUT TODO
router.put("/:id", async (req, res) => {
    await Todo.updateOne({ _id: req.params.id }, {
        $set: {
            status: 'inactive'
        }
    },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    message: "Todos were update successfully!",
                });
            }
        })
})

// DELETE TODO
router.delete("/:id", async (req, res) => {
    await Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({

                message: "Todo was deleted success!",
            });
        }
    })
}
)
module.exports = router;
