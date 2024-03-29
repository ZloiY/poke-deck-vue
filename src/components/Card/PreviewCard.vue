<script setup lang="ts">
import { computed, defineProps } from 'vue';
import BlankCard from './BlankCard.vue';
import Loader from '../Loader.vue';
import { useFetch } from '@hooks/useFetch';

type PokemonDetails = {
  height: number,
  weight: number,
  name: string,
  abilities: { ability: { name: string } }[],
  stats: { base_stat: number, stat: { name: string } }[],
  sprites: { front_default: string, other: { official_artwork?: { front_default?: string }}}
}

const props = defineProps<{
  name?: string,
  url?: string,
  selected: boolean,
}>();

const { response: pokemonDetails, error, isLoading } = useFetch<PokemonDetails>(props?.url);
const computedDetails = computed(() => {
  if (isLoading.value == false) {
    const sprite = pokemonDetails.value.sprites.other['official-artwork']?.front_default ?? pokemonDetails.value.sprties?.front_default;
    return {
      name: pokemonDetails.value.name,
      weight: pokemonDetails.value.weight,
      height: pokemonDetails.value.height,
      abilities: pokemonDetails.value.abilities.map((ability) => ability.ability.name),
      stats: pokemonDetails.value.stats.map((stat) => ({ value: stat.base_state, name: stat.stat.name })),
      sprite 
    }
  } else {
    return undefined
  }
});
</script>

<template>
  <BlankCard :id="`blank-card-${props.name}`" :selected>
    <div class="preview-container" :class="{'preview-container-selected': selected}">
      <Loader :is-loading="isLoading">
        <img class="preview-img" :src="computedDetails?.sprite">
      </Loader>
      <span class="preview-name">{{props?.name}}</span>
    </div>
  </BlankCard>
</template>

<style lang="scss" scoped>
  .preview-container {
    position: absolute;
    display: flex;
    inset: 3px;
    border-radius: 10px;
    border: 3px solid var(--color-background-soft);
    background-color: var(--color-background);
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transition: ease-in 200ms;
    
    &:hover {
      border: none;
      transition: ease-out 200ms;
    }
  }

  .preview-container-selected {
    border: none;
  }

  .preview-img {
    width: 100%;
    height: auto;
  }
  .preview-name {
    text-transform: capitalize;
    font-size: 20px;
  }
</style>
