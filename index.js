const express = require("express")
const uuid = require("uuid")
const app = express()
const port = 3000

app.use(express.json())

const users = []


const url = (req, res, next) => {
    const {url, method} = req
    console.log(`URL: ${url}, Method: ${method}`)

    next()
}

const middleware = (req, res, next) => {
    const {id} = req.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return res.status(404).json({error:"Id not found"})
    }

    req.userId = id
    req.userIndex = index

    next()
}

app.post("/order", url, (req, res) => {
    const {order, name, value} = req.body

    const user = {id:uuid.v4(), order, name, value, status:"Em andamento"}

    users.push(user)

    return res.status(201).json(user)

})

app.get("/order", url, (req, res) =>{
    return res.json(users)
})

app.delete("/order/:id", middleware, url, (req, res) => {
    const index = req.userIndex

    users.splice(index, 1)

    return res.status(204).json()

})

app.put("/order/:id", middleware, url, (req, res) =>{
    const {order, name, value} = req.body
    const id = req.userId
    const index = req.userIndex

    const updateUser = [{id, order, name, value, status:"Em andamento"}]

    users[index] = updateUser

    return res.json(updateUser)
})

app.get("/order/:id", middleware, url, (req, res) =>{
    const index = req.userIndex

    return res.json(users[index])

})

app.patch("/order/:id", middleware, url, (req, res) =>{
    const index = req.userIndex

    users[index].status = "Pronto"

    return res.json(users[index])
})


app.listen(port, () => {
    console.log("🚀 Server ON")
})