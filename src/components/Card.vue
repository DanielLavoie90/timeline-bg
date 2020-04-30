<template>
    <div class="w-40 h-56 m-2 p-2 card rounded-lg" :class="selected ? 'selected' : (lastPlayed ? 'success' : '')">
        <div class="relative h-2/3 bg-no-repeat bg-center bg-cover rounded-lg rounded-b-none" :style="backgroundImage">
            <div v-if="turned"
                 class="absolute w-1/2 text-center card-year rounded-lg rounded-b-none">
                {{card.year}}
            </div>
        </div>
        <div class="relative h-1/3 p-2 card-indice rounded-lg rounded-t-none">
            <div class="flex flex-col card-indice-value justify-around text-sm text-center">
                <span>{{card.value}}</span>
            </div>
            <div class="card-indice-help text-xs absolute">
                {{card.help}}
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    props:{
      card: {
        type: Object
      },
      lastPlayed: {
        type: Boolean,
        default: false
      },
      turned: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      },
    },
    name: 'Card',
    computed:{
      backgroundImage() {
        return {'background-image': `url(${this.card.image})`}
      }
    }
  }
</script>

<style scoped>

    .card {
        border-color: #999082;
        border-width: 2px;
        background-color: #FFF9F2;
    }

    .selected {
        border-color: #297ec0;
        background-color: #C8E2F7;
    }

    .fail {
        background-color: red;
    }

    .success {
        background-color: #297ec0;
    }

    .card-year {
        color: white;
        border-color: #999082;
        border-width: 2px;
        border-bottom: 0;
        background-color: #333333;
        bottom: 0;
        left: calc(100% / 4)
    }

    .card-indice {
        border-color: #BE8F43;
        border-width: 2px;
        background-color: #EFE1C9;
    }

    .card-indice-value {
        height: calc(100% - 1rem);
    }

    .card-indice-help {
        bottom: 0;
        right: 0.5rem;
    }

</style>