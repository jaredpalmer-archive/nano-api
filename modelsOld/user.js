const db = require('../db')
const joi = require('joi')




class User {
  constructor(node) {
    Object.assign(this, node)
  }
}

// const singleUser = (record) => {
//   return new User(record._fields[0])
// }
//
// const manyUsers = (records) => {
//   return records.map(user => singleUser(user))
// }
//
// User.findByEmail = (e) => {
//   const session = db.session()
//   return session.run('MATCH (n:User {email: { e } }) RETURN n', { e })
//     .then(res => {
//       session.close()
//       return singleUser(res.records)
//     })
// }
//
// User.openEmail = (userEmail, emailId) => {
//   const session = db.session()
//   return session.run(`
//     MATCH (user:User { email: {userEmail}  }), (e:Email { id: { emailId } })
//     CREATE (user)-[r:OPENED]->(e)`, { userEmail, emailId }
//   ).then(res => {
//       session.close()
//       return res
//     })
// }
//
// User.find = () => {
//   const session = db.session()
//   return session.run('MATCH (n:User) RETURN n')
//     .then(res => {
//       session.close()
//       return manyUsers(res.records)
//     })
// }
//
// User.create = (props) => {
//   const session = db.session()
//   return session.run(`CREATE (n:User) SET n += { props } RETURN n`, { props }).then(res => {
//       session.close()
//       return singleUser(res.records[0])
//   })
// }
//
// User.destroyAll = () => {
//   const session = db.session()
//   return session.run('MATCH (n) DETACH DELETE n').then(res => session.close())
// }
//


// User.find = (props) => {
//   const session = db.session()
//   return session.run('MATCH (n:User { { props } }) RETURN n', { props })
//     .then(res => {
//       session.close()
//       return res.records
//     })
// }
//
// User.findByEmailAndUpdate = (e, updates) => {
//   const session = db.session()
//   return session.run(`
//     MATCH (n:User {email: { e } })
//     SET n += { updates }
//     RETURN n`, { e, updates })
//     .then(res => {
//       session.close()
//       return res.records
//     })
// }


module.exports = User
