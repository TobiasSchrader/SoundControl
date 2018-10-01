let fs=require('fs');
let sound_info = {
	subs: []
}
let options = {
	withFileTypes: true
}

readdata("sounds");

function readdata(path) {
fs.readdir(path, options, function(err, content) {
	for (entry of content) {
		console.log(entry.name);
		if(entry.isDirectory()) {
			readdata(path+'/' + entry.name);
		} else if (entry.name=="jingle") {
		}
	} 
});
}

function makeSub(name) {
	let sub = {
		title: name,
		jingle: false,
	}
	return sub;
}