import db from '../db'
import Joi from 'joi'
import Promise from 'bluebird'
import uuid from 'node-uuid'

Joi.validate = Promise.promisify(Joi.validate)

class User {
  constructor (node) {
    this.node = node
  }

  get username () {
    return this.node.properties.username
  }

  get email () {
    return this.node.properties.email
  }

  get password () {
    return this.node.properties.password
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
    return db.cypher({ query, params: props })
  }

  unfollow (username) {
    const query = `
      MATCH (a:User { username: { a } })-[r:FOLLOWS]->(b:User { username: { b } })
      DELETE r`
    const props = {
      a: this.username,
      b: username
    }
    return db.cypher({ query, params: props })
  }

  destroy () {
    const query = `
      MATCH (user:User { username: { username } })
      DELETE DETACH user`
    const params = { username: this.username }
    return db.cypher({ query, params })
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
  return Joi.validate(props, UserSchema)
    .then(props => db.cypher({ query, params: { props } }))
    .then(results => new User(results[0].user))
}

// Retrieve a list of all Users
User.getAll = ({ limit = 25 }) => {
  const query = 'MATCH (user:User) RETURN user LIMIT { limit }'
  const params = { limit }
  return db.cypher({ query, params })
  .then(results => {
    return results.map(record => new User(record.user))
  })
}

// Find one User by username
User.get = (username) => {
  const query = 'MATCH (user:User { username: { username } }) RETURN user'
  const params = { username }
  return db.cypher({ query, params })
    .then(results => new User(results[0].user))
}

export default User
