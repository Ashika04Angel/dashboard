const brokerAddress ='mqtt://test.mosquitto.org:8080/';
const topic = ['home/Solax/BatteryTemperature',
 'home/Solax/PvVoltage2',
 'home/Solax/GridPower',
 ];
const client = mqtt.connect(brokerAddress)
let val = [];
let i=[]
let dataArray = '';
var num1,num2,num3 = '';
let voltagevalue='';
let max = 500;

let test=[]

client.on('connect',() => {
 console.log("connected to MQTT broker")
 client.subscribe(topic,(err) => {
 if(!err){
 console.log("Subscribed to topic:",topic);
 }
 else{
 console.error("Error subscribing to topic",err);
 }
 });
});
client.on('message',(topic,message,clientID) => {
 
 const value = message.toString();
 
 //console.log("Recevied message:",value,topic,clientID);
 
 if(topic === 'home/Solax/BatteryTemperature'){
 document.getElementById("clientID").textContent = value
 num1=value;
 test.push({battery:num1})
 // console.log({battery:num1})
 
 }
 else if(topic === 'home/Solax/PvVoltage2'){
 document.getElementById("Amount").textContent = value
 num2 = value
 test.push({voltage:num2})
 // console.log({voltage:num2})
 }
 else if(topic === 'home/Solax/GridPower') {
 var random = (Math.random()*2 + 10).toFixed(2);
 document.getElementById("Property").textContent = random
 document.getElementById("Property1").textContent = random
 voltagevalue=value
 
 // num3 = value
 num3=(Math.random()*2 + 10).toFixed(2)
 test.push({current:num3})
 // console.log(num3)
 // console.log({current:num3})
 
 checkthershold(voltagevalue);
 val.push(value)
 }
 // table
 // console.log( 123234455,num1)
 axios.post('http://localhost:3000/mqttLiveValues/create', {
 "battery":num1,
 "voltage":num2,
 "current":num3,
 "timestamp":moment().format('YYYY-MM-DD HH:mm:ss')
 })
 .then(function (response) {
 // console.log(num1);
 })
 .catch(function (error) {
 console.log(error);
 });
 //table end
 });


setInterval(() => {
 test=[]
}, 2000);

// Chart
var chartDom = document.getElementById('doughnut');
var myChart = echarts.init(chartDom);
var option;
const timer = document.getElementById('grid');
timer.addEventListener('click', function(){

 grid.style.backgroundColor = "green";
 volt.style.backgroundColor = "#0d6efd";
 bat.style.backgroundColor = "#0d6efd";
 dataArray = num1
 
})

const timer1 =document.getElementById('volt');
timer1.addEventListener('click' , function(){
 volt.style.backgroundColor = "green";
 grid.style.backgroundColor = "#0d6efd";
 bat.style.backgroundColor = "#0d6efd";
 dataArray = num2
 max = 500;
 
})

const timer2 = document.getElementById('bat');
timer2.addEventListener('click' , function(){
 bat.style.backgroundColor = "green";
 grid.style.backgroundColor = "#0d6efd";
 volt.style.backgroundColor = "#0d6efd";
 dataArray = num3
 max = 10000
 
})
const innerLabel = {
id: 'innerLabel',
afterDatasetDraw(chart,args,pluginOptions) {
var {ctx} = chart;

var meta = args.meta;
const xCoor = meta.data[0].x;
const yCoor = meta.data[0].y;

const perc = dataArray / max *100;

ctx.textAlign = 'center';
ctx.font = ' bold 40px Arial';
ctx.fillText(perc.toFixed(2) + '%', xCoor, yCoor);

},
};
const options = {
series:[
{radius:['20%','20%'],
}],
responsive: false,
plugins: {
},
};

const value = val;
const data = {

labels:['Power'],
datasets:[
{
data:[dataArray,100-dataArray],
backgroundColor: ['#1679AB'],
borderwidth:1,
cutout:'80%'
},
],
};
const cx = document.getElementById('doughnut');
new Chart(cx , {
type: 'doughnut',
plugins: [innerLabel],
data,
options:{
layout:{
padding:0
},
}

});

// Graph

const crt = document.getElementById('myChart').getContext('2d'); 

let ctx = new Chart(crt, {
 type: 'line',
 data: {
 labels: val,
 datasets: [{
 label: 'Home',
 data: val,
 borderwidth:10,
 }]
 },
});
setInterval(function(){

 let updatedData = val
 
 ctx.data.datasets[0].data = updatedData;
 if(val.length>=70){
 val.shift()
}
 ctx.update()
},100)

// buzzer
function checkthershold(val){

 var voltageValue =2000;
 // console.log(val)
 
 if(val>voltageValue){
 document.getElementById("red").style.display = "block";
 document.getElementById("green").style.display = 'none';
 text.innerHTML = "maximum limit is reached!"

 setInterval(function (){
 text.style.opacity = (text.style.opacity == 0.2 ? 0.8
 :0.2);
 },2000);
 }
 
 else{
 document.getElementById("red").style.display = "none";
 document.getElementById("green").style.display = 'block';
 }
 // console.log( 123455,voltagevalue)
 // var text =document.getElementById("text");
 // text.innerHTML = voltageValue
}

//  fetch('http://localhost:3000/mqttLiveValues/get_all')
//  .then((data)=>{
//  // console.log(data);
//  return data.json();
//  })
//  .then((object) =>{
// console.log(object.results)
// let tableData = "";
// var id =1;
//  object?.results.forEach((results)=>{
//  // console.log(results)

 
//  tableData += `<tr>
//  <td> ${id}</td>
//  <td> ${results.Battery}</td>
//  <td> ${results.Voltage}</td>
//  <td> ${results.Current}</td>
//  <td> ${moment(results.Timestamp).format('YYYY-MM-DD HH:mm:ss')
//  }</td>
//  </tr>`;
//  id++;
// });
// document.getElementById("table-body").innerHTML = tableData;
// })

