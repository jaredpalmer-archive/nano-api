const db = require('../db')
const joi = require('joi')

class Email {
  constructor ({ subject, preheader }) {
    this.subject = subject
    this.preheader = preheader
    this.save = this.save.bind(this)
  }

  save () {
    const session = db.session()
    return session.run(
      'CREATE (e:Email) SET e += { props } RETURN e', {
        props: {
          subject: this.subject,
          preheader: this.preheader
        }
      }).then(res => {
      session.close()
      return this
    })
  }
}

const singleEmail = (record) => {
  return new Email(record._fields[0])
}

const manyEmails = (records) => {
  return records.map(user => singleEmail(user))
}

Email.findById = (emailId) => {
  const session = db.session()
  return session.run('MATCH (e:Email {id: { emailId } }) RETURN e', { emailId})
    .then(res => {
      session.close()
      return singleEmail(res.records)
    })
}

Email.getAll = ({ limit = 25 }) => {
  const session = db.session()
  return session.run('MATCH (e:Email) RETURN e LIMIT { limit }', { limit: limit})
    .then(res => {
      session.close()
      return manyEmails(res.records)
    })
}

Email.create = (props) => {
  const session = db.session()
  return session.run('CREATE (e:Email) SET e += { props } RETURN e', { props}).then(res => {
    session.close()
    return singleEmail(res.records[0])
  })
}

module.exports = Email
