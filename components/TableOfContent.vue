<template>
  <section class="tableofcontent">
    <h3>Table of Content</h3>
    <div id="toc">
      <ul>
        <li
          v-for="link of toc"
          :key="link.id"
          :class="{ toc2: link.depth === 2, toc3: link.depth === 3 }"
        >
          <NuxtLink :to="`#${link.id}`">
            {{ link.text }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  props: ['toc']
}
</script>
