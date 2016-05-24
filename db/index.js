import neo4j from 'neo4j'
import Bluebird from 'bluebird'
import config from '../config'

const USER = config.NEO4J_USER
const PASSWORD = config.NEO4J_PASSWORD
const URL = config.NEO4J_URL

const db = new neo4j.GraphDatabase(`http://${USER}:${PASSWORD}@${URL}`)

db.cypher = Bluebird.promisify(db.cypher)

export default db
