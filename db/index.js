import neo4j from 'neo4j'
import Bluebird from 'bluebird'
const db = new neo4j.GraphDatabase(process.env.GRAPHENEDB_URL)

db.cypher = Bluebird.promisify(db.cypher)

export default db
