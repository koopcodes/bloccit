const Topic = require("./models").Topic;

module.exports = {

//#1 We define a function called getAllTopics with a parameter called callback. In  getAllTopics, return the result of calling all on the Sequelize model which will return all records in the topics table
  getAllTopics(callback){
    return Topic.all()

//#2 When successful, the callback passed to the then method will execute. It contains all topics (if any) in the topics parameter. Inside, it calls the callback method passed into getAllTopics with null and the topics that came from the database. When we call getAllTopics from the controller, we'll pass a function that renders the view according to what we pass to the callback inside getAllTopics
    .then((topics) => {
      callback(null, topics);
    })
    .catch((err) => {
      callback(err);
    })
  }
}
