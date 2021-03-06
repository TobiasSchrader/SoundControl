$(document).ready(setup);

let context;
let source;
let group_no=1;
let button_no=1;
let gainNode;
let stopped;
let currentlyPlaying;
let volume=0.5;

function setup() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    build("g0", sound_info);
	gainNode = context.createGain();
	gainNode.gain.value=0.25;
	document.getElementById( "stop" ).addEventListener(
		'click', function() { stop(); } );
		document.getElementById( "fadeout" ).addEventListener(
		'click', function() { fadeOut(3); } );
}
 
function load_buffer(song) {
    console.log( `load_buffer: ${song.src}` );
    let request = new XMLHttpRequest();
    request.open("GET", song.src, true);
    request.responseType = "arraybuffer";

    let loader = this;

    request.onload = function() {
    // Asynchronously decode the audio file data in request.response
	console.log( "onload "+song.src );
	context.decodeAudioData(
	    request.response,
	    function(buffer) {
		if (!buffer) {
		    alert('error decoding file data: ' + url);
		    return;
		}
		song.buffer = buffer;
	    },
	    function(error) {
		console.error('decodeAudioData error', error);
	    }
	);
    }

    request.onerror = function() {
	alert('BufferLoader: XHR error');
    }

  request.send();
}


function build(group_name, group) {
    group.current_song=0;
    console.log( group.name );
    if (  "subs" in group ) {
        let this_group="g"+group_no++;
        $( "#"+group_name ).append( `<ul id="${this_group}">` );
        for ( let sub of group.subs ) {
			if (sub.songs && sub.songs.length > 0) {
			  let button_id="b"+button_no++;
              $( `#${this_group}` )
		    .append(`<li><button type="button" id="${button_id}">${sub.name}</button></li>` );
              document.getElementById( button_id ).addEventListener(
			  'click', function() { play( sub ); } );
			} else {
				$( `#${this_group}` )
				.append(`<li>${sub.name}</li>`);
			}
	    build( this_group, sub );
        }
    }
    if ( "songs" in group ) {
	for ( let song of group.songs ) {
	    load_buffer( song );
	}
    }
}

function play(group) {
	if (source) stop();
    console.log(group);
	currentlyPlaying=group;
    document.getElementById( "info" ).innerText=group.name+" "+group.current_song+" "+group.songs.length;
    playSound( group.songs[group.current_song].buffer);
    group.current_song = ( group.current_song + 1 ) % group.songs.length;
	
}

function playSound(buffer) {
	console.log("playing: ");
	console.log(currentlyPlaying);
	setTimeout(function() {
			stopped=false;
			}, 1000);
	source = context.createBufferSource();
    source.buffer = buffer;						// tell the source which sound to play
    //source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	// Connect source to a gain node
	source.connect(gainNode);
	// Connect gain node to destination
	gainNode.connect(context.destination);
	source.start(0);    	// play the source now
	source.addEventListener("ended", loopMusic);
}

changeVolume = function(element) {
  //var volume = element.value;
  var fraction = parseInt(element.value) / parseInt(element.max);
  setVolume(fraction);
};

setVolume = function(fraction) {
	console.log("Volume set to "+fraction);
	// Let's use an x*x curve (x-squared) since simple linear (x) does not
	// sound as good.
	gainNode.gain.value = fraction * fraction;
	volume=fraction;
}
stop = function() {
	console.log("stop called");
  if (!source.stop)
    source.stop = source.noteOff;
  source.stop(0);
  stopped=true;
  //source='';
};

fadeOut = function(length) {
	console.log("fadeout");
	length=3;
	let saveVolume=volume;
	step=Math.trunc(100*volume/(length*5))/100;
	console.log(step);
	let time=0
	while(time < length) {
		time+=0.2;
		setTimeout(function() {
			console.log(volume-step);
			setVolume(volume-step);
			}, time*1000);	
	}
	setTimeout(function() {
		stop();
		setVolume(saveVolume);
		}, length*1000);
}
//source.onended = function(event) {
function loopMusic() {
	console.log("onended called");
	if(!stopped && !currentlyPlaying.jingle) {
		console.log("looped");
		if(currentlyPlaying) {
		play(currentlyPlaying);
		}
	}
}