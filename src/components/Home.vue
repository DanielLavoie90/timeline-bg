<template>
    <div class="text-xl">
        <div v-if="username">
            <div class="text-2xl mb-4">
                Bonjour, {{username}}
                <button @click="changeUsername" class="btn btn-default btn-primary ml-2">
                    Changer
                </button>
            </div>
            <br>
            <div class="text-xl">
                Règles du jeu :
                <div>
                    <a href="http://jeuxstrategie1.free.fr/jeu_timeline/regle.pdf"
                       class="ml-4 text-blue-700"
                       target="_blank">
                        PDF
                    </a>
                </div>
                <div>
                    <a href="https://www.youtube.com/watch?v=4m5KMH8p8C8"
                       class="ml-4 text-blue-700"
                       target="_blank">
                        Youtube
                    </a>
                </div>
            </div>
            <br>
            <div class="text-2xl underline mb-2">
                Parties en cours
            </div>
            <div v-if="Object.keys(games).length">
                <div v-for="(game, key) in games"
                     :key="key">
                    <div class="flex flex-row mb-4">
                        <router-link :to="key" class="w-1/5 text-xl pl-4">
                            {{game.name}} ({{game.users ? Object.keys(game.users).length : 0}} joueurs)
                        </router-link>

                        <button @click="deleteGame(key)"
                                class="btn btn-default btn-primary ml-2">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
            <div v-else
                 class="text-xl">
                Aucune partie existante
            </div>

            <button @click="newGame"
                    class="btn btn-default btn-primary mt-4">
                Créer une partie
            </button>
        </div>
        <div v-else>
            <div v-if="error" class="text-red-600">
                {{error}}
            </div>
            <label class="py-2">
                Entrer un nom d'utilisateur
                <input type="text"
                       class="rounded-md border border-solid border-gray-dark m-2 p-1 pl-2 text-sm focus:border-accent"
                       v-model="tempUsername">
            </label>
            <button @click="registerName"
                    class="btn btn-default btn-primary">
                Save
            </button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        tempUsername: null,
        username: null,
        error: null,
        games: {}
      }
    },
    created() {
      this.getLocalUsername()
    },
    mounted() {
      this.getGames()
    },
    methods: {
      changeUsername() {
        let username = localStorage.getItem('username')
        while (!username || username.length < 5) {
          username = prompt('Veuillez entrer un nom d\'utilisateur (5 caractère min)', username)
        }
        localStorage.setItem('username', username)
        this.username = username
      },
      registerName() {
        if (!this.tempUsername || this.tempUsername.length < 5) {
          this.error = 'Doit contenir un minimum de 5 caractère.'
          return
        }
        this.error = null
        localStorage.setItem('username', this.tempUsername)
        this.username = this.tempUsername
        this.tempUsername = null
      },
      getLocalUsername() {
        this.username = localStorage.getItem('username')
      },
      getGames() {
        this.$fb.ref('games').on('child_added', snap => {
            this.$set(this.games, snap.key, snap.val())
          }
        )
        this.$fb.ref('games').on('child_changed', snap => {
            this.$set(this.games, snap.key, snap.val())
          }
        )
        this.$fb.ref('games').on('child_removed', snap => {
            this.$delete(this.games, snap.key)
          }
        )
      },
      newGame() {
        const gameName = prompt('Veuillez entrer le nom de la partie', 'Nouvelle Partie')
        this.$fb.ref('games').push({
          name: gameName,
          players: {}
        })
      },
      deleteGame(key) {
        console.log(key)
        this.$fb.ref('games/' + key).remove()
      }
    }
  }
</script>

<style scoped>

</style>