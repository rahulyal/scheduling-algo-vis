let arrivalTimes = [0, 2, 6];
let cpuTimes = [[6,1], [2], [1]];
let ioTimes = [[1], [0], [0]];

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
    let cpuSums = cpuTimes.map(process => process.reduce((acc, curr) => acc + curr));
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
        readyQueue.push(i);
        processStates[i] = { state: 'ready', time: currentTime };
      }
    }

    // Sort the ready queue by remaining CPU time
    readyQueue.sort((a, b) => {
      const remainingTimeA = cpuTimes[a].reduce((acc, curr) => acc + curr);
      const remainingTimeB = cpuTimes[b].reduce((acc, curr) => acc + curr);
      return remainingTimeA - remainingTimeB;
    });

    // Check if the running process has finished its CPU burst
    if (runningProcess !== null) {
      cpuTimes[runningProcess][0]--;
      if (cpuTimes[runningProcess][0] === 0) {
        const cpuStartTime = currentTime - cpuTimesCopy[runningProcess][0];
        const cpuEndTime = currentTime;
        // record CPU start and end times for running process
        cpuStartTimes[runningProcess].push(cpuStartTime);
        cpuEndTimes[runningProcess].push(cpuEndTime);
        // If the process has no more CPU bursts, it is finished
        if (cpuTimes[runningProcess].length === 1) {
          processStates[runningProcess] = { state: 'terminated', time: currentTime };
          finishedCount++;
          completionTimes[runningProcess] = currentTime;
          turnaroundTimes[runningProcess] = currentTime - arrivalTimes[runningProcess];
          waitingTimes[runningProcess] = turnaroundTimes[runningProcess] - cpuSums[runningProcess];
        } else {
          // If the process has more CPU bursts, it is blocked
          blockedQueue.push(runningProcess);
          processStates[runningProcess] = { state: 'blocked', time: currentTime };
          cpuTimes[runningProcess].shift();
          cpuTimesCopy[runningProcess].shift();
        }
        runningProcess = null;
      }
    }

    // Check if a blocked process has finished its IO burst
    for (let i = 0; i < blockedQueue.length; i++) {
      const process = blockedQueue[i];
      ioTimes[process][0]--;
      if (ioTimes[process][0] === 0) {
        readyQueue.push(process);
        blockedQueue.splice(i, 1);
        processStates[process] = { state: 'ready', time: currentTime };
        i--;
      }
    }

    // If there is no running process, take the first process in the ready queue
    if (runningProcess === null && readyQueue.length > 0) {
      runningProcess = readyQueue.shift();
      if (responseTimes[runningProcess] === null) {
        processStates[runningProcess] = { state: 'running', time: currentTime };
        responseTimes[runningProcess] = currentTime - arrivalTimes[runningProcess];
      } else if (processStates[runningProcess].state !== 'running') {
        processStates[runningProcess].state = 'running';
      }
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
  }
    console.log('Response times:', responseTimes);
    console.log('Turnaround times:', turnaroundTimes);
    console.log('Completion times:', completionTimes);
    console.log('Waiting times:', waitingTimes);
    console.log('Total CPU times:', cpuSums);
    console.log('CPU Start times:', cpuStartTimes);
    console.log('CPU End times:', cpuEndTimes);
}

sjfScheduling(arrivalTimes, cpuTimes, ioTimes);