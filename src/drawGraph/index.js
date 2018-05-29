module.exports = (nodes, edges, id) => {
  var smooth = {
    enabled: true,
    type: 'cubicBezier',
    roundness: 1
  };
  edges.forEach(element => {
    element.arrows = 'to';
    element.smooth = smooth;
  });

  return `
    <div class="graph-container" id="${id}"></div>
    <script type="text/javascript">
      new vis.Network(
        document.getElementById('${id}'),
        {
          nodes: new vis.DataSet(${JSON.stringify(nodes)}),
          edges: new vis.DataSet(${JSON.stringify(edges)})
        },
        {
          interaction: {
            zoomView: false
          },
          physics: {
            enabled: false
          }
        });
    </script>
  `
};