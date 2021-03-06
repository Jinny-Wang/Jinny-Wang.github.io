var command;
var recognition;
var lastfocus  = null;
$(document).ready(function() {
	
	$(".scrolldown").click(function() {
		window.alert("I was clicked!");
  	});

  	$('input').click(function(e){
  		console.log("input was clicked!");
  		lastfocus = e.target;
  		console.log(lastfocus);
  	});
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
	  	    //console.log(final_transcript);

	  	    
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

	  	    var text = final_span.innerHTML;
	  	    console.log(text);
	  	    command = text;
	  	    action(command);
	  	    console.log(command);
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

function simulateClick(element) {
  if (!element) return;
  var dispatchEvent = function (elt, name) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(name, true, true);
    elt.dispatchEvent(clickEvent);
  };
  dispatchEvent(element, 'mouseover');
  dispatchEvent(element, 'mousedown');
  dispatchEvent(element, 'click');
  dispatchEvent(element, 'mouseup');
}

//given a command spoke by the user,take actions accordingly
function action(text){
		console.log("Taking action on text");
	    console.log(text);

		var re = /^(click|scroll|input)\s(.*)/i;
	    var result = re.exec(text.toLowerCase());
	    
	 	if(result) {
		  var verb = result[1];
	      var arg = result[2];

	      console.log("verb: " + verb + ", args: " + arg)

	      switch(verb) {
	      	case "click":
	      	  // what do we do if click?
	      	  console.log("handling click")

	      	  //console.log($("*:contains('" + arg + "')"));

	      	  var stringpieces = arg.split(/\s/);

	      	  $("a,input,button").each(function() {
	      	  	if($(this)[0].tagName == "INPUT") {
	      	    	if(stringpieces[0]=="submit"||stringpieces[1]=="submit")
	      	    		simulateClick($(this)[0]);
	      	    }
	      	    else{
	      	    	var name = $(this)[0].innerHTML;
	      	    	
	      	    	console.log("name is",name);
	      	    	if(name==stringpieces[0] || name==stringpieces[1]){
	      	    		console.log("clicking",$(this));
	      	    		simulateClick($(this)[0]);
	      	    	}
	      	    	
	      	    }
	      	    //window.alert("I don't understand");
	      	  	
	      	  
	      	  });
	      	  break;
	      	case "scroll":
	      	  console.log("handling scroll`")
	      	  if(arg=="up"){
	      	  	//scroll up 
	      	  	$('html, body').animate({
	        		scrollTop: $(document).scrollTop()-150
	    		}, 1000);
	      	  }
	      	  	
	      	  else if(arg=="down"){
	      	  	//scroll down 
	      	  	$('html, body').animate({
	        		scrollTop: $(document).scrollTop()+150
	    		}, 1000);
	      	  }
	      	  else{
	      	  	$("#final_span").innerHTML = "I don't understand!";
	      	  	 window.alert("I don't understand");
	      	  }
	      	  break;
	      	case "input":
	      	  console.log("handling enter")
	      	  if(lastfocus != null){
	      	  	lastfocus.value = arg;
	      	  	console.log(lastfocus);
	      	  }
	      	  else{
	      	  	window.alert("I don't understand");
	      	  }

	      	  break;
	      	default:
	      	  window.alert("I don't understand");
	      	  console.log("sorry, that is not a recognized command")
	      }
	 	
}
}







