<template>
  <div class="markdown-body">
    <h1>{{ article.title }}</h1>
    <p>Post last updated on {{ formatDate(article.updatedAt) }}</p>

    <TableOfContent :toc="article.toc" />
    <nuxt-content :document="article" />
  </div>
</template>

<script>
import TableOfContent from '~/components/TableOfContent.vue'
export default {
  components: {
    TableOfContent
  },
  async asyncData ({ $content, params, error }) {
    try {
      const [article] = await $content({ deep: true })
        .where({ dir: `/${params.slug}` })
        .fetch()
      const moreStories = await $content({ deep: true })
        .only(['title', 'image', 'path'])
        .where({ title: { $ne: article.title } })
        .sortBy('createdAt', 'desc')
        .limit(3)
        .fetch()
      return { article, moreStories }
    } catch (err) {
      error({
        statusCode: 404,
        message: 'Page could not be found'
      })
    }
  },
  methods: {
    formatDate (date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    }
  }
}
</script>
