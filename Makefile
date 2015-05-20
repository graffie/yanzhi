TESTS = $(shell ls -S `find test -type f -name "*.test.js" -print`)
REPORTER = spec
TIMEOUT = 30000
MOCHA_OPTS =
REGISTRY = --registry=http://registry.npm.taobao.org
NODE_BIN = node_modules/.bin
SRC = client/src
DIST = client/dist

DIST_STATIC = $(DIST)/static
SASS_DIR = $(SRC)/assets/scss
JS_DIR = $(SRC)/app
SASS_OUTPUT = $(DIST_STATIC)/css
JS_OUTPUT = $(DIST_STATIC)/js

EGGSHELL_ASSETS = node_modules/eggshell/assets
BOURBON_ASSETS = node_modules/eggshell/node_modules/node-bourbon/assets/stylesheets

install:
	@npm install $(REGISTRY)

init-test:
	@NODE_ENV=test node db/init.js force
	@NODE_ENV=test node --harmony test/init.js

test: install init-test
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  --harmony \
		--bail \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require co-mocha \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov cov: install init-test
	@NODE_ENV=test node --harmony \
		node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/.bin/_mocha \
		-- -u exports \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
		--require should-http \
		--require co-mocha \
		$(MOCHA_OPTS) \
		$(TESTS)

test-travis: install init-test
	@NODE_ENV=test node --harmony \
		node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		--reporter dot \
		--timeout $(TIMEOUT) \
		--require should \
		--require should-http \
		--require co-mocha \
		$(MOCHA_OPTS) \
		$(TESTS)

vendor:
	@cp $(src)/assets/css/* $(DIST_STATIC)/css
	@cp $(src)/assets/js/* $(DIST_STATIC)/js

sass:
	@$(NODE_BIN)/node-sass --include-path $(BOURBON_ASSETS) --include-path $(EGGSHELL_ASSETS) $(SASS_DIR)/style.scss -o $(SASS_OUTPUT)
	@cp $(SRC)/index.html $(DIST)
	@cp -rf $(SRC)/assets/fonts $(DIST_STATIC)

watch-sass:
	@$(NODE_BIN)/watch 'make sass' $(SASS_DIR) & \
	$(NODE_BIN)/http-server $(DIST) -s

build-js:
	@$(NODE_BIN)/browserify --require react --require react-router | $(NODE_BIN)/uglifyjs -mc > $(JS_OUTPUT)/vendor.js
	@$(NODE_BIN)/browserify --external react --external react-router $(JS_DIR)/index.js \
		--extension .jsx \
		--transform babelify \
		--transform envify \
		| $(NODE_BIN)/uglifyjs -mc > $(JS_OUTPUT)/index.js
	@make vendor

watch-js:
	@mkdir -p client/dist/static/js
	@$(NODE_BIN)/watchify $(JS_DIR)/index.js \
		--extension .jsx \
		--transform babelify \
		--transform envify \
		-o $(JS_OUTPUT)/index.js -dv

watch:
	@make vendor
	@make watch-sass & make watch-js

autod: install
	@./node_modules/.bin/autod -w --prefix="~" \
	-e assets,views,client \
	-t test,client/src \
	-D istanbul-harmony,mocha,should,should-http,co-mocha
	@$(MAKE) install

.PHONY: test
