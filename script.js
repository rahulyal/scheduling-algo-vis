var numberProcesses = 2
var numberTimes = 1
var algorithmOption = 0
//0 - All, 1- FIFO, 2-SJF

const arrivalTimes = [];
const cpuTimes = [];
//cpuTimes[0] --> 
const ioTimes = [];


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
    if (algorithmOption == 1) {
        var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums]=fcfsScheduling(arrivalTimes, cpu, io);
    }
    else if (algorithmOption == 2) {
        var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums]=sjfScheduling(arrivalTimes, cpu, io);
    }
    else if (algorithmOption == 3) {
        var [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums]=srtfScheduling(arrivalTimes, cpu, io);
    }
    
    outputTableData(responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums);
}

function getAlgo(){
    var algoChoice = document.getElementById("algo").value;
    if (algoChoice == "fcfs") {
        algorithmOption = 1;
        return;
    }    
    if (algoChoice == "sjf") {
        algorithmOption = 2;
        return;
    }
    if (algoChoice == "srtf") {
        algorithmOption = 3;
        return;
    }
}

function getDataArray(){//Stores data into arrays
    for( var i = 1; i <=numberProcesses; i++ ) {
        arrivalTimes[i-1]= parseFloat(document.getElementById(String(i)+"ARR").value)
        cpuRowArray=[]
        ioRowArray=[]
        for(var j = 1;j<=numberTimes;j++){
            cpuRowArray[j]= parseFloat(document.getElementById(String(i)+"CPU"+String(j)).value)
            ioRowArray[j]= parseFloat(document.getElementById(String(i)+"IO"+String(j)).value)

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

