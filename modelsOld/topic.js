class Topic {
  constructor(node) {
    Object.assign(this, node);
  }
}

const singleTopic = (record) => {
  return new Topic(record._fields[0])
}

const manyTopics = (records) => {
  return records.map(node => singleTopic(node))
}

module.exports = Topic
