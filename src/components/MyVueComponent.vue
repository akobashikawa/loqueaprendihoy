<template>
  <div>
    <p>React Contador: {{ count }}</p>
    <button @click="incrementar">Incrementar</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);

    const incrementar = () => {
      count.value++;
    };

    return {
      count,
      incrementar,
    };
  },
};
</script>
