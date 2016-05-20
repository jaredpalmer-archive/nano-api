process.env.NODE_ENV = 'test'

import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiHttp from 'chai-http'
import db from '../db'
import User from './model'
import server from '../server'

chai.use(chaiHttp)
chai.use(chaiAsPromised)

describe('User Model', () => {

  // start with a fresh DB
  beforeEach(done => {
    db.cypher({
      query: 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n, r'
    })
    .then(() => {
      return db.cypher({
        query: 'CREATE (u:User { props })',
        params: {
          props: {
            username: 'jared',
            password: 'neo4j',
            email: 'jared@palmer.net'
          }
        }
      })
    }).then(() => {
      return db.cypher({
        query: 'CREATE (u:User { props })',
        params: {
          props: {
            username: 'brent',
            password: 'neo4j',
            email: 'brent@palmer.net'
          }
        }
      })
    }).then(() => done())
  })

  afterEach(done => {
    db.cypher({
      query: 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n, r'
    }).then(() => done())
  })

  describe('Class Methods', done => {
    describe('create', done => {
      it('should create a new user', done => {
        const props = {
          username: 'jared',
          password: 'neo4j',
          email: 'jared@palmer.net'
        }
        User.create(props).then(user => {
          expect(user.username).to.equal('jared')
          expect(user.password).to.equal('neo4j')
          expect(user.email).to.equal('jared@palmer.net')
          done()
        }).catch(e => done(e))
      })
    })

    describe('get', done => {
      it('should get a user', done => {
        User.get('jared').then(user => {
          expect(user.username).to.equal('jared')
          expect(user.password).to.equal('neo4j')
          expect(user.email).to.equal('jared@palmer.net')
          done()
        }).catch(e => done(e))
      })
    })
  })

  describe('Instance Methods', done => {
    describe('friend', done => {
      it('should follow the target user', done => {
        User.get('jared').then(user => {
          expect(user.username).to.equal('jared')
          user.follow('brent')
          done()
        }).catch(e => done(e))
      })
    })
    describe('unfollow', done => {
      it('should unfollow the target user', done => {
        User.get('jared').then(user => {
          expect(user.username).to.equal('jared')
          user.unfollow('brent')
          done()
        }).catch(e => done(e))
      })
    })
    describe('post', done => {
      it('should post a status update', done => {
        const date = Date.now()
        User.get('jared').then(user => {
          expect(user.username).to.equal('jared')
          user.post({
            date:
            text: 'jared status 1',
          }).then(post => {
            expect(post).to.equal('jared')
          })
          done()
        }).catch(e => done(e))
      })
    })
  })
})
