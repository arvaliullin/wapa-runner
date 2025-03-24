
all: go rs cpp

go:
	bun cmd/bench/main.js ./out/go/integrate.wasm ./out/go/wapa.json
rs:
	bun cmd/bench/main.js out/rs/wapa_integrate_rs.js out/rs/wapa.json
cpp:
	bun cmd/bench/main.js out/cpp/lib_cpp.out.wasm out/cpp/wapa.json

.PHONY: all go tinygo rs cpp
