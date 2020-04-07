<template>
    <div class="flex flex-col h-full w-full">
        <div class="flex flex-row flex-wrap">
            <div @click="playSelectedCardStart"
                 v-if="playerTurn && selectedCard"
                 class="w-10 h-56 my-2 bg-blue-200"></div>
            <div v-for="card in cards" :key="card.value" class="flex flex-row">
                <card :card="card" :turned="true"/>
                <div @click="playSelectedCardAfter(card)"
                     v-if="playerTurn && selectedCard"
                     class="w-10 h-56 my-2 bg-blue-200"></div>
            </div>
        </div>

        <div class="flex flex-row">
            <div @click="selectCard(card)" v-for="card in playerCards" :key="card.value">
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
        remainingCards: [],
        playedCards: [],
        playerCards: [],
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
      this.signoutUser()
    },
    methods: {
      handleResize() {
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
      },
      clearPlayers() {
        this.$fb.ref('games/' + this.$route.params.gameId + '/users').remove()
      },
      getDBGame() {
        this.$fb.ref('games/' + this.$route.params.gameId).on('value', snap => {
          this.playerCards = music
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
        this.userRef = this.$fb.ref('games/' + this.$route.params.gameId + '/users').push({
          username,
          master: false
        })
      },
      signoutUser() {
        this.userRef.remove()
        this.$fb.ref('games/' + this.$route.params.gameId).off('value')
      },
      newGame() {
        //this.$fb.ref('games/' + this.$route.params.gameId).update(this.generateNewGame())
      },
      selectCard(card) {
        this.selectedCard = card
      },
      playSelectedCardStart() {
        console.log('played at start')
      },
      playSelectedCardAfter(card) {
        console.log('played after ' + card.value)
      },
      generateNewGame() {

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
        return music.concat(music, music)
      },
      playerTurn() {
        return true
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