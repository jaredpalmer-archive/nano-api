import db from '../db'
import Joi from 'joi'
import Promise from 'bluebird'
import uuid from 'node-uuid'

Joi.validate = Promise.promisify(Joi.validate)

class Email {
  constructor (opts) {
    Object.assign(this, opts)
  }

  update (props) {
    const query = `
      MATCH (email:Email { id: { id } })
      SET email += { props }
      RETURN email`
    props.id = this.id
    return Joi.validate(props, Joi.object().keys({
      id: Joi.string().guid().required(),
      subject: Joi.string(),
      preheader: Joi.string()
    }))
    .then(props => db.cypher({ query, params: { props } }))
    .then(results => new Email(results[0].email))
  }

  destroy () {
    const query = `
      MATCH (email:Email { id: { id } })
      DELETE DETACH email`
    const params = { id: this.id }

    return db.cypher({ query, params })
      .then(results => new Email(results[0].email))
  }

}

// Email Schema
const EmailSchema = Joi.object().keys({
  id: Joi.string().guid().required(),
  subject: Joi.string().required(),
  preheader: Joi.string().required()
})

// Static Methods

// Create a new email node
Email.create = (props) => {
  const query = `
    CREATE (email:Email { props })
    RETURN email`
  props.id = uuid.v4()
  return Joi.validate(props, EmailSchema)
    .then(props => db.cypher({ query, params: { props } }))
    .then(results => new Email(results[0].email))
}

// Retrieve a list of all email nodes
Email.getAll = ({ limit = 25 }) => {
  const query = 'MATCH (email:Email) RETURN email LIMIT { limit }'
  const params = { limit }
  return db.cypher({ query, params })
  .then(results => {
    return results.map(record => new Email(record.email))
  })
}

// Find one Email by its id
Email.findById = (id) => {
  const query = 'MATCH (e:Email { id: { id } }) RETURN e LIMIT { limit }'
  const params = { id }
  return db.cypher({ query, params })
    .then(results => new Email(results[0].email))
}

export default Email
