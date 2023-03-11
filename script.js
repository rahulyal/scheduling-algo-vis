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
    sjfScheduling(arrivalTimes, cpu, io);
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