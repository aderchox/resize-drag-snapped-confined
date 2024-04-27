<script>
  import interact from "interactjs";
  import { onMount } from "svelte";

  let box;
  let draggableBox;
  let board;
  let position = { x: 0, y: 0 };

  onMount(function () {
    draggableBox = interact(box);
    draggableBox.draggable({
      lockAxis: "x",
      listeners: {
        move(event) {
          position.x += event.dx;
          position.y += event.dy;

          event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
      },
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({
              // can be a pair of x and y, left and top,
              // right and bottom, or width, and height
              x: 50,
              y: 50,
            }),
          ],
        }),
        interact.modifiers.restrictRect({
          restriction: ".board",
        }),
      ],
    });
  });
</script>

<div class="board" bind:this={board}>
  Board
  <div class="box" bind:this={box}>Box</div>
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
