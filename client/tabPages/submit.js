var final_transcript = '';
var recognizing = false;

if ('webkitSpeechRecognition' in window) {
	console.log("webkit is available!");
	var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      recognizing = true;
    };

    recognition.onerror = function(event) {
      console.log(event.error);
    };

    recognition.onend = function() {
      recognizing = false;
    };

    recognition.onresult = function(event) {
		myevent = event;
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
		  console.log("i="+i);
        if (event.results[i].isFinal) {
          final_transcript += 
          		capitalize(event.results[i][0].transcript.trim()) +".\n";
          		console.log(event.results[i][0].transcript);
          		
		  console.log('final events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
        } else {
          interim_transcript += 
          		event.results[i][0].transcript;
          		

          		if(capitalize(event.results[i][0].transcript.trim()).toLowerCase().indexOf("stop dictation") != -1){
          			recognition.stop();
          		}

          		if(capitalize(event.results[i][0].transcript.trim()).toLowerCase().indexOf("read it back") != -1){
      				recognition.stop();
      				readItBack(event);
          		}


		  console.log('interim events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
        }
      }
      //final_transcript = capitalize(final_transcript);
      final_span.innerHTML = linebreak(final_transcript);
      interim_span.innerHTML = linebreak(interim_transcript);
	  
    };
}


var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
  return s.replace(s.substr(0,1), function(m) { return m.toUpperCase(); });
}

function startDictation(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'en-US';
  recognition.start();
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
}


Template.submit.helpers({
	inputData: function(){
		var postobj = Posts.findOne({uid:Meteor.userId()});
		return postobj;
	}
})


	Template.submit.events({
		'click #start_button': function(event){
			startDictation(event);

		},
		'click .say': function(event){
			readItBack(event);
		},

		"submit #editInfo": function(event){
			event.preventDefault();

			var posttitle = event.target.posttitle.value;
			var postername = event.target.postername.value;
			var name_of_collector = event.target.name_of_collector.value;
			var post = event.target.post_content.value;
			var date = event.target.date.value;
			var picture = event.target.picture.value

			Posts.update(this._id,
				{$set:{posttitle:posttitle, postername:postername, name_of_collector:name_of_collector, post:post, date:date, picture:picture}});

			Router.go('/submittedPosts');
			
		},

		"submit #inputInfo": function(event){
			event.preventDefault();

			var posttitle = event.target.posttitle.value;
			var postername = event.target.postername.value;
			var name_of_collector = event.target.name_of_collector.value;
			var post = event.target.post_content.value;
			var date = event.target.date.value;
			var picture = event.target.picture.value
      var uid = Meteor.userId();

			Posts.insert({posttitle:posttitle, uid:uid, postername:postername, name_of_collector:name_of_collector, post:post, date:date, picture:picture});

			Router.go('/submittedPosts');
			
		}
	});