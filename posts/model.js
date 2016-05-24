export default class Post {
  constructor (node) {
    this.postId = node.postId
    this.publishedAt = node.publishedAt
    this.title = node.title
    this.body = node.body
    this.slug = node.slug
  }
}
