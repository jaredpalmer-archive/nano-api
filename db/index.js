import neo4j from 'neo4j'
import Bluebird from 'bluebird'
const db = new neo4j.GraphDatabase('http://neo4j:neo5j@localhost:7474')

db.cypher = Bluebird.promisify(db.cypher)

export default db
