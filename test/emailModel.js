process.env.NODE_ENV = 'test'

import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiHttp from 'chai-http'
import Email from '../email/model'
// import seed from './seed'
import db from '../db'
import server from '../server'
chai.use(chaiHttp)
chai.use(chaiAsPromised)

describe('Email model', () => {

  // start with a fresh DB
  beforeEach(done => {
    const id = 'e7878c21-e03e-4fde-9322-1dc8e959c561'
    db.cypher({
      query: 'MATCH (n) DELETE n'
    })
    .then(() => {
      return db.cypher({
        query: 'CREATE (e:Email { props })',
        params: {
          props: {
            id: 'e7878c21-e03e-4fde-9322-1dc8e959c561',
            subject: 'Hello World',
            preheader: 'yolo dolo'
          }
        }
      })
    }).then(() => done())
  })

  describe('Email.create', (done) => {
    it('should create a new email', (done) => {
      const props = {
        subject: 'Hello World',
        preheader: 'yolo'
      }
      Email.create(props).then(email => {
        expect(email).to.be.a('object')
        expect(email).to.have.property('_id')
        expect(email).to.have.property('labels')
        expect(email).to.have.property('properties')
        expect(email.properties).to.deep.equal({id: email.id, ...props})
        done()
      })
      .catch((e) => done(e))
    })

    it('should throw an error if given invalid data', (done) => {
      const props = {
        subject: 'Hello World',
        preheader: 1
      }
      Email.create(props).then(email => {
        // want to test errors
      })
      .catch(ValidationError => {
        expect(ValidationError.message).to.deep.equal('child "preheader" fails because ["preheader" must be a string]')
        done()
      })
      .catch(e => done(e))
    })

    it('should throw an error if given incomplete data', (done) => {
      const props = {
        subject: 'Hello World'
      }
      Email.create(props).then(email => {
        // want to test errors
      })
      .catch(AssertionError => {
        expect(AssertionError.message).to.deep.equal('child "preheader" fails because ["preheader" is required]')
        done()
      })
      .catch(e => done(e))
    })
  })
})
