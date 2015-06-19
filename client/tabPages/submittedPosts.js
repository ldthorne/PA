Template.submittedPosts.helpers({
	posts: function(){return Posts.find();}
})

Template.postrow.helpers({
	ismyrow: function(){return Meteor.userId() == this.uid}
});

Template.postrow.events({
	"click .delete-icon": function(){Posts.remove(this._id);}
})