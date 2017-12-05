
var recognition;

$(document).ready(function() {

	var create_email = false;
	var final_transcript = '';
	var recognizing = false;
	var ignore_onend;
	var start_timestamp;

	if (!('webkitSpeechRecognition' in window)) {
  			upgrade();
	} else {
		  recognition = new webkitSpeechRecognition();
		  console.log(recognition);
		  recognition.continuous = false;//when the user stops speaking, recognition ends
		  recognition.interimResults = true;

		  recognition.onstart = function() { 
		  	console.log("starting!");
		  	recognizing = true;
	  	    //showInfo('info_speak_now');
	  	    start_img.src = 'mic-animate.gif';
		  };
		  recognition.onresult = function(event) {
		  	var interim_transcript = '';
	  	    for (var i = event.resultIndex; i < event.results.length; ++i) {
	  	      if (event.results[i].isFinal) {
	  	        final_transcript += event.results[i][0].transcript;
	  	      } else {
	  	        interim_transcript += event.results[i][0].transcript;
	  	      }
	  	    }
	  	    final_transcript = capitalize(final_transcript);
	  	    final_span.innerHTML = linebreak(final_transcript);
	  	    interim_span.innerHTML = linebreak(interim_transcript);
	  	    console.log(final_transcript);
	  	    //action(final_transcript);
	  	    
		  };
		  recognition.onerror = function(event) { 
		  	if (event.error == 'no-speech') {
		  	      start_img.src = 'mic.gif';
		  	      //showInfo('info_no_speech');
		  	      ignore_onend = true;
	  	    }
	  	    if (event.error == 'audio-capture') {
	  	      start_img.src = 'mic.gif';
	  	      //showInfo('info_no_microphone');
	  	      ignore_onend = true;
	  	    }
	  	    if (event.error == 'not-allowed') {
	  	      if (event.timeStamp - start_timestamp < 100) {
	  	        //showInfo('info_blocked');
	  	      } else {
	  	        //showInfo('info_denied');
	  	      }
	  	      ignore_onend = true;
	  	    }
		  };
		  recognition.onend = function() { 

		  	recognizing = false;
	  	    if (ignore_onend) {
	  	      return;
	  	    }
	  	    start_img.src = 'mic.gif';
	  	    if (!final_transcript) {
	  	      //showInfo('info_start');
	  	      return;
	  	    }
	  	    //showInfo('');
	  	    if (window.getSelection) {
	  	      window.getSelection().removeAllRanges();
	  	      var range = document.createRange();
	  	      range.selectNode(document.getElementById('final_span'));
	  	      window.getSelection().addRange(range);
	  	    }
	  	    
		  };

		  $("#start_button").click(function(e){
		  	console.log("Start button clicked!\n");
		  	final_transcript = '';
		  	recognition.lang = 'en-US';
		  	recognition.start();
		  	console.log("ending onclick event");
		  });

		  
  	}
});


var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}




