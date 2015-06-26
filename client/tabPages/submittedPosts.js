var click = false;
var countclickF = true;
var countclickFil = true;

Template.submittedPosts.events({
	"click #sortName": function(){
		if (!click) {
			console.log("start");
			click=true;
			return Session.set('dataSort', {postername: 1}); 
		} else {
			console.log("start");
			click=false;
			return Session.set('dataSort', {postername: -1});; 
		}		 
	},
	"click #sortDate": function() {
		if (!click) {
			click=true;
			return Session.set('dataSort', {date: -1}); 
		} else {
			click=false;
			return Session.set('dataSort', {date: 1});; 
		}		 
	},

	"click #sortInterviewer": function() {
		if (!click) {
			click=true;
			return Session.set('dataSort', {name_of_collector: -1}); 
		} else {
			click=false;
			return Session.set('dataSort', {name_of_collector: 1});; 
		}		 
	},
})

Template.submittedPosts.helpers({
	posts: function(){return Posts.find({}, {sort: Session.get('dataSort')})}
})

Template.postrow.helpers({
	ismyrow: function(){return Meteor.userId() == this.uid}
});

Template.postrow.events({
	"click .delete-icon": function(){Posts.remove(this._id);}
})