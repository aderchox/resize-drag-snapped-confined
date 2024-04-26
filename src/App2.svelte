<script>
  import { draggable } from "@neodrag/svelte";

  let board;
  let box;
</script>

<div class="board" bind:this={board}>
  Board
  <div
    class="box"
    bind:this={box}
    use:draggable={{ axis: "x", grid: [50, 50], bounds: "parent" }}
  >
    Box
  </div>
</div>

<style>
  .board {
    border: 1px solid slateblue;
    padding: 5px;
    min-height: 50vh;
    touch-action: none;
    /* .box must be confined within .board of any other arbitrary sizes too. */
    /* width: 700px; */
  }
  .box {
    user-select: none;
    border: 1px solid salmon;
    border-radius: 5px;
    width: 100px;
    padding: 5px 10px;
    margin-block: 5px;
    min-height: 5vh;
    cursor: grab;
  }
  .box:hover {
    background-color: #4683b425;
  }
  .box:global(.dragging) {
    cursor: grabbing;
  }
  .box:global(.resizing) {
    border-right: steelblue 3px solid;
    cursor: w-resize;
  }
  .board:global(:has(.box.resizing)) {
    /* Add cursor here on board too (in addition to adding it on the .box.resizing), so that when the cursor goes out of box while resizing for a short time, the cursor doesn't change. */
    cursor: w-resize;
  }
</style>
