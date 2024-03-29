<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from '../hooks/useFetch';
import { animate, spring } from 'motion';
import PreviewCard from './Card/PreviewCard.vue';
type PokemonsList = {
  count: number;
  next: string;
  previous: string;
  results: { name: string, url: string }[],
}
const { response: pokemons, isLoading } = useFetch<PokemonsList>('https://pokeapi.co/api/v2/pokemon?limit=16&offset=0')
const selectedPokemon = ref('');

function elementEntered(el, done) {
  animate(el, {
    scale: [0, 1],
  },{
    easing: spring({ stiffness: 300, mass: 2, damping: 25 }),
    delay: el.dataset.index * 0.1,
  }).finished.then(done);
}

function onBeforeEnter(el) {
  el.style.scale = 0;
}

</script>
<template>
  <div v-if="isLoading">
    List loading...
  </div>
  <TransitionGroup v-else
    :css="false" 
    :appear="true"
    tag="div"
    class="pokemons-list"
    @appear="elementEntered"
  >
    <PreviewCard
      v-for="(pokemon, index) in pokemons.results"
      :key="pokemon.name"
      :data-index="index"
      :name="pokemon.name"
      :url="pokemon.url"
      :selected="selectedPokemon == pokemon.name"
      @click="selectedPokemon = pokemon.name"
    />
  </TransitionGroup>
</template>

<style lang="scss" scoped>
  .pokemons-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, 200px);
    gap: 20px;
  }
</style>
