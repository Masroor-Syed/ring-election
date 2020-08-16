<script>
  export let id;
  export let name;
  export let xloc;
  export let yloc;
  export let state;
  const radius = 50;

  $: fill = getFillFromState(state);
  function getFillFromState(t) {
    if (t === "r") {
      return "#AAD8E6";
    }
    if (t === "n") {
      return "#FFEEDB";
    }
    if (t === "l") {
      return "#D0F0C0";
    }
  }

  $: pState = getTextFromState(state);
  function getTextFromState(t) {
    if (t === "r") {
      return "Running";
    }
    if (t === "n") {
      return "Not Running";
    }
    if (t === "l") {
      return "Leader Elected";
    }
  }
</script>

<g>
  <g {id}>
    <!-- process node -->
    <circle
      stroke="black"
      stroke-width="0px"
      {fill}
      cx={xloc}
      cy={yloc}
      r={radius} />
    <!-- process name  -->
    <text
      font-weight="bold"
      x={xloc}
      y={yloc}
      dominant-baseline="central"
      text-anchor="middle"
      stroke-width="1px">
      {name}
    </text>
    <text
      x={xloc}
      y={parseInt(yloc) + radius + 15}
      font-size="0.75em"
      stroke-width="1px"
      text-anchor="middle"
      dominant-baseline="central">
      {pState}
    </text>
  </g>

</g>
