<script setup lang="ts">
import { animate } from 'motion';
import { ref, watch, reactive, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ id: string, selected: boolean }>();
const cursorTracked = reactive({ centerX: 0, centerY: 0 });
const container = ref(null);

function mouseMove(event: MouseEvent) {
  if (props.selected) {
    const x = event.clientX - cursorTracked.centerX;
    const y = (event.clientY - cursorTracked.centerY) * -1;
    animate(`#${props.id}`, {
      perspective: '100px',
      rotateX: `${y/20}deg`,
      rotateY: `${x/20}deg`,
    });
  }
}

onMounted(() => {
  document.body.addEventListener('mousemove', mouseMove);
});

onUnmounted(() => {
  document.body.removeEventListener('mousemove', mouseMove);
});

watch(() => props.selected, async (isSelected) => {
  if (isSelected) {
    const card = container.value.getBoundingClientRect();
    cursorTracked.centerY = card.y - (card.height / 2);
    cursorTracked.centerX = card.x - (card.width / 2);
    animate(`#${props.id}`, {
      scale: 1.2,
      zIndex: 5
    })
  } else {
    animate(`#${props.id}`, {
      scale: 1.0,
      rotateY: 0,
      rotateX: 0,
      zIndex: 1,
    })
  }
});

</script>

<template>
  <div
    :id
    class="card-form"
    :class="{'select-animation': props.selected}"
    ref="container"
    @mousemove="mouseMove"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  @property --rotate {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  @property --spread {
    syntax: "<percentage>";
    initial-value: 0%;
    inherits: false;
  }

  @mixin div-before {
      content: "";
      inset: 0;
      position: absolute;
      border-radius: inherit;
      opacity: 1;
      transition: opacity .5s;
      background-image: repeating-conic-gradient(from var(--rotate), var(--color-accent), var(--color-background-soft) 80deg 180deg);
      animation-name: rotating;
      animation-duration: 4s;
      animation-direction: reverse;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      transition: ease-out 200ms;
  }

  @mixin div-after {
      @include div-before;
      filter: blur(8px);
      opacity: 1;
      z-index: -1;
      transition: opacity .5s;
  }

  .card-form {
    position: relative;
    height: 300px;
    width: 200px;
    border-radius: 10px;
    background: var(--color-background);

    &:hover:before {
      @include div-before;
    }
    
    &:hover:after {
      @include div-after;
    }
    
    &:hover {
      color: var(--color-accent);
    }
  }

  .select-animation {
    color: var(--color-accent);
    
    @mixin selected-highlight {
      content: "";
      inset: 0;
      position: absolute;
      border-radius: inherit;
      background: radial-gradient(var(--color-accent) var(--spread), transparent);
      animation-name: spreading;
      animation-duration: 2s;
      animation-direction: reverse;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      transition: ease-out 200ms;
    }

    &:before {
      @include selected-highlight;
      background: var(--color-accent-trasnparent);
    }

    &:after {
      @include selected-highlight;
      filter: blur(8px);
      opacity: 1;
      z-index: -1;
      transition: opacity .5s;
    }
  }
  
  @keyframes rotating {
    from {
      --rotate: 0deg;
    }
    to {
      --rotate: 360deg;
    }
  }

  @keyframes spreading {
    from {
      --spread: 0%;
    }
    to {
      --spread: 100%;
    }
  }
</style>
