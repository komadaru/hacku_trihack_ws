<template>
  <v-app id="inspire">
    <sidebar />
    <div class="prof">
        <h1>This is an prof page</h1>
    </div>
  </v-app>
</template>

<script>
import Sidebar from '@/components/layouts/Sidebar'
export default {
  components: {
    Sidebar
  }
}
</script>