<script>
  export let from;
  export let to;
  export let pcount;
  export let color;
  export let text;
  let pid = `${to}-${from}`;

  function getPosFromNum(num, radius) {
    const o = {
      x: 450 + radius * Math.sin(((2 * Math.PI) / pcount) * num),
      y: 300 + radius * -Math.cos(((2 * Math.PI) / pcount) * num)
    };
    return o;
  }
  $: mid_pos = getPosFromNum(
    (parseInt(to) + parseInt(from)) / 2.0,
    r + outerRadiusDiff + (pcount - pcount)
  );
  function calculatePointBetween(f, t, distance) {
    const dx = t.x - f.x;
    const dy = f.y - t.y;
    const angle = Math.atan2(dy, dx);
    const xdiff = distance * Math.cos(angle);
    const ydiff = distance * -Math.sin(angle);
    const point = { x: f.x + xdiff, y: f.y + ydiff };
    return point;
  }

  function getArrowStartEnd(from, to,pcount) {
    let a = pcount;
    let outerRadiusDiff = 50;
    let r = 250;
    let from_pos = getPosFromNum(parseInt(from), r);
    let to_pos = getPosFromNum(parseInt(to), r);
    let mid_pos = getPosFromNum(
      (parseInt(to) + parseInt(from)) / 2.0,
      r + outerRadiusDiff
    );
    const start_pt = calculatePointBetween(from_pos, mid_pos, 50);
    const end_pt = calculatePointBetween(to_pos, mid_pos, 55);
    const o = {
      start: start_pt,
      end: end_pt
    };
    return o;
  }

  let outerRadiusDiff = 50;
  let r = 250;

  $: arrow = getArrowStartEnd(from, to,pcount);
</script>

<g>
<path
  id="arrow-{pid}"
  d="M {arrow.start.x}
  {arrow.start.y} Q {mid_pos.x}
  {mid_pos.y}
  {arrow.end.x}
  {arrow.end.y}
  "
  stroke={color}
  fill="transparent"
  stroke-width="2"
  marker-end="url(#head)" />

  <text font-size="1.5rem" text-anchor="middle" dominant-baseline="hanging">
    <textPath startOffset="50%" href="#arrow-{pid}" >
      {text}
    </textPath>
  </text>

</g>
