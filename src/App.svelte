<script>
  import { onMount } from "svelte";
  import { getContentWidth, clamp } from "./lib/utils";

  const SNAP_SIZE = 30;
  let box;
  let board;
  $: boardPadding =
    board !== undefined ? parseInt(getComputedStyle(board).paddingLeft) * 2 : 0;
  $: maxBoxWidth =
    board !== undefined
      ? board.getBoundingClientRect().right -
        SNAP_SIZE -
        box.getBoundingClientRect().left -
        boardPadding
      : 0;
  $: maxBoxX =
    board !== undefined
      ? board.getBoundingClientRect().right -
        SNAP_SIZE -
        box.getBoundingClientRect().width -
        boardPadding
      : 0;
  let state = {
    dragging: false,
    resizing: false,
    _pos: {
      x: 0,
      // y: 0,
      snappedX: 0,
    },
    _width: 0,
    get pos() {
      return {
        snappedX: this._pos.snappedX,
        x: this._pos.x,
        // y: this._pos.y,
      };
    },
    set pos(p) {
      // ~TODO~DONE~: Do clamping in the wrapper board too.

      // Without snapping:
      this._pos.x = clamp(p.x, 0, maxBoxX);
      // To allow dragging in both directions x and y:
      // this._pos.y = p.y;
      // box.style.transform = `translate(${p.x}px,${p.y}px)`;
      // To allow dragging only in horizontal (x) direction:
      // box.style.transform = `translateX(${p.x}px)`;

      // With snapping:
      if (this._pos.x >= this._pos.snappedX + SNAP_SIZE / 2) {
        this._pos.snappedX = this._pos.snappedX + SNAP_SIZE;
        box.style.transform = `translateX(${this._pos.snappedX}px)`;
      } else if (this._pos.x <= this._pos.snappedX - SNAP_SIZE / 2) {
        this._pos.snappedX = this._pos.snappedX - SNAP_SIZE;
        box.style.transform = `translateX(${this._pos.snappedX}px)`;
      }
    },
    get width() {
      return this._width;
    },
    set width(size) {
      // ~TODO~DONE~: Do clamping in the wrapper board too.

      this._width = clamp(size, 0, maxBoxWidth);

      // To snap the size change to multiples of SNAP_SIZE pixels:
      const boxWidth = getContentWidth(box);
      if (this._width < boxWidth - SNAP_SIZE / 2) {
        box.style.width = `${boxWidth - SNAP_SIZE}px`;
      } else if (this._width > boxWidth + SNAP_SIZE / 2) {
        box.style.width = `${boxWidth + SNAP_SIZE}px`;
      }

      // To set the size without snapping:
      // box.style.width = `${size}px`;
    },
  };

  function makeResizable(state, el) {
    el.addEventListener("pointerdown", function (event) {
      // If the click of the mouse is NOT from the left click.
      if (event.button !== 0) {
        // console.log("not primary");
        return;
      }
      el.setPointerCapture(event.pointerId);
      if (isAtResizePosition({ x: event.x, y: event.y })) {
        state.resizing = true;
        state.width = getContentWidth(el);
      }
      state.dragging = true;
      el.classList.add("dragging");
    });
    // TODO: MouseEvent.movementX has cross-browser issues mentioned on MDN. Use the manual way to calculate movements.
    el.addEventListener("pointermove", function (event) {
      if (!state.dragging) return;
      // console.log(event.movementX, event.movementX > 0 ? "right" : "left");
      if (state.resizing) {
        // Resize
        state.width = state.width + event.movementX;
        // console.log("box width", state.width);
      } else {
        // Drag
        state.pos = {
          x: state.pos.x + event.movementX,
          // y: state.pos.y + event.movementY,
        };
      }
    });
    el.addEventListener("pointerup", function (event) {
      state.dragging = false;
      el.classList.remove("dragging");
      state.resizing = false;
    });
    function isAtResizePosition({ x, y }) {
      const elBoundingClientRect = el.getBoundingClientRect();
      const elRight = elBoundingClientRect.right;
      const elBottom = elBoundingClientRect.bottom;
      const elTop = elBoundingClientRect.top;
      // No offset for x values greater than elRight, because it will deceive the user about from where they can actually trigger a resize. (Outside of element, there are no dragging handlers.)
      return x >= elRight - 5 && x <= elRight && y > elTop && y < elBottom;
    }
    board.addEventListener("pointermove", function (event) {
      if (isAtResizePosition({ x: event.x, y: event.y }) || state.resizing) {
        el.classList.add("resizing");
      } else {
        el.classList.remove("resizing");
      }
    });
  }
  onMount(function () {
    makeResizable(state, box);
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
