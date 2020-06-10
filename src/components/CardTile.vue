<template>
  <div class="card">
    <div class="card__content" :class="`card__content--suit-${card.suit}`">
      <span>{{ card.type }}</span>
      <span>{{ card.suit }}</span>
      <span>({{ card.value }})</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Card } from '../lib/deck';

export default Vue.extend({
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.card {
  padding: 1em;
  box-shadow: 0 10px 20px hsla(0, 0%, 0%, 0.15), 0 3px 6px hsla(0, 0%, 0%, 0.1);
  background-color: white;
  border-radius: 1em;
  text-transform: uppercase;
  font-weight: bold;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0.5em;
    justify-items: center;
    border-radius: 0.75em;
    padding: 2em 1em;
    &--suit-spades {
      background-color: #4b2e2e;
      color: white;
    }
    &--suit-clubs {
      background-color: #4b2e2e;
      color: white;
    }
    &--suit-hearts {
      background-color: #d42323;
      color: white;
    }
    &--suit-diamonds {
      background-color: #d42323;
      color: white;
    }
  }
}
</style>
