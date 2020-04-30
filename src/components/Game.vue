<template>
    <div class="flex flex-col h-full w-full">
        <div class="flex flex-row flex-wrap">
            <div @click="playerTurn && selectedCard ? playSelectedCardStart() : null"
                 class="w-10 h-56 my-2"
                 :class="playerTurn && selectedCard ? 'bg-blue-200' : ''"/>
            <card v-if="lastPlayedCard && lastPlayedCard.fail && lastPlayedCard.index === -1" :card="lastPlayedCard" :turned="true" class="fail"/>
            <template v-for="(card, index) in sortedCards">
                <card :card="card" :turned="true" :class="(!playerTurn || !selectedCard ? 'mr-12' : '')" :last-played="lastPlayedCard && !lastPlayedCard.fail && lastPlayedCard.value === card.value"/>
                <card v-if="lastPlayedCard && lastPlayedCard.fail && lastPlayedCard.index === index" :card="lastPlayedCard" :turned="true" class="fail"/>
                <div @click="playSelectedCardAfter(card)"
                     v-if="playerTurn && selectedCard"
                     class="w-10 h-56 my-2 bg-blue-200"></div>
            </template>
        </div>

        <div v-if="player.cards" class="flex flex-row">
            <div @click="selectCard(card)" v-for="card in player.cards" :key="card.value">
                <card :card="card" :turned="false" :selected="card === selectedCard"/>
            </div>
        </div>
    </div>
</template>

<script>
  import music from '../music'
  import Card from './Card'

  export default {
    name: 'Game',
    data() {
      return {
        username: null,
        remainingCards: [],
        discardedCards: [],
        lastPlayedCard: null,
        playedCards: [],
        players: {},
        player: {},
        selectedCard: null,
        window: {
          width: 0,
          height: 0
        }
      }
    },
    components: {
      Card
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      this.getDBGame()
      this.signUser()
      window.addEventListener('unload', this.signoutUser)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      handleResize() {
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
      },
      getDBGame() {
        this.$fb.ref('games/' + this.$route.params.gameId).on('value', snap => {
          this.remainingCards = snap.val().remainingCards
          this.discardedCards = snap.val().discardedCards ?? []
          this.playedCards = snap.val().playedCards
          this.lastPlayedCard = snap.val().lastPlayedCard
          this.turn = snap.val().turn
          this.players = snap.val().players
          this.player = this.players[this.username]
          if(!snap.val().remainingCards){
            this.newGame()
          }
          if(!snap.val().name){
            this.$router.push({name: 'home'})
            return
          }

        })
      },
      signUser() {
        let username = localStorage.getItem('username')
        while(!username || username.length < 5){
          username = prompt("Veuillez entrer un nom d'utilisateur (5 caractère min)", "");
        }
        this.username = username
        this.$fb.ref('games/' + this.$route.params.gameId + '/players/' + this.username).update({
          username
        })
      },
      newGame() {
        this.$fb.ref('games/' + this.$route.params.gameId).update(this.generateNewGame())
      },
      selectCard(card) {
        this.selectedCard = card
      },
      playSelectedCardStart() {
        // this.player.turn = false
        if(this.checkPosition(-1, this.selectedCard.year)){
          console.log('Good job')
          this.addPlayedCard(this.selectedCard)
        } else {
          console.log('Fail')
          this.discardCard(this.selectedCard, -1)
        }
        this.selectedCard = null
      },
      playSelectedCardAfter(card) {
        // this.player.turn = false
        let position = this.getCardIndex(card)
        if(this.checkPosition(position, this.selectedCard.year)){
          console.log('Good job')
          this.addPlayedCard(this.selectedCard)
        } else {
          console.log('Fail')
          this.discardCard(this.selectedCard, position)
        }
        this.selectedCard = null
      },
      getCardIndex(card){
        return this.sortedCards.indexOf(card)
      },
      checkPosition(index, year){
        if(index === -1){
          return year <= this.sortedCards[0].year
        } else if (index === this.sortedCards.length - 1) {
          return year >= this.sortedCards[index].year
        } else {
          return year >= this.sortedCards[index].year && year <= this.sortedCards[index + 1].year
        }
      },
      addPlayedCard(card){
        this.player.cards = this.player.cards.filter(c => c !== card)
        this.$fb.ref('games/' + this.$route.params.gameId + '/players/' + this.username).update(this.player)
        this.playedCards.push(card)
        let lastPlayedCard = card
        lastPlayedCard.fail = false
        this.$fb.ref('games/' + this.$route.params.gameId).update({
          playedCards: this.playedCards,
          lastPlayedCard
        })
      },
      discardCard(card, index){
        this.player.cards = this.player.cards.filter(c => c !== card)
        let newCard = this.getRandom(this.remainingCards, 1)[0]
        this.player.cards.push(newCard)
        this.remainingCards = this.remainingCards.filter(c => c !== newCard)
        this.$fb.ref('games/' + this.$route.params.gameId + '/players/' + this.username).update(this.player)
        this.discardedCards.push(card)
        let lastPlayedCard = card
        lastPlayedCard.fail = true
        lastPlayedCard.index = index
        this.$fb.ref('games/' + this.$route.params.gameId).update({
          remainingCards: this.remainingCards,
          discardedCards: this.discardedCards,
          lastPlayedCard
        })
      },
      generateNewGame() {
        let startCards = this.getRandom(this.cards, 1)
        let remainingCards = this.cards.filter(c => !startCards.includes(c))
        let players = {}
        Object.keys(this.players).forEach(pl => {
          let playerCards = this.getRandom(this.cards, 5)
          players[pl] = {
            username: pl,
            cards: playerCards,
            turn: true
          }
          remainingCards = this.cards.filter(c => !playerCards.includes(c))
        })

        return {
          playedCards: startCards,
          remainingCards,
          players,
          discardedCards: [],
          lastPlayedCard: null
        }
      },
      getRandom(arr, n) {
        var result = new Array(n),
          len = arr.length,
          taken = new Array(len)
        if (n > len)
          throw new RangeError('getRandom: more elements taken than available')
        while (n--) {
          var x = Math.floor(Math.random() * len)
          result[n] = arr[x in taken ? taken[x] : x]
          taken[x] = --len in taken ? taken[len] : len
        }
        return result
      }
    },
    computed: {
      isVertical(){
        return this.window.height >= this.window.width
      },
      cards(){
        return music
      },
      sortedCards(){
        return [...this.playedCards].sort((a, b) => {
          return a.year - b.year
        })
      },
      playerTurn() {
        return this.player.turn
      }
    },
    filters: {
      uppercase: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.toUpperCase()
      }
    }
  }
</script>

<style scoped>

</style>