process.env.NODE_ENV = 'test'

import { expect } from 'chai'
import db from '../db'
import User from './model'

describe('User Model', () => {

  // start with a fresh DB
  beforeEach(done => {
    const query = `
      CREATE (uj:User {
        username: 'jared',
        password: 'neo4j',
        email: 'jared@palmer.net'
      })
      CREATE (ub:User {
        username: 'brent',
        password: 'neo4j',
        email: 'brent@palmer.net'
      })
      CREATE (ua:User {
        username: 'alexis',
        password: 'neo4j',
        email: 'alexis@palmer.net'
      })
      CREATE (uj)-[r:FOLLOWS]->(ub)
      CREATE (p:Post {
        postId: '0b994dfb-9fc5-44f3-a8fc-b0fd703c6975',
        publishedAt: 1463960709998,
        title: 'Hello World',
        body: 'La la la la.',
        slug: '/@jared/hello-world' })
      CREATE (uj)-[w:PUBLISHED {liked_at: timestamp()}]->(p)
      CREATE (uj)-[l:LIKED {liked_at: timestamp()}]->(p)`
    db.cypher({
      query,
    }).then(() => done()).catch(e => done(e))
  })

  afterEach(done => {
    db.cypher({
      query: 'MATCH (n) DETACH DELETE n'
    }).then(() => done()).catch(e => done(e))
  })

  // describe('Class Methods', done => {
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

    describe('getAll', done => {
      it('should get all users', done => {
        User.getAll({ limit: 25, skip: 0 }).then(users => {
          expect(users).to.be.a('array')
          expect(users[0].username).to.be.a('string')
          expect(users[0].password).to.be.a('string')
          expect(users[0].email).to.be.a('string')
          done()
        }).catch(e => done(e))
      })
    })
  // })

  // describe('Instance Methods', done => {
    describe('follow', done => {
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
        User.get('brent').then(user => {
          expect(user.username).to.equal('brent')
          return user.post({
              title: 'My First Post!',
              body: 'Hello world'
            })
        }).then(post => {
            expect(post).to.be.a('object')
            expect(post.title).to.equal('My First Post!')
            expect(post.body).to.equal('Hello world')
            expect(post.slug).to.equal('/@brent/my-first-post')
            return done()
        }).catch(e => done(e))
    })
  })
})
