<template>
  <div>
    <!--CONTENT-->
    <div class="uk-section uk-section-default">
      <div class="uk-container">
        <h4 class="uk-heading-line uk-text-bold">
          <span>Latest Articles</span>
        </h4>
        <div class="uk-child-width-expand@s uk-text-center uk-grid" uk-grid>
          <section
            v-for="post in articles"
            :key="post.title"
            class="uk-width-1-3@m"
          >
            <nuxt-link class="nav-link" :to="'/blog/' + post.path.split('/')[1]">
              <div class="uk-card uk-card-default uk-card-hover">
                <div>
                  <div
                    class="uk-card uk-card-default"
                    style="min-height: 450px"
                  >
                    <div class="uk-card-media-top">
                      <img
                        v-if="post.image"
                        :src="
                          require('~/content/' +
                            post.path.split('/')[1] +
                            '/images/' +
                            post.image)
                        "
                        :alt="post.title"
                        style="width: 100%; height: 250px"
                      >
                    </div>
                    <div class="uk-card-body">
                      <h3 class="uk-card-title" style="margin-top: 0px">
                        {{ post.title }}
                      </h3>
                      <p>{{ post.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </section>
        </div>
        <button
          class="uk-button uk-button-default"
          style="margin-top: 30px"
          @click="getMorePosts"
        >
          See more articles
        </button>
      </div>
    </div>
    <!--/CONTENT-->
    <div style="text-align: center;">
      <p>This page was made with: </p>
      <NuxtLogo />
    </div>
  </div>
</template>

<script>
import NuxtLogo from '~/components/NuxtLogo.vue'
export default {
  components: {
    NuxtLogo
  },
  async asyncData ({ $content, params, error }) {
    try {
      const articles = await $content({ deep: true })
        .only(['title', 'description', 'image', 'path'])
        .sortBy('createdAt', 'desc')
        .limit(9)
        .fetch()
      return { articles }
    } catch (err) {
      error({
        statusCode: 404,
        message: 'Page could not be found'
      })
    }
  },
  data () {
    return {
      page: 1
    }
  },
  methods: {
    async getMorePosts () {
      const blogPosts = await this.$content({ deep: true })
        .only(['title', 'description', 'image', 'path'])
        .sortBy('createdAt', 'desc')
        .skip(9 * this.page)
        .limit(9)
        .fetch()
      blogPosts.forEach((post) => {
        this.articles.push(post)
      })
      this.page++
    },
    lowerCase (s) {
      return s.toLowerCase()
    }
  }
}
</script>

<style scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
}
</style>
