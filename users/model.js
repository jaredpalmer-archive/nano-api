import db from '../db'
import Joi from 'joi'
import Promise from 'bluebird'
import uuid from 'node-uuid'
import slug from 'slug'
import Post from '../posts/model'
import bcrypt from 'bcrypt'

Joi.validate = Promise.promisify(Joi.validate)

class User {
  constructor (node) {
    this.username = node.username
    this.password = node.password
    this.email = node.email

    this.update = this.update.bind(this)
    this.follow = this.follow.bind(this)
    this.unfollow = this.unfollow.bind(this)
    this.like = this.like.bind(this)
    this.post = this.post.bind(this)
  }

  verifyPassword (password) {
    return bcrypt.compareSync(password, this.password)
  }

  update (props) {
    const query = `
      MATCH (user:User { username: { username } })
      SET user += { props }
      RETURN user`
    props.username = this.username
    return Joi.validate(props, Joi.object().keys({
      username: Joi.string(),
      password: Joi.string(),
      email: Joi.string().email()
    }))
    .then(props => db.cypher({ query, params: { props } }))
    .then(results => new User(results[0].user))
  }

  follow (username) {
    const query = `
      MATCH (a:User { username: { a } }), (b:User { username: { b } })
      MERGE (a)-[r:FOLLOWS]->(b)`
    const props = {
      a: this.username,
      b: username
    }
    return db.cypher({ query, params: props, lean: true })
  }

  unfollow (username) {
    const query = `
      MATCH (a:User { username: { a } })-[r:FOLLOWS]->(b:User { username: { b } })
      DELETE r`
    const props = {
      a: this.username,
      b: username
    }
    return db.cypher({ query, params: props, lean: true })
  }

  destroy () {
    const query = `
      MATCH (user:User { username: { username } })
      DELETE DETACH user`
    const params = { username: this.username }
    return db.cypher({ query, params, lean: true })
  }

  post (props) {
    const query = `
      MATCH (me:User {username: {username} })
      MERGE (me)-[:PUBLISHED]->(post:Post {
        postId: { postId },
        title: { title },
        body: { body },
        slug: { slug },
        published_at: timestamp()
      })
      RETURN post
    `
    const params = {
      username: this.username,
      title: props.title,
      body: props.body,
      postId: uuid.v4(),
      slug: `/@${this.username}/${slug(props.title.toLowerCase())}`
    }

    return db.cypher({ query, params, lean: true })
      .then(results => new Post(results[0].post))
  }

  like (postId) {
    const query = `
      MATCH (me:User { username: { username } }), (p:Post { postId: { postId } })
      CREATE (me)-[like:LIKED { liked_at: timestamp() }]->(p)
      RETURN like
    `
    const params = {
      username: this.username,
      postId
    }
    return db.cypher({ query, params, lean: true })
      .then(results => results[0].like)
  }

  unlike (postId) {
    const query = `
      MATCH (User { username: { me } })-[r:LIKED]->(p:Post { postId: { postId } })
      DELETE r`
    const props = {
      me: this.username,
      postId
    }
    return db.cypher({ query, params: props, lean: true })
  }

}

// User Schema
const UserSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required()
})

// Static Methods

// Create a new User node
User.create = (props) => {
  const query = `
    CREATE (user:User { props })
    RETURN user`
  // const hash =  bcrypt.hashSync(props.password, 10);
  // props.password = hash
  return Joi.validate(props, UserSchema)
    .then(props => db.cypher({ query, params: { props }, lean: true }))
    .then(results => new User(results[0].user))
}

// Retrieve a list of all Users
User.getAll = ({ limit = 25, skip = 0 }) => {
  const query = 'MATCH (user:User) RETURN user LIMIT { limit }'
  const params = { limit, skip }
  return db.cypher({ query, params, lean: true }, (err, results) => {
    return results.map(record => new User(record.user))
  })
}

// Find one User by username
User.get = (username) => {
  const query = 'MATCH (user:User { username: { username } }) RETURN user'
  const params = { username }
  return db.cypher({ query, params, lean: true })
    .then(results => new User(results[0].user))
}

export default User
