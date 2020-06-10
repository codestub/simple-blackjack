<template>
  <div class="app">
    <div class="app__section">
      <h2>Dealer cards:</h2>
      <div class="app__cards">
        <CardTile
          v-for="card in dealerCards"
          :key="`${card.type}-${card.suit}`"
          :card="card"
          class="dealer-card"
        />
      </div>
      <div id="dealer-total">
        Dealer total points: {{ dealerTotal }}
      </div>
    </div>
    <div v-if="gameOver" class="app__section">
      <h1
        id="message"
        class="app__message"
        :class="{
          'app__message--win': dealerLost,
          'app__message--lose': playerLost,
        }">
        <marquee> <!-- because why not -->
          {{ message }}
        </marquee>
      </h1>
    </div>
    <div class="app__section">
      <div class="app__buttons">
        <button id="hit" @click="playerDrawsCard" :disabled="gameOver || playerStands" class="app__button">
          Hit
        </button>
        <button id="stand" @click="stand" :disabled="gameOver || playerStands" class="app__button">
          Stand
        </button>
        <button id="restart" v-if="gameOver" @click="restart" class="app__button">
          Play again
        </button>
      </div>
      <h2>Player cards:</h2>
      <div class="app__cards">
        <CardTile
          v-for="card in playerCards"
          :key="`${card.type}-${card.suit}`"
          :card="card"
          class="player-card"
        />
      </div>
      <div id="player-total">
        Player total points: {{ playerTotal }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Card, deck } from '@/lib/deck';
import { shuffle } from 'lodash';
import CardTile from '@/components/CardTile.vue';

export default Vue.extend({
  components: {
    CardTile,
  },
  data() {
    return {
      deck,
      shuffledDeck: [] as Card[],
      playerCards: [] as Card[],
      dealerCards: [] as Card[],
      playerStands: false,
      message: '',
    };
  },
  computed: {
    playerTotal(): number {
      return this.playerCards.reduce((acc, item) => acc + item.value, 0);
    },
    dealerTotal(): number {
      return this.dealerCards.reduce((acc, item) => acc + item.value, 0);
    },
    dealerLost(): boolean {
      return (this.dealerTotal > 21)
        || (this.dealerTotal >= 17 && this.dealerTotal < this.playerTotal);
    },
    playerLost(): boolean {
      return (this.playerTotal > 21)
        || (this.dealerTotal >= 17 && this.dealerTotal <= 21 && this.dealerTotal > this.playerTotal);
    },
    draw(): boolean {
      return this.dealerTotal >= 17 && this.dealerTotal === this.playerTotal;
    },
    gameOver(): boolean {
      return this.dealerLost || this.playerLost || this.draw;
    },
  },
  created() {
    this.shuffleDeck();
  },
  watch: {
    gameOver(value) {
      if (value) {
        if (this.playerLost) {
          this.message = 'You lost :(';
        } else if (this.dealerLost) {
          this.message = 'You win!';
        } else if (this.draw) {
          this.message = 'DRAW!';
        }
      }
    },
  },
  methods: {
    shuffleDeck(): void {
      this.shuffledDeck = shuffle(this.deck);
    },
    playerDrawsCard(): void {
      const card = this.shuffledDeck.pop();
      if (card) {
        this.playerCards.push(card);
      }
    },
    dealerDrawsCard(): void {
      const card = this.shuffledDeck.pop();
      if (card) {
        this.dealerCards.push(card);
      }
    },
    stand(): void {
      this.playerStands = true;
      while (this.dealerTotal < 17 || this.dealerTotal < this.playerTotal) {
        this.dealerDrawsCard();
      }
    },
    restart(): void {
      this.shuffleDeck();
      this.playerCards = [];
      this.dealerCards = [];
      this.playerStands = false;
    },
  },
});
</script>

<style lang="scss">

.app {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 3em;
  font-family: sans-serif;
  &__section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1em;
    margin: 1em 0;
  }
  &__buttons {
    display: grid;
    grid-gap: 0.5em;
    width: 400px;
  }
  &__button {
    padding: 0.5em 1em;
    text-transform: uppercase;
    cursor: pointer;
  }
  &__message {
    max-width: 300px;
    text-transform: uppercase;
    &--win {
      color: #24ce24;
    }
    &--lose {
      color: #c72626;
    }
  }
}
</style>
