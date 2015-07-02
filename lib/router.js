Router.configure({
	layoutTemplate: 'layout',
	//loadingTemplate: 'loading',
	//waitOn: function() {return true;}   // later we'll add more interesting things here .... 
});

Router.route('/', {name: 'stories'});

Router.route('/aboutUs', {name: 'aboutUs'});

Router.route('/policy', {name:'policy'})

Router.route('/john', {name:'john'})

Router.route('/david', {name:'david'})

Router.route('/paul', {name:'paul'})

Router.route('/harry', {name:'harry'})

Router.route('/anonymous01', {name:'anonymous01'})

Router.route('/Leon_Daniel_Thorne', {name:'dthorne'})

Router.route('/Alvin_Liu', {name:'aliu'})

Router.route('/Daniel_Shpilsky', {name:'dshpilsky'})

Router.route('/Skye_Golann', {name:'sgolann'})

Router.route('/interviewees', {name:'interviewees'})

Router.route('/submit', {name:'submit'})

Router.route('/submittedPosts', {name:'submittedPosts'})
Router.route('/graphicsTest', {name:'graphicsTest'})

Router.route('/fireflyGame', {name:'fireflyGame'});

Router.route('/leaderboard', {name:'leaderboard'});




