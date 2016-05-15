// process.env.NODE_ENV = 'test'
//
// import chai, { expect } from 'chai'
// import chaiAsPromised from 'chai-as-promised'
// import chaiHttp from 'chai-http'
// import Email from '../email/model'
// // import seed from './seed'
// import db from '../db'
//
// chai.use(chaiHttp)
// chai.use(chaiAsPromised)
//
// describe('Email model', () => {
//
//   // start with a fresh DB
//   beforeEach(done => {
//     const id = 'e7878c21-e03e-4fde-9322-1dc8e959c561'
//     db.cypher({
//       query: 'MATCH (n) DELETE n'
//     })
//     .then(() => {
//       return db.cypher({
//         query: 'CREATE (e:Email { props })',
//         params: {
//           props: {
//             id: 'e7878c21-e03e-4fde-9322-1dc8e959c561',
//             subject: 'Hello World',
//             preheader: 'yolo dolo'
//           }
//         }
//       })
//     }).then(() => {
//       done()
//     })
//
//   })
//
//   describe('POST /v1/users', (done) => {
//     it('should create a user and return the results', (done) => {
//       // chai.request(app)
//       // .post('/v1/users')
//       // .send({
//       //   firstName: 'Jared',
//       //   lastName: 'Palmer',
//       //   email: 'jared@palmer.net',
//       // })
//       // .end((err, res) => {
//       //   // res.should.have.status(200)
//       //   expect(res.status).to.equal(200)
//       //   expect(res).to.be.json
//       //   expect(res.body).to.be.a('object')
//       //   expect(res.body).to.have.property('firstName')
//       //   expect(res.body.firstName).to.be.a('string')
//       //   expect(res.body).to.have.property('lastName')
//       //   expect(res.body.lastName).to.be.a('string')
//       //   expect(res.body).to.have.property('email')
//       //   expect(res.body.email).to.be.a('string')
//       //   expect(res.body).to.have.property('id')
//       //   expect(res.body.id).to.be.a('number')
//         done()
//       })
//     })
//   })
