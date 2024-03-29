// let arrivalTimes = [0, 2, 6];
// let cpuTimes = [[6,1], [2], [1]];
// let ioTimes = [[1], [0], [0]];

// let arrivalTimes = [0, 0,5];
// let cpuTimes = [[3,2], [2,6],[1]];
// let ioTimes = [[3,NaN], [1,NaN],[1]];

function sjfScheduling(arrivalTimes, cpuTimes, ioTimes) {
    const n = arrivalTimes.length;
    const readyQueue = [];
    const blockedQueue = [];
    const processStates = [];
    let currentTime = 0;
    let finishedCount = 0;
    let runningProcess = null;
    let responseTimes = Array(n).fill(null);
    let turnaroundTimes = Array(n).fill(0);
    let completionTimes = Array(n).fill(0);
    let waitingTimes = Array(n).fill(0);
    // let cpuSums = cpuTimes.map(process => process.reduce((acc, curr) => acc + curr));
    let cpuSums = cpuTimes.map(process => process.filter(t => !isNaN(t)).reduce((acc, curr) => acc + curr, 0));
    let ioSums = Array(n).fill(0);
    const cpuStartTimes = Array(n).fill(null).map(_ => []);
    const cpuEndTimes = Array(n).fill(null).map(_ => []);
    let cpuTimesCopy = [];
    for (let i = 0; i < cpuTimes.length; i++) {
      cpuTimesCopy[i] = [...cpuTimes[i]];
    }


  while (finishedCount < n) {
    // Check if there are any processes that arrived at the current time
    for (let i = 0; i < n; i++) {
      if (arrivalTimes[i] === currentTime) {
        readyQueue.push({ id: i, cpuBurst: cpuTimes[i][0] });
        console.log(readyQueue, currentTime, "READY")
        processStates[i] = { state: 'ready', time: currentTime };
      }
    }
    console.log(readyQueue,"AFTERLOOP")

    // Check for processes just unblocked and put them into ready queue
    for (let i = 0; i < blockedQueue.length; i++) {
      const process = blockedQueue[i];
      if (ioTimes[process][0] === 0 || isNaN(ioTimes[process][0])) {
        ioTimes[process].shift();
        readyQueue.push({ id: process, cpuBurst: cpuTimes[process][0] });
        blockedQueue.splice(i, 1);
        processStates[process] = { state: 'ready', time: currentTime };
        i--;
        continue;
      }
    }

    if(readyQueue.length>0){// Sort the ready queue by remaining CPU time
      //sortShortest(readyQueue, cpuEndTimes, cpuTimes)
      readyQueue.sort(function(p1, p2) { return p1.cpuBurst - p2.cpuBurst } );
    }

    // If there is no running process, take the first process in the ready queue
    if (runningProcess === null && readyQueue.length > 0) {
      runningProcess = readyQueue.shift().id;
      if (responseTimes[runningProcess] === null) {
        processStates[runningProcess] = { state: 'running', time: currentTime };
        responseTimes[runningProcess] = currentTime - arrivalTimes[runningProcess];
      } else if (processStates[runningProcess].state !== 'running') {
        processStates[runningProcess].state = 'running';
      }
    }
    
    // Check if the running process has finished its CPU burst
    if (runningProcess !== null) {
      if (isNaN(cpuTimes[runningProcess][0]) || cpuTimes[runningProcess][0] === 0) {
        const cpuStartTime = currentTime - cpuTimesCopy[runningProcess][0];
        const cpuEndTime = currentTime;
        // record CPU start and end times for running process
        cpuStartTimes[runningProcess].push(cpuStartTime);
        cpuEndTimes[runningProcess].push(cpuEndTime);
        // If the process has no more CPU bursts, it is finished
        if (cpuTimes[runningProcess].length === 1 || isNaN(cpuTimes[runningProcess][1])) {
          processStates[runningProcess] = { state: 'terminated', time: currentTime };
          finishedCount++;
          completionTimes[runningProcess] = currentTime;
          turnaroundTimes[runningProcess] = currentTime - arrivalTimes[runningProcess];
          waitingTimes[runningProcess] = turnaroundTimes[runningProcess] - cpuSums[runningProcess]- ioSums[runningProcess];
        } else {
          // If the process has more CPU bursts, it is blocked
          blockedQueue.push(runningProcess);
          processStates[runningProcess] = { state: 'blocked', time: currentTime };
          cpuTimes[runningProcess].shift();
          cpuTimesCopy[runningProcess].shift();
        }
        runningProcess = null;
        continue;
      }
      cpuTimes[runningProcess][0]--;
    }

    // Check if a blocked process has finished its IO burst
    for (let i = 0; i < blockedQueue.length; i++) {
      const process = blockedQueue[i];
      // if (ioTimes[process][0] === 0 || isNaN(ioTimes[process][0])) {
      //   ioTimes[process].shift();
      //   readyQueue.push({ id: process, cpuBurst: cpuTimes[process][0] });
      //   blockedQueue.splice(i, 1);
      //   processStates[process] = { state: 'ready', time: currentTime };
      //   i--;
      //   continue;
      // }
      ioTimes[process][0]--;
      ioSums[process]++;
    }

    // Output the state of each process at the current time
    console.log(`Time: ${currentTime}`);
    for (let i = 0; i < n; i++) {
      if (processStates[i] === undefined || processStates[i].time > currentTime) {
        console.log(`Process ${i}: not arrived yet`);
      } else {
        console.log(`Process ${i}: ${processStates[i].state}`);
      }
    }
    console.log('------');
    
    // Increment the current time
    currentTime++;
    console.log('Finished Count:', finishedCount);
  }
    console.log('Response times:', responseTimes);
    console.log('Turnaround times:', turnaroundTimes);
    console.log('Completion times:', completionTimes);
    console.log('Waiting times:', waitingTimes);
    console.log('Total CPU times:', cpuSums);
    console.log('CPU Start times:', cpuStartTimes);
    console.log('CPU End times:', cpuEndTimes);
    return [responseTimes,turnaroundTimes,completionTimes,waitingTimes,cpuStartTimes,cpuEndTimes,cpuSums]
}
sjfScheduling(arrivalTimes, cpuTimes.map((x)=>x.map(y=>y)),ioTimes.map((x)=>x.map(y=>y)))

function sortShortest(readyQu, cpuEndTimes, cpuTimes){
  var shortestProcess = readyQu[0].id;
  var processIndex =0
  console.log(readyQu, "hI")
  
  var shortestJob = cpuTimes[shortestProcess][cpuEndTimes[shortestProcess].length]
  console.log(cpuEndTimes, "JI")
  for(var i = 0;i< readyQu.length;i++){
    process = readyQu[i].id
    if(cpuTimes[process][cpuEndTimes[process].length]<shortestJob){
      shortestJob = cpuTimes[process][cpuEndTimes[process].length];
      processIndex = i;
      shortestProcess = process
    }
  }
  console.log(shortestJob, "JI")
  readyQu.splice(processIndex, 1);
  readyQu.unshift({ id: shortestProcess, cpuBurst: shortestJob })
  console.log(readyQu, "hI")
}
console.log(cpuTimes)