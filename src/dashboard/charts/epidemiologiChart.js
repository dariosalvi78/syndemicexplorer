/*var data = [
  {
    key: 'ExampleData',
    values: [
      [10000000, 10024900],
      [21241, 21414],
    ],
  },
];

nv.addGraph(function () {
  var chart = nv.models
    .cumulativeLineChart()
    .x(function (d) {
      return d[0];
    })
    //adjusting, 100% is 1.00, not 100 as it is in the data
    .y(function (d) {
      return d[1] / 100;
    })
    .color(d3.scale.category10().range())
    .useInteractiveGuideline(true);
  chart.xAxis.tickFormat(function (d) {
    return d3.time.format('%x')(new Date(d));
  });

  chart.yAxis.tickFormat(d3.format(',.1%'));

  d3.select('#chart svg').datum(data).transition().duration(500).call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});
*/

const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Confirmed Cases',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};
const config = {
  type: 'line',
  data: data,
  options: {},
};
const myChart = new Chart(document.getElementById('myChart'), config);
