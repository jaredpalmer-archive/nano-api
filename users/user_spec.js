/* global describe it afterEach after beforeEach */
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
      CREATE (uj)-[r:FOLLOWS]->(ub)
      CREATE (p:Post {
        postId: '0b994dfb-9fc5-44f3-a8fc-b0fd703c6975',
        publishedAt: 1463960709998,
        title: 'Hello World',
        body: 'La la la la.',
        slug: '/@jared/hello-world' })
      CREATE (uj)-[w:PUBLISHED {liked_at: timestamp()}]->(p)
      CREATE (uj)-[l:LIKED {liked_at: timestamp()}]->(p)`
    return db.cypher({
      query,
      params: {}
    }).then(() => done())
  })

  afterEach(done => {
    db.cypher({
      query: 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n, r'
    }).then(() => done())
  })

  after(done => {
    db.cypher({
      query: 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n, r'
    }).then(() => done())
  })

  describe('Class Methods', done => {
    describe('create', done => {
      it('should create a new user', done => {
        const props = {
          username: 'alexis',
          password: 'neo4j',
          email: 'alexis@palmer.net'
        }
        User.create(props).then(user => {
          // console.log(user)
          expect(user.username).to.be.equal('alexis')
          expect(user.password).to.be.equal('neo4j')
          expect(user.email).to.be.equal('alexis@palmer.net')
          done()
        }).catch(e => done(e))
      })
    })

    describe('get', done => {
      it('should get a user', done => {
        User.get('jared').then(user => {
          expect(user.username).to.be.equal('jared')
          expect(user.password).to.be.equal('neo4j')
          expect(user.email).to.be.equal('jared@palmer.net')
          done()
        }).catch(e => done(e))
      })
    })

    describe('get all', done => {
      it('should get a user', done => {
        User.getAll({ limit: 25, skip: 0 }).then(users => {
          expect(users[0].username).to.be.equal('jared')
          expect(users[0].password).to.be.equal('neo4j')
          expect(users[0].email).to.be.equal('jared@palmer.net')
          done()
        }).catch(e => done(e))
      })
    })
  })

  describe('Instance Methods', done => {
    describe('follow', done => {
      it('should follow the target user', done => {
        User.get('brent').then(user => {
          expect(user.username).to.be.equal('brent')
          user.follow('jared')
          done()
        }).catch(e => done(e))
      })
    })

    describe('unfollow', done => {
      it('should unfollow the target user', done => {
        User.get('jared').then(user => {
          expect(user.username).to.be.equal('jared')
          user.unfollow('brent')
          done()
        }).catch(e => done(e))
      })
    })

    describe('post', done => {
      it('should post a status update', done => {
        User.get('jared').then(user => {
          expect(user.username).to.be.equal('jared')
          return user.post({
            title: 'Hello World',
            body: 'La la la la.'
          })
        }).then(post => {
          expect(post.title).to.be.equal('Hello World')
          expect(post.body).to.be.equal('La la la la.')
          expect(post.slug).to.be.equal('/@jared/hello-world')
          done()
        }).catch(e => done(e))
      })
    })

    describe('like', done => {
      it('should like a post', done => {
        User.get('jared').then(user => {
          expect(user.username).to.be.equal('jared')
          return user.like('0b994dfb-9fc5-44f3-a8fc-b0fd703c6975')
        }).then(like => {
          expect(like).to.be.a('object')
          expect(like.liked_at).to.be.a('number')
          done()
        }).catch(e => done(e))
      })
    })

    describe('unlike', done => {
      it('should unlike a post', done => {
        User.get('jared').then(user => {
          expect(user.username).to.be.equal('jared')
          return user.unlike('0b994dfb-9fc5-44f3-a8fc-b0fd703c6975')
        }).then(() => {
          done()
        }).catch(e => done(e))
      })
    })
  })
})
