$(document).ready(setup);

let context;

let group_no=1;
let button_no=1;
    
function setup() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    build("g0", sound_info);
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
            let button_id="b"+button_no++;
            $( `#${this_group}` )
		.append(`<li><button type="button" id="${button_id}">${sub.name}</button></li>` );
            document.getElementById( button_id ).addEventListener(
		'click', function() { play( sub ); } );
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
    console.log(group);
    document.getElementById( "info" ).innerText=group.name+" "+group.current_song+" "+group.songs.length;
    playSound( group.songs[group.current_song].buffer );
    group.current_song = ( group.current_song + 1 ) % group.songs.length;
}

function playSound(buffer) {
    let source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                             // note: on older  
}
