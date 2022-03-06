
GL.js : GL.ts
	tsc $^ --target es6

all: GL.ts
	echo "done"