class Story {
  constructor(node) {
    Object.assign(this, node);
  }
}

const singleStory = (record) => {
  return new Story(record._fields[0])
}

const manyStories = (records) => {
  return records.map(node => singleStory(node))
}


Story.create = (props) => {
  const session = db.session()
  return session.run(`CREATE (n:Story) SET n += ${props} RETURN n`).then(res => {
      session.close()
      return singleUser(res.records[0])
  })
}

Story.getAll = ({ limit = 25 }) => {
  const session = db.session()
  return session.run(`MATCH (n:Story) RETURN n LIMIT ${limit}`)
    .then(res => {
      session.close()
      return manyEmails(res.records)
    })
}

module.exports = Story
