//First Step is to fetch the data present in backend
let allTasbeehs = [];//array hai list hai jis main multiple obk=jects aaty hen
let categoryBarChart;
let targetChart;
let categoryDoughnutChart;
function loadDashboardData(){
    fetch("http://localhost:3000/tasbeeh")
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        allTasbeehs = data;//original backend data aikjagah save ho rha hai
        const categoryCounts = {};//agr ham chahty hen ky har tarah ki category ko ocunt krlen to hamen yai krna hoga.bar chart ko yai chaheye ky kitni categories hen
        //its an empty object basically
//uper aik empty object bana hai,jis main har category ka count store hoga.
        data.forEach(function(item){
            if(categoryCounts[item.category]){
                categoryCounts[item.category]++;
            }else{
                categoryCounts[item.category] = 1;
            }
        });

        console.log(categoryCounts);

        //calculating total tasbeehs
        const totalTasbeehs = data.length;
        console.log(totalTasbeehs);

        //calculating total target:
        let totalTarget = 0;
        data.forEach(function(item){
            totalTarget += Number(item.target);
        });
        console.log(totalTarget);

        //calculating average tasbeehs:
        const averageTarget = totalTarget/totalTasbeehs;
        
        //website par display
        document.getElementById("total-tasbeehs").textContent = totalTasbeehs;
        document.getElementById("total-target").textContent = totalTarget;
        document.getElementById("average-target").textContent = averageTarget;

const categories = Object.keys(categoryCounts);
const count = Object.values(categoryCounts);
const ctx = document.getElementById("categorybarchart");
const doughnutCtx = document.getElementById("categoryDoughnutChart");

//target chart:
const tasbeehNames = data.map(function(item){// .map basically backend say aany walay data main say names ko map krta hai aur banata hai ["Ziakr01Name","Zikar02Name"]
    return item.name;
});

const target = data.map(function(item){// .map numbers return krta hai [100,200,200]
    return Number(item.target);
});

const targetCtx = document.getElementById("targetChart");

targetChart = new Chart(targetCtx,{//chart.js ky andar data hai aur data ky andar datasets hen, aur datasets aik array haiso aagy chal kr datasets[0] ka matlb is ka pehla object, aur datasets[0].data means ky us datasets ky andar 0th object ka jo data hai
    type : "bar",//bar chart bnaao
    data : {
        labels : tasbeehNames,//is say pta chalta hai ky kis cheez ki slices krny hen.
        datasets : [{
            label : "Target",
            data : target,//is say pta chalta hai ky slice kitna bara hoga
             backgroundColor: "#40916c",
              borderColor: "#1b4332",
            borderWidth: 1
        }]
    },
    options : {
        responsive : true
    }
});

categoryDoughnutChart = new Chart(doughnutCtx,{
    type : "doughnut",//bar chart bnaao
    data : {
        labels : categories,//is say pta chalta hai ky kis cheez ki slices krny hen.
        datasets : [{
            label : "Tasbeeh Distribution",
            data : count,//is say pta chalta hai ky slice kitna bara hoga
            backgroundColor: [
                "#2d6a4f",
                "#40916c",
                "#74c69d",
                "#95d5b2"
            ],
            borderColor: "#1b4332",
            borderWidth: 1
            
        }]
    },
    options : {
        responsive : true
    }
});

categoryBarChart = new Chart(ctx,{
    type : "bar",//bar chart bnaao
    data : {
        labels : categories,
        datasets : [{
            label : "Number of Tasbeehs",
            data : count,
            backgroundColor: "#2d6a4f",
              borderColor: "#1b4332",
            borderWidth: 1
        }]
    },
    options : {
        responsive : true
    }
});

    })
     

    .catch(function(error){
        console.log("Something went wrong:", error);
    });
}
loadDashboardData();
//bar chart bany ga
function updateDashboard(filteredData){
     categoryCounts = {};
filteredData.forEach(function(item){
   
if(categoryCounts[item.category]){
                categoryCounts[item.category]++;
            }else{
                categoryCounts[item.category] = 1;
            }
});
const categories = Object.keys(categoryCounts);
const count = Object.values(categoryCounts);
//categoryBarChart:
categoryBarChart.data.labels = categories;
categoryBarChart.data.datasets[0].data = count;
categoryBarChart.update();

//Doughnut Chart:
categoryDoughnutChart.data.labels = categories;
categoryDoughnutChart.data.datasets[0].data = count;
categoryDoughnutChart.update();

//target chart:
const tasbeehNames = filteredData.map(function(item){// .map basically backend say aany walay data main say names ko map krta hai aur banata hai ["Ziakr01Name","Zikar02Name"]
    return item.name;
});

const target = filteredData.map(function(item){// .map numbers return krta hai [100,200,200]
    return Number(item.target);
});

targetChart.data.labels = tasbeehNames;
targetChart.data.datasets[0].data = target;
targetChart.update();
//cards stats:
const totalTasbeehs = filteredData.length;

//total Targets:
let totalTarget = 0;
filteredData.forEach(function(item){
    totalTarget += Number(item.target);
});

//average Target:
let averageTarget = 0;
if(totalTasbeehs>0){
    averageTarget = totalTarget/totalTasbeehs;
}
        document.getElementById("total-tasbeehs").textContent = totalTasbeehs;
        document.getElementById("total-target").textContent = totalTarget;
        document.getElementById("average-target").textContent = averageTarget.toFixed(1);//agr average bhot bara ho, to usay round off kry ga tofixed.
};

const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change",function(){
const selectedCategory = categoryFilter.value;
console.log("Selected Category: ", selectedCategory);
let filteredData;

if(selectedCategory == "All"){
    filteredData = allTasbeehs;
    
}else{
    filteredData = allTasbeehs.filter(function(item){
        return item.category === selectedCategory;
    });
}
//console.log(filteredData);
updateDashboard(filteredData);
});
