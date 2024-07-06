const express=require("express");
const users=require("../MOCK_DATA.json");
const fs=require('fs')

const app=express();

const PORT=8000;

app.use(express.urlencoded({extended:false}));


app.get('/users',(req,res)=>{ // /users will give html
    const html=`
    <ul>
    ${users.map((user)=> `<li>${user.first_name}</li>`)}
    
    </ul>
    `;
    res.send(html);
})

app.get("/api/users",(req,res)=>{
    return res.json(users);
});

// dynamic path parameters
// -> /api/users/:id

app.get("/api/users/:id", (req,res)=>{
    const id=Number(req.params.id);
    const user=users.find(user=>user.id===id);
    return res.json(user);
})

app.post('/api/users',(req,res)=>{
    // create new user
    const body=req.body;
    users.push({...body, id: users.length+1});
    fs.writeFile('../MOCK_DATA.json', JSON.stringify(users),(err,data)=>{
        return  res.json({status:"success",id:users.length});
    });

    
   

});

app.patch('/api/users/:id',(req, res) => {
    // update user by id
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
          return res.status(404).json({ status: "User not found" });
    }

    users[index] = {
          ...users[index],
          ...req.body,
    };

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
          if (err) {
                return res.status(500).json({
                      status: "Error updating user",
                });
          }
          return res.json({
                status: "Success",
                user: users[index],
          });
    });
})

   

app.delete('/api/users/:id',(req, res) => {
    // delete user by id
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
          return res.status(404).json({ status: "User not found" });
    }

    users.splice(index, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
          if (err) {
                return res.status(500).json({
                      status: "Error deleting user",
                });
          }
          return res.json({ status: "Success", id });
    });
});



app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})