<script>
  import Process from "./Process.svelte";
  import Arrow from "./Arrow.svelte";
  import { Simulation } from "./index.js";
  import { onMount } from "svelte";

  let pcount = 4;
  let starter = 1;
  let processViews;
  let black = "black";
  let red = "red";
  $: sim = new Simulation(pcount, starter, processNames);
  let pNames = "1,2,3,4";

  function getViewsFrom(s) {
    if (sim) {
      if (!sim.processes) {
        return [];
      }
    }
    return sim.processes.map(p => p.getState());
  }

  // get process info for rendering
  $: processViews = [...getViewsFrom(sim)];
  console.log(pNames.split(",").map(Number));
  $: processNames = pNames.split(",").map(Number);

  function handleClick() {
    sim.step();
    processViews = sim.processes.map(p => p.getState());
  }

  let interval;

  function setSpeedStep() {
    clearInterval(interval);
  }

  function setSpeedRegular() {
    clearInterval(interval);
    interval = setInterval(() => {
      handleClick();
    }, 1000);
  }

  function setSpeedFast() {
    clearInterval(interval);
    interval = setInterval(() => {
      handleClick();
    }, 300);
  }

  onMount(() => {
    return () => {
      clearInterval(interval);
    };
  });

  let w_width = 1024;
  let w_height = 768;
  $: svg_side = Math.min(w_width - 300, w_height);

  function getProcessNames() {
    console.log(processNames);
  }
</script>

<style>
  div#options {
    width: 300px;
    /* position: fixed; */
    top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  div.option {
    margin: 1rem;
  }
  #procs {
    text-align: left;
  }
  #procs div {
    text-align: center;
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    flex: 1;
  }
  #procs div input {
    padding: 0.5rem;
    margin: 0rem 1rem 0rem 0rem;
  }
  #times div div {
    display: flex;
    justify-content: space-evenly;
  }
  #times div div input {
    margin: 0;
    padding: 0;
    width: 3rem;
  }
  #times div div span {
    /* min-width: 4rem; */
    align-self: flex-end;
    text-align: end;
    height: 100%;
    padding: 0 0.25rem 0 0;
  }

  #speed {
    display: flex;
    justify-content: stretch;
  }
  #speed button {
    flex: 1;
    margin: 0rem 0.25rem;
    padding: 0.125rem;
    text-align: center;
  }
  #speed button svg {
    width: 1rem;
    height: 1rem;
  }
  #stepper {
    display: flex;
  }
  #step {
    flex: 1;
    margin: 0rem 0.25rem;
  }

  #times div {
    text-align: left;
  }
  main {
    padding: 0;
    margin: 0 auto;
  }

  h3 {
    text-transform: uppercase;
    font-weight: 100;
    text-align: center;
    margin: 0;
  }
  #container {
    display: flex;
    flex-direction: row-reverse;
    margin: auto;
    justify-content: center;
  }
</style>

<svelte:window bind:innerWidth={w_width} bind:innerHeight={w_height} />
<main>

  <div>
    <h3>
      <b>
        Basic Distributed Algorithms Visual Simulations for Distributed Systems
        Students
        <br />
        Ring Election Algorithm
      </b>
    </h3>
  </div>

  <div id="container">
    <svg viewBox="50 -50 800 800" width={svg_side} height={svg_side}>
      <defs>
        <marker
          id="head"
          orient="auto"
          markerWidth="2"
          markerHeight="4"
          refX="0.1"
          refY="2">
          <!-- triangle pointing right (+x) -->
          <path d="M0,0 V4 L2,2 Z" fill="black" />
        </marker>
      </defs>

      {#each processViews as p, i}
        <Process
          {...p}
          xloc={450 + 250 * Math.sin(((2 * Math.PI) / pcount) * i)}
          yloc={300 + 250 * -Math.cos(((2 * Math.PI) / pcount) * i)} />

        {#if p.active}
          <Arrow
            from={p.id - 1}
            to={p.id}
            color={red}
            {pcount}
            text={p.cur_msg} />
        {:else}
          <Arrow from={p.id - 1} to={p.id} color={black} {pcount} text={''} />
        {/if}

        <!-- <Arrow from={3} to={0} color={black} {pcount} /> -->
      {/each}
    </svg>
    <div id="options">
      <h4>Options</h4>
      <div id="procs" class="option">
        <b># Processes:</b>
        <div>
          <input type="range" bind:value={pcount} min="2" max="9" />
          <span>{pcount}</span>
        </div>
      </div>

      <div class="form-group">
        <label>
          <b>Processes ids in the election</b>
        </label>
        <!-- 5,9,3,10,6,1,7,4,2,8 -->
        <input
          on:input={getProcessNames}
          bind:value={pNames}
          type="text"
          placeholder="eg. 1,2,3,4,5" />

        <!-- {#each processViews as p, i}
          <p>{p.name}</p>
          <br />
        {/each} -->

      </div>

      <div id="times" class="option">
        <b>Process starting the election</b>
        <div id="code">
          <div class="range">
            <input type="number" bind:value={starter} min={2} max={pcount} />
          </div>
        </div>
      </div>

      <div id="speed" class="option">

        <button id="manual" on:click={setSpeedStep}>
          <svg viewbox="0 0 50 50">
            <g xmlns="http://www.w3.org/2000/svg" id="Layer_1_1_">
              <path d="M23,49V1H11v48H23z M13,3h8v44h-8V3z" />
              <path d="M39,49V1H27v48H39z M29,3h8v44h-8V3z" />
            </g>
          </svg>
        </button>
        <button id="default" on:click={setSpeedRegular}>
          <svg viewbox="0 0 50 50">
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M7,1.217v47.566L45.918,25L7,1.217z
              M9,4.783L42.082,25L9,45.217V4.783z" />

          </svg>
        </button>
        <button id="fast" on:click={setSpeedFast}>
          <svg viewbox="0 0 50 50">
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M24,49.414L48.414,25L24,0.586v23l-23-23v48.828l23-23V49.414z
              M3,44.586V5.414L22.586,25L3,44.586z M26,5.414L45.586,25
              L26,44.586V5.414z" />
          </svg>
        </button>
      </div>

      <div id="stepper" class="option">
        <button id="step" on:click={handleClick}>Step</button>
      </div>

    </div>
  </div>

  <div>
    <h4>Process Messages</h4>
    <div id="msgs" class="option">
      {#each processViews as p, i}
        <p>{p.name}: {p.allMsgs}</p>
      {/each}
    </div>
  </div>

</main>
