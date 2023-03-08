function calculateGanttChart() {
  // Get the input values for p1
  const p1ArrivalTime = parseInt(document.getElementById("p1-arrival-time").value);
  const p1CpuTime = parseInt(document.getElementById("p1-cpu-time").value);
  const p1IoTime = parseInt(document.getElementById("p1-io-time").value);

  // Get the input values for p2
  const p2ArrivalTime = parseInt(document.getElementById("p2-arrival-time").value);
  const p2CpuTime = parseInt(document.getElementById("p2-cpu-time").value);
  const p2IoTime = parseInt(document.getElementById("p2-io-time").value);

  // Calculate the start and end times for each process
  const p1StartTime = p1ArrivalTime;
  const p1EndTime = p1StartTime + p1CpuTime + p1IoTime;
  const p2StartTime = p2ArrivalTime > p1EndTime ? p2ArrivalTime : p1EndTime;
  const p2EndTime = p2StartTime + p2CpuTime + p2IoTime;

// Calculate completion time, waiting time, turnaround time and response time for each process
const p1CompletionTime = p1EndTime;
const p1WaitingTime = p1StartTime - p1ArrivalTime;
const p1TurnaroundTime = p1CompletionTime - p1ArrivalTime;
const p1ResponseTime = p1StartTime - p1ArrivalTime;

const p2CompletionTime = p2EndTime;
const p2WaitingTime = p2StartTime - p2ArrivalTime;
const p2TurnaroundTime = p2CompletionTime - p2ArrivalTime;
const p2ResponseTime = p2StartTime - p2ArrivalTime;

// Display the output table
const outputTable = document.getElementById("output-table");
outputTable.innerHTML = `
<thead> 
  <tr> 
    <th>Process ID</th> 
    <th>Completion Time</th> 
    <th>Waiting Time</th> 
    <th>Turnaround Time</th> 
    <th>Response Time</th> 
  </tr>
</thead> 
<tbody> 
  <tr> 
  <td>P1</td> 
  <td>${p1CompletionTime}</td> 
  <td>${p1WaitingTime}</td> 
  <td>${p1TurnaroundTime}</td>
  <td>${p1ResponseTime}</td> 
  </tr> 
<tr> 
  <td>P2</td> 
  <td>${p2CompletionTime}</td> 
  <td>${p2WaitingTime}</td> 
  <td>${p2TurnaroundTime}</td> 
  <td>${p2ResponseTime}</td> 
</tr>
</tbody>
`
// Show the output table
outputTable.style.display = "table";

google.charts.load('current', {'packages':['gantt']});
google.charts.setOnLoadCallback(drawChart);

var data = new google.visualization.DataTable();
data.addColumn('string', 'Task ID');
data.addColumn('string', 'Task Name');
data.addColumn('date', 'Start Date');
data.addColumn('date', 'End Date');
data.addColumn('number', 'Duration');
data.addColumn('number', 'Percent Complete');
data.addColumn('string', 'Dependencies');

// Add rows for each task
data.addRows([
  ['P1', 'Process 1', new Date(2023, 3, 1), new Date(2023, 3, 1, 0, p1CompletionTime), null, 100, null],
  ['P2', 'Process 2', new Date(2023, 3, 1, 0, p1CompletionTime + contextSwitchTime), new Date(2023, 3, 1, 0, p1CompletionTime + contextSwitchTime + p2CompletionTime), null, 100, null]
]);

var options = {
  height: 275,
  gantt: {
    trackHeight: 30
  }
};

var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

chart.draw(data, options);

}
google.charts.load('current', {'packages':['gantt']});
    google.charts.setOnLoadCallback(drawChart);

    function daysToMilliseconds(days) {
      return days * 24 * 60 * 60 * 1000;
    }

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

      data.addRows([
        ['Research', 'Find sources',
         new Date(2015, 0, 1), new Date(2015, 0, 5), null,  100,  null],
        ['Write', 'Write paper',
         null, new Date(2015, 0, 9), daysToMilliseconds(3), 25, 'Research,Outline'],
        ['Cite', 'Create bibliography',
         null, new Date(2015, 0, 7), daysToMilliseconds(1), 20, 'Research'],
        ['Complete', 'Hand in paper',
         null, new Date(2015, 0, 10), daysToMilliseconds(1), 0, 'Cite,Write'],
        ['Outline', 'Outline paper',
         null, new Date(2015, 0, 6), daysToMilliseconds(1), 100, 'Research']
      ]);

      var options = {
        height: 275
      };

      var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

      chart.draw(data, options);
    }