Meteor.publish("thePosts",function(){return Posts.find();});
Meteor.publish("theScores",function(){return Scores.find();});

