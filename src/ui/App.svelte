<!-- ui/App.svelte -->
<script lang="ts">
  import MainContent from "./components/main_content.svelte";
  import Navbar from "./components/navbar.svelte";
</script>

<main>
  <div class="app-container">
    <Navbar />
    <MainContent />
  </div>
</main>

<style>
  .app-container {
    display: grid;
    grid-template-columns: 200px 1fr; /* nav | contenu */
    height: 100vh;
    gap: 10px; /* un petit espace entre les colonnes */
    padding: 10px;
    box-sizing: border-box;
  }
</style>
