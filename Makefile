
web_root/Fire.js : dev/Fire.ts
	tsc $^ --outFile $@ --target es6 

all: web_root/Fire.js
	echo "done"