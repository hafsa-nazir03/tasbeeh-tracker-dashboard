const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());//express agar frontend say json data aaye to usay read krny ky liye ready rehna

const PORT = 3000;



app.get("/",function(request,response){

response.send("Welcome to Tasbeeh Trainer API");

});



const tasbeeh = [

    {

    id : 1,
    name : "Astaghfirullah",
    category : "Morning",
    target : 100
},

{

    id : 2, 
    name : "Subhanallah",
    category : "Morning",
    target : 200

}, {

    id : 3, 
    name : "Laillahaillah",
    category : "Daily",
    target : 300

},
{

    id : 4, 
    name : "Allahu Akbar",
    category : "Evening",
    target : 100

}, {

    id : 5, 
    name : "Alhamdulillah",
    category : "Daily",
    target : 100

}
 

];//hamara temporary database hai yai. 



app.get("/tasbeeh", function(request,response){

    setTimeout(function(){//so that the loading state may be visible.
    
   response.json(tasbeeh);
    },1000);
    

});//sending this to the server

//creating a tasbeeh on user's choice
app.post("/tasbeeh", function(request,response) {

const newTasbeeh = {//pehla code generate nhi kr rha tha id to wo undefined aarha tha to ham ny aesy kr lia(full Object).
    id : tasbeeh.length + 1,
    name : request.body.name,
    target : request.body.target,
    category : request.body.category
};

tasbeeh.push(newTasbeeh);
response.json(newTasbeeh);

});


//Update:
app.put("/tasbeeh/:id",function(request,response){
const id = request.params.id;//frontend say id receive kr rhy hen

const tasbeehToUpdate = tasbeeh.find(function(item){//finds the id in array jis ko update krna hai
 return item.id == Number(id);
});

if(!tasbeehToUpdate){//agar user aesi tashbeeh bhejy jo ky exist na krti ho to us ky liye error throw ho.
    return response.status(404).json({
        message: "Tasbeeh not found"
    })
}

const updatedData = request.body;//frontend say jo cheez new lagani hai wo receive kia.
tasbeehToUpdate.name = updatedData.name;//actual update ho rha hai yahan par
tasbeehToUpdate.target = updatedData.target;
tasbeehToUpdate.category = updatedData.category;
response.json(tasbeehToUpdate);//frontend par usay return kry ga
});


app.delete("/tasbeeh/:id",function(request,response){
const id = request.params.id;//id lai li ham ny, URL say par wo as String hai is main. 
const index = tasbeeh.findIndex(function(item){//yahan par jahan bhi existing item ki id equal hogi url say aaye id ky, to us ki index return hogi.
return item.id == Number(id);
});

if(index == -1){//agr wo id exist na kry to Js returns -1. to us par ham ny message dai dia hai. 
    return response.status(404).json({
        message: "Tasbeeh not found"
    })
}

tasbeeh.splice(index,1);
response.json({//frontend par nazar aaye ga. 
    message: "Tasbeeh deleted successfully"
})
});

//extra for counter
app.get("/tasbeeh/:id",function(request,response){
const id = Number(request.params.id);
const foundTasbeeh = tasbeeh.find(function(item){
        return item.id == id;
    });

    if(!foundTasbeeh){
        return response.status(404).json({
            message: "Tasbeeh not found"
        });
    }
   response.json(foundTasbeeh);
});

app.listen(PORT,function(){

console.log(`Server is running on port ${PORT}`);

});

//npx nodemon server.js