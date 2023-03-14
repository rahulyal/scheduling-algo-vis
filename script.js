var numberProcesses = 2
var numberTimes = 1
var algorithmOption = 0
//0 - All, 1- FIFO, 2-SJF
var roundRobinQuanta = 0
let arrivalTimes = [];
let cpuTimes = [];
//cpuTimes[0] --> 
let ioTimes = [];


function addRow(){
    getDataArray()
    saveDataTable()
    var processTable =document.getElementById("processEntryTable");
    if(numberProcesses==10){
        alert("Maximum Processes is 10!")
    }else{
        numberProcesses+=1
        var rowContent = "<tr id = \"process"+String(numberProcesses)+ "\">\n"
        rowContent+="<td>"+String(numberProcesses)+"</td>\n"
        rowContent+="<td><input type=\"text\" id=\"" +  String(numberProcesses)+"ARR\" /></td>\n"
        for(var j = 1;j<=numberTimes;j++){
            var rowClass = " class=\"cpugroup"+String(j)+"\""
            var rowIdCPU= " id=\"" +  String(numberProcesses)+"CPU"+String(j)+"\""
            var rowIdIO= " id=\"" +  String(numberProcesses)+"IO"+String(j)+"\""
            rowContent+="<td" +rowClass +"><input type=\"text\""+ rowIdCPU+"/></td>\n"
            rowContent+="<td" +rowClass +"><input type=\"text\""+ rowIdIO+"/></td>\n"
        }
        rowContent+="</tr>\n"
        processTable.innerHTML+=rowContent
    }
}

function calculateAverage(){
    getDataArray();
    //cpuTimes.shift();
    //ioTimes.shift();
    const cpu = cpuTimes.map(arr => arr.slice(1));
    const io = ioTimes.map(arr => arr.slice(1));
    console.log(arrivalTimes, cpu, io);
    getAlgo();
    var preemptive = true;
    if (algorithmOption === 1) {
        var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums]=fcfsScheduling(arrivalTimes, cpu, io);
        preemptive = false;
    }
    else if (algorithmOption === 2) {
        var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums]=sjfScheduling(arrivalTimes, cpu, io);
        preemptive = false;
    }
    else if (algorithmOption === 3) {
        var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums,ioStartTimes,ioEndTimes]=srtfScheduling(arrivalTimes, cpu, io);
    }
    else if (algorithmOption === 4) {
      // nonpreemptive priority
    }
    else if (algorithmOption === 5) {
        var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums,ioStartTimes,ioEndTimes]=ppScheduling(arrivalTimes, cpu, io);
    }
    else if (algorithmOption === 6) {
      if(!document.getElementById("roundRobinQuanta")){//No time quantum
        alert("Click Refresh to enter time quantum")
        return;
      }
        if(!isNaN(document.getElementById("roundRobinQuanta").value)){
          quanta = parseInt(document.getElementById("roundRobinQuanta").value)
          var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums,ioStartTimes,ioEndTimes]=rrScheduling(arrivalTimes, cpu, io, quanta);
        }else{
          alert("Not Valid Input")
          return;
        }
    }
    else if (algorithmOption === 7) {
      // const copyCPU = cpuTimes.map((x)=>x.map(y=>y))
      // console.log(copyCPU, "COPY CPU")
      var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums]=guaranScheduling(arrivalTimes, cpu, io);
      preemptive = false;
    }
    console.log(cpuSums,"SUMS")
    console.log(cpuStartTimes,cpuEndTimes,"CPU")
    outputTableData(responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums);
    if (!preemptive) {
      var [ioStartTimes,ioEndTimes]=generateIO(cpuStartTimes,cpuEndTimes)
    }
    drawGanttChart(cpuStartTimes,cpuEndTimes,ioStartTimes,ioEndTimes)
}

function getAlgo(){
    var algoChoice = document.getElementById("algo").value;
    if (algoChoice === "fcfs") {
      algorithmOption = 1;
      return;
    }    
    if (algoChoice === "sjf") {
      algorithmOption = 2;
      return;
    }
    if (algoChoice === "srtf") {
      algorithmOption = 3;
      return;
    }
    if (algoChoice === "pnp") {
      algorithmOption = 4;
      return;
    }
    if (algoChoice === "pp") {
      algorithmOption = 5;
      return;
    }
    if (algoChoice === "rr") {
      algorithmOption = 6;
      return;
    }
    if (algoChoice === "guaran") {
      algorithmOption = 7;
    }
}

function getDataArray(){//Stores data into arrays
    arrivalTimes=[]
    cpuTimes=[]
    ioTimes=[]
    for( var i = 1; i <=numberProcesses; i++ ) {
        arrivalTimes[i-1]= parseInt(document.getElementById(String(i)+"ARR").value)
        cpuRowArray=[]
        ioRowArray=[]
        for(var j = 1;j<=numberTimes;j++){
            cpuRowArray[j]= parseInt(document.getElementById(String(i)+"CPU"+String(j)).value)
            ioRowArray[j]= parseInt(document.getElementById(String(i)+"IO"+String(j)).value)

        }
        cpuTimes[i-1]=cpuRowArray
        ioTimes[i-1]= ioRowArray
    }
}


function saveDataTable(){//Inserts saved data back into input fields
    for( var i = 1; i <=numberProcesses; i++ ) {
        if(isNaN(arrivalTimes[i-1])==false){
            document.getElementById(String(i)+"ARR").defaultValue = arrivalTimes[i-1]
        }
        cpuRowArray=[]
        ioRowArray=[]
        for(var j = 1;j<=numberTimes;j++){
            if(isNaN(cpuTimes[i-1][j])==false){
                document.getElementById(String(i)+"CPU"+String(j)).defaultValue = cpuTimes[i-1][j]
            }
            if(isNaN(ioTimes[i-1][j])==false){
                document.getElementById(String(i)+"IO"+String(j)).defaultValue = ioTimes[i-1][j]
            }
        }

    }
    
}

function deleteRow(){
    if(numberProcesses>2){
        const element = document.getElementById("process" +String(numberProcesses));
        element.remove();
        numberProcesses-=1
    }else{
        alert("Error! Need at least two proccesses.")
    }
    
}

function deleteTimes(){
    if(numberTimes>1){
        const timesRemove = document.getElementsByClassName("cpugroup"+String(numberTimes))
        const headerRemove = document.getElementsByClassName("header"+String(numberTimes))
        headerRemove[0].remove()
        headerRemove[0].remove()
        for(j=0;j<numberProcesses;j++){
            timesRemove[0].remove()
            timesRemove[0].remove()

        }
        numberTimes-=1
    }else{
        alert("Error! Need at one CPU/IO Time.")
    }
    
}


function addMoreTimes(){
    if(numberTimes==5){
        alert("Maximum CPU/IO times is 5!")
    }else{
        getDataArray()
        saveDataTable()
        numberTimes+=1
        //Increase Columns and Headers:
        var tableHeaders =document.getElementById("tableHeadersInput");
        var rowContent = "<th class=\"header"+String(numberTimes)+ "\">CPU Time</th>"
        rowContent+=" <th class=\"header"+String(numberTimes)+ "\">I/O Time</th>"
        tableHeaders.innerHTML+=rowContent
        for( var i = 1; i <=numberProcesses; i++ ) {//Add Input fields
            var tableRow =document.getElementById("process"+String(i));
            var rowContent =""
            var rowIdCPU= " id=\"" +  String(i)+"CPU"+String(numberTimes)+"\""
            var rowClass = " class=\"cpugroup"+String(numberTimes)+"\""
            var rowIdIO= " id=\"" +  String(i)+"IO"+String(numberTimes)+"\""
            rowContent+="<td" +rowClass +"><input type=\"text\""+ rowIdCPU+"/></td>\n"
            rowContent+="<td" +rowClass +"><input type=\"text\""+ rowIdIO+"/></td>\n</tr>\n"
            tableRow.innerHTML+=rowContent
        }
    }
}

function refreshInput(){
  getAlgo()
  if(algorithmOption==6){//Round Robin: Add Input Fields
    if(!document.getElementById("roundRobinQuanta")){//Create Input Time if not there already
      elementUI=document.getElementById("UI")
      elementUI.innerHTML+="<input type=\"text\" id=\"roundRobinQuanta\" />"
      document.getElementById("roundRobinQuanta").defaultValue="Enter Time Quantum"
    }
  }

}

function clearArray(arr){
    arr.splice(0,arr.length)
}


function avgArray(arr){
    var sum = 0.0
    arr.forEach(item => {sum += item;});
    return sum/arr.length
}

function outputTableData(responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums){
    ioTimesCopy=[]
    var ioSums = []
    for(var i =0;i<numberProcesses;i++){
      ioTimesCopy.push(ioTimes[i].filter(function(item){return !isNaN(item)}))
      ioSums[i]=0
      ioTimesCopy[i].forEach(item => {ioSums[i] += item;});
    }
    var processOutputTable =document.getElementById("addOutputRow");
    processOutputTable.innerHTML=""
    for(var i =0;i<numberProcesses;i++){
      var rowContent = "<tr id = \"outputProcess"+String(i+1)+ "\">\n"
      rowContent+="<td>"+String(i+1)+"</td>"//Process Number
      rowContent+="<td>"+arrivalTimes[i]+"</td>"//Arrival Number
      rowContent+="<td>"+cpuSums[i]+"</td>"//CPU Total
      rowContent+="<td>"+ioSums[i]+"</td>"//IO Total
      rowContent+="<td>"+completionTimes[i]+"</td>"//Completion Time
      rowContent+="<td>"+waitingTimes[i]+"</td>"//Waiting Time
      rowContent+="<td>"+turnaroundTimes[i]+"</td>"//Turnaround Time
      rowContent+="<td>"+responseTimes[i]+"</td>"//Response Time
      rowContent+="</tr>\n"
      processOutputTable.innerHTML+=rowContent
    }
    var rowContent = "<tr id = \"averageResults\">\n"
    rowContent+="<td>Avg</td>"//Process Number
    rowContent+="<td>"+avgArray(arrivalTimes).toFixed(2)+"</td>"//Arrival Number
    rowContent+="<td>"+avgArray(cpuSums).toFixed(2)+"</td>"//CPU Total
    rowContent+="<td>"+avgArray(ioSums).toFixed(2)+"</td>"//IO Total
    rowContent+="<td>"+avgArray(completionTimes).toFixed(2)+"</td>"//Completion Time
    rowContent+="<td>"+avgArray(waitingTimes).toFixed(2)+"</td>"//Waiting Time
    rowContent+="<td>"+avgArray(turnaroundTimes).toFixed(2)+"</td>"//Turnaround Time
    rowContent+="<td>"+avgArray(responseTimes).toFixed(2)+"</td>"//Response Time
    rowContent+="</tr>\n"
    processOutputTable.innerHTML+=rowContent
  }

function drawGanttChart(cpuStart,cpuStop,ioStart,ioStop){
  var lowestTime = findLowest(cpuStart)
  var highestTime = findHighest(ioStop, cpuStop)
  console.log(lowestTime,highestTime,"TIMES")
  deltaTime = highestTime-lowestTime;
  pixelPerSecond = Math.floor(1260.00/deltaTime)
  var maxWidthGantt=0
  var startYPointGantt = 5;
  var scrollTable = (pixelPerSecond<1)
  timeProp="height=\"30\""
  if(scrollTable){//Add hor. scroll:More space needed for Gantt
    maxWidthGantt = deltaTime+140
    document.getElementById("ganttChartInsert").style.overflowx = "scroll";
    pixelPerSecond=1
  }else{
    maxWidthGantt=1400
    document.getElementById("ganttChartInsert").style.overflowx = "hidden";
  }
  var maxHeightGantt = 40*numberProcesses+30
  var ganttChartTable = document.getElementById("ganttChartInsert");
  ganttChartTable.innerHTML=""
  var ganttContent = "<svg class=\"ganntCPU\" width=\""+String(maxWidthGantt+String(highestTime).length*13-25)+ "\"height=\""+String(maxHeightGantt)+"\">"
  for(i=0;i<numberProcesses;i++){//Add Gantt Rows
    ganttContent+="<rect class =\"gannt"+String(i%2==0)+"Row\" width=\""+String(maxWidthGantt-25)+"\" height=\"40\" x = \"5\" y = \"" +String(startYPointGantt+i*40)+"\"/>"
    ganttContent+="<text x=\"15\" y=\""+String(25+startYPointGantt+i*40)+ " font-size=\"20px\" fill=\"Black\">Process "+String(i+1)+"</text>"
    for(j = 0;j<cpuStart[i].length;j++){//Create CPU Blocks
      var wiCPU = String((cpuStop[i][j]-cpuStart[i][j])*pixelPerSecond)
      var xCPU = (cpuStart[i][j]-lowestTime)*pixelPerSecond+115
      console.log(wiCPU,i,pixelPerSecond)
      ganttContent+="<rect class=\"ganntCPU\" width=\""+wiCPU+"\" height=\"30\" x = \""+xCPU+"\" y = \""+String(5+startYPointGantt+40*i)+"\" />"
    } 
    for(var j =0;j<ioStop[i].length;j++){//Create IO Blocks
      var wiIO = String((ioStop[i][j]-ioStart[i][j])*pixelPerSecond)
      var xIO = (ioStart[i][j]-lowestTime)*pixelPerSecond+115
      ganttContent+="<rect class=\"ganntIO\" width=\""+wiIO+"\" height=\"30\" x = \""+xIO+"\" y = \""+String(5+startYPointGantt+40*i)+"\" />"
    }
  }
  //Create Lines:
  yStartingLine = "y1=\""+String(numberProcesses*40+startYPointGantt+1)+"\""
  yEndingLine = " y2=\""+String(numberProcesses*40+startYPointGantt+25)+"\""
  lineStringData =  "stroke-dasharray=\"5,5\" d=\"M5 40 l215 0\"/>"
  //First Line with Starting Time
  ganttContent+="<line class = \"lineGantt\""+"x1=\"113\" x2=\"113\" y1=\""+String(startYPointGantt)+"\""+yEndingLine+lineStringData
  ganttContent+="<text x=\""+String(118)+"\" y=\""+String(20+startYPointGantt+numberProcesses*40)+ " font-size=\"15px\" fill=\"Gray\">"+String(lowestTime)+"</text>"
  if(scrollTable){//Create evenly spaced Time Lines
    var pixelLocation = 150
    while(pixelLocation<=deltaTime-100){
      var x = 115+pixelLocation
      xPos = "x1=\""+String(x)+"\" x2=\""+String(x)+"\""
      ganttContent+="<line class = \"lineGantt\""+xPos +yStartingLine+yEndingLine+ lineStringData
      ganttContent+="<text x=\""+String(x+5)+"\" y=\""+String(20+startYPointGantt+numberProcesses*40)+ " font-size=\"15px\" fill=\"Gray\">"+String(pixelLocation)+"</text>"
      pixelLocation+=150
    }
  }else{
    interval = findInterval(deltaTime)
    timeSpace = Math.floor(deltaTime/interval)
    for(var i=1;i<interval;i++){//Create Evenly spaced Time Lines
      var x = 115+i*timeSpace*pixelPerSecond
      xPos = "x1=\""+String(x)+"\" x2=\""+String(x)+"\""
      ganttContent+="<line class = \"lineGantt\""+xPos +yStartingLine+yEndingLine+ lineStringData
      ganttContent+="<text x=\""+String(x+5)+"\" y=\""+String(20+startYPointGantt+numberProcesses*40)+ " font-size=\"15px\" fill=\"Gray\">"+String(lowestTime+i*timeSpace)+"</text>"
    }
  }
  //Last Line with Ending Time
  x = 115+deltaTime*pixelPerSecond
  xPos = "x1=\""+String(x)+"\" x2=\""+String(x)+"\""
  ganttContent+="<line class = \"lineGantt\""+xPos +yStartingLine+yEndingLine+ lineStringData
  ganttContent+="<text x=\""+String(x+5)+"\" y=\""+String(20+startYPointGantt+numberProcesses*40)+ " font-size=\"15px\" fill=\"Gray\">"+String(highestTime)+"</text>"
  ganttContent+="</svg>";
  ganttChartTable.innerHTML+=ganttContent
  console.log("HI")



}

function generateIO(cpuStart,cpuStop,){
    var ioTimesCopy=[]
    for(var i =0;i<numberProcesses;i++){
      ioTimesCopy.push(ioTimes[i].filter(function(item){return !isNaN(item)}))
    }
    ioStart=[]
    ioStop=[]
    for(var i =0;i<numberProcesses;i++){//For each process
      ioStart.push([])
      ioStop.push([])
      for(j = 0;j<ioTimesCopy[i].length;j++){//For each IO Time, add start and stop
        ioStart[i].push(cpuStop[i][j])
        ioStop[i].push(cpuStop[i][j]+ioTimesCopy[i][j])
      }
    }
    console.log(ioStart)
    console.log(ioStop)
    return [ioStart,ioStop]
  }

function findLowest(arr){
  lowestValue = arr[0][0];
  for(var i = 0;i<arr.length;i++){
    for(var j=0;j<arr[i].length;j++){
      if(lowestValue>arr[i][j]){
        lowestValue = arr[i][j]
      }
    }
  }
  return lowestValue
}

function findHighest(arr1,arr2){
    highestValue=0  
    for(var i = 0;i<arr1.length;i++){
        for(var j=0;j<arr1[i].length;j++){
            if(highestValue<arr1[i][j]){
                highestValue = arr1[i][j]
            }
        }
    }
    for(var i = 0;i<arr2.length;i++){
        for(var j=0;j<arr2[i].length;j++){
            if(highestValue<arr2[i][j]){
                highestValue = arr2[i][j]
            }
        }
    }
    return highestValue
}

function findInterval(deltaTime){//Find nice intervals that give less space
  if(deltaTime<=5){
    return deltaTime
  }
  var i =5.0
  var interval = 5.0
  var low = deltaTime/i-Math.floor(deltaTime/i)
  while(i<=10.0){
    var lowI = deltaTime/i-Math.floor(deltaTime/i)
    console.log(lowI,i)
    if(lowI<=low){
      low=lowI
      interval=i
    }
    i+=1.000;
  }
  return Math.floor(interval);
}