// let arrivalTimes = [0, 2, 6];
// let cpuTimes = [[6, 1], [2], [1]];
// let ioTimes = [[1], [0], [0]];

// let arrivalTimes = [0, 2, 6];
// let cpuTimes = [[6,1], [2,NaN], [1,NaN]];
// let ioTimes = [[1,NaN], [NaN,NaN], [NaN,NaN]];

function fcfsScheduling(arrivalTimes, cpuTimes, ioTimes) {
  const n = arrivalTimes.length;
  const arrivedProcesses = [];
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
      if (arrivalTimes[i] === currentTime && !arrivedProcesses.includes(i)) {
        arrivedProcesses.push(i);
        readyQueue.push(i);
        processStates[i] = { state: 'ready', time: currentTime };
      }
    }

    // Check for processes just unblocked and put them into ready queue
    for (let i = 0; i < blockedQueue.length; i++) {
      const process = blockedQueue[i];
      if (ioTimes[process][0] === 0 || isNaN(ioTimes[process][0])) {
        readyQueue.push(process);
        blockedQueue.splice(i, 1);
        processStates[process] = { state: 'ready', time: currentTime };
        i--;
        continue;
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

    // Check if the running process has finished its CPU burst
    if (runningProcess !== null) {
      if (isNaN(cpuTimes[runningProcess][0]) || cpuTimes[runningProcess][0] === 0) {
        const cpuStartTime = currentTime - cpuTimesCopy[runningProcess][0];
        const cpuEndTime = currentTime;
        // record CPU start and end times for running process
        cpuStartTimes[runningProcess].push(cpuStartTime);
        cpuEndTimes[runningProcess].push(cpuEndTime);
        // If the process has no more CPU bursts, it is finished
        if (cpuTimes[runningProcess].length === 1 || isNaN(cpuTimes[runningProcess][1]) || 
          (cpuTimes[runningProcess].length == 2 && cpuTimes[runningProcess][1] === 0)) {
          processStates[runningProcess] = { state: 'terminated', time: currentTime };
          finishedCount++;
          completionTimes[runningProcess] = currentTime;
          turnaroundTimes[runningProcess] = currentTime - arrivalTimes[runningProcess];
          waitingTimes[runningProcess] = turnaroundTimes[runningProcess] - cpuSums[runningProcess] - ioSums[runningProcess];
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
      //   readyQueue.push(process);
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

fcfsScheduling(arrivalTimes, cpuTimes, ioTimes);