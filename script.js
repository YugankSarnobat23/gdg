const TOTAL = 100;

const subsystems = [
"Propulsion",
"Defense",
"Navigation",
"Communication"
];

let power = {
Propulsion:0,
Defense:0,
Navigation:0,
Communication:0
};

const container = document.getElementById("systems");

/* create subsystem panels */

subsystems.forEach(name => {

const div=document.createElement("div");

div.className="system";

div.innerHTML=`

<h3>${name}</h3>

<div class="controls">

<button onclick="change('${name}',-5)">-</button>

<input id="${name}" value="0" readonly>

<button onclick="change('${name}',5)">+</button>

</div>

<div class="bar">

<div class="fill" id="${name}-bar"></div>

</div>
`;

container.appendChild(div);

});

/* change power */

function change(system,amount){

power[system]+=amount;

if(power[system]<0){
power[system]=0;
}

update();

}

/* update UI */

function update(){

let used=Object.values(power).reduce((a,b)=>a+b,0);

if(used>TOTAL){

document.getElementById("warning").innerText="⚠ ARC REACTOR OVERLOAD";
return;

}

document.getElementById("warning").innerText="";

subsystems.forEach(s=>{

document.getElementById(s).value=power[s];

let percent=(power[s]/TOTAL)*100;

document.getElementById(s+"-bar").style.width=percent+"%";

});

document.getElementById("remaining").innerText=TOTAL-used;

}

/* text commands */

function runCommand(){

let command=document
.getElementById("commandInput")
.value
.toLowerCase();

processCommand(command);

}

/* command processor */

function processCommand(command){

let response="Command not recognized";

if(command.includes("propulsion")){
change("Propulsion",10);
response="Boosting propulsion";
}

else if(command.includes("defense")){
change("Defense",10);
response="Defense systems reinforced";
}

else if(command.includes("navigation")){
change("Navigation",10);
response="Navigation boosted";
}

else if(command.includes("communication")){
change("Communication",10);
response="Communication boosted";
}

else if(command.includes("balance")){

let each=Math.floor(TOTAL/subsystems.length);

subsystems.forEach(s=>power[s]=each);

update();

response="Balancing power across systems";
}

else if(command.includes("reset")){

subsystems.forEach(s=>power[s]=0);

update();

response="All systems reset";
}

document.getElementById("jarvisResponse").innerText="JARVIS: "+response;

speak(response);

}

/* voice response */

function speak(text){

const speech=new SpeechSynthesisUtterance();

speech.text=text;
speech.rate=1;
speech.pitch=0.9;

speechSynthesis.speak(speech);

}

/* microphone commands */

function startListening(){

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition=new SpeechRecognition();

recognition.lang="en-US";

recognition.start();

document.getElementById("jarvisResponse").innerText="JARVIS: Listening...";

recognition.onresult=function(event){

let speech=event.results[0][0].transcript.toLowerCase();

processCommand(speech);

};

}
