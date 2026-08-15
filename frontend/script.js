
function displayItems(item){
const tasbeehList = document.getElementById("tasbeehList");//gets the html element by id
tasbeehList.innerHTML += `<div class="Tasbeeh-card"> <h3>📿${item.name}</h3> <p>🎯Target: ${item.target}</p> <p>🎯Category: ${item.category}</p> <button class="update-btn" onclick="updateTasbeeh(${item.id})">Update</button>
<button type="button" class="delete-btn" onclick="deleteTasbeeh(${item.id})">Delete</button> <button class="count-btn" onclick="openCounter(${item.id})">Count</button></div>`;
};

function loadTasbeehs() {//this function will be used in update and delete to get the data

    fetch("http://localhost:3000/tasbeeh")

    .then(function(response){
        return response.json();
    })

    .then(function(data){//backend say frontend main bhej rhy hen ham data(array) ko

        
        
            document.getElementById("Loading").style.display = "none";//loading ko gaib kro
           
            const tasbeehList = document.getElementById("tasbeehList");
            tasbeehList.innerHTML = "";

            if(data.length == 0){//backend data aaya hai, aur ham dekh rhy ky agar wo empty hai to yai message send kro
                tasbeehList.innerHTML = `
                    <p>📿 No Tasbeehs Found. Every remembrance brings you closer to Allah. Add your first Tasbeeh.</p>
                `;
                return;//taky foreach na chal paye.
            }

            data.forEach(function(item){//array ky andar har object par kaam kro
                displayItems(item);//function
            });


    })

    .catch(function(error){
      const message = document.getElementById("Loading");
      message.textContent = "Something went wrong! Plz try again";
    });

}

loadTasbeehs();//API request, data load(Response), data receive
const tasbeehForm = document.getElementById("tasbeeh-form");
tasbeehForm.addEventListener("submit",function(event){
event.preventDefault();
const name = document.getElementById("name").value;//takes the value entered by the user 
const target = document.getElementById("target").value;//same, but here the .value gives string
const category = document.getElementById("drop-down").value;

//validation checks for POST
if(name == ""){
    alert("Please enter Tasbeeh name.");
    return;

}if(target == ""){
    alert("Please enter Tasbeeh target.");
    return;

}if(category == ""){
    alert("Please select a category");
    return;
}

if(Number(target)<=0){
    alert("Target must be greater than 0.");
    return;
}
const newTasbeeh = {//make an object newTasbeeh having 2 attributes
    name : name,
    target : target,
    category : category
};


fetch("http://localhost:3000/tasbeeh", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newTasbeeh)
})
.then(function(response) {
    return response.json();
})
.then(function(data) {
    const tasbeehList = document.getElementById("tasbeehList");
     tasbeehList.innerHTML = ``;//agar khali nhi kro gy to existing jo not found wala message aarha hai, wo bhi sath display hoga woth card
     loadTasbeehs();
    document.getElementById("name").value = "";//these two lines basically empty the boxes after input
    document.getElementById("target").value = "";
    document.getElementById("drop-down").value = "";
});


});

function updateTasbeeh(id){
 const name = prompt("Enter Tasbeeh name");//these validation checks are needed when details are entered to update a tasbeeh.
const target = prompt("Enter Target");
const category = prompt("Enter Category");
   if(name == "" || target == "" || category == ""){
    alert("Please enter tasbeeh details.");
    return;

}if(Number(target)<=0){
    alert("Target must be greater than 0.");
    return;
}
 const updatedTasbeeh = {
    name : name,
    target : target,
    category : category
 };
 //console.log(updatedTasbeeh);//abhi jo hamenter kren gy, wohi console main aaye ga, abhi backend update nhi hoga

 fetch(`http://localhost:3000/tasbeeh/${id}`, {//ab ham usay backend main update kr rhy hen
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedTasbeeh)
})
.then(function(response) {
    return response.json();
})
.then(function(data) {
    //console.log(data);
    const tasbeehList = document.getElementById("tasbeehList");
    tasbeehList.innerHTML = ``;
    loadTasbeehs();
});
}

//deleting a tasbeeh logic, here body is not included, as delete opr is performed by id
function deleteTasbeeh(id){
    fetch(`http://localhost:3000/tasbeeh/${id}` , {
        method : "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(function(response) {
    return response.json();
})
   .then(function(data){
    const tasbeehList = document.getElementById("tasbeehList");
    tasbeehList.innerHTML = ``;
    loadTasbeehs();
   });
}

function openCounter(id){
    window.location.href = `counter.html?id=${id}`;//jab count press ho to wo counter.html main jaye
}