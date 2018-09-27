let sound_info = {
    subs: [
	{ name: "Pause",
	  jingle: false,
	  songs: [ { title: "Techno", src: "sounds/techno.wav" },
		   { title: "Blue Yellow", src: "sounds/blueyellow.wav" },
		 ] },
	{ name: "Kurze Ecke",
	  jingle: true,
	  songs: [ { title: "Clapping Crows", src: "sounds/clapping-crowd.wav" } ] },
	{ name: "Tor",
	  jingle: true,
	  subs: [ { name: "Jambo",
		    jingle: true,
		    songs: [ { name: "Organ", src: "sounds/organ-echo-chords.wav" } ] } ],
	  songs: [ { title: "Nothing compares to you", src: "sounds/nothing.wav" },
		   { title: "abc", src: "sounds/abc.wav" },
		 ]
	},
	{ name: "Test1",
	  songs: []
	},
	{ name: "Test2",
	  jingle: true
	}
    ]
};
