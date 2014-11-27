TESTS = $(shell ls -S `find test -type f -name "*.test.js" -print`)
REPORTER = spec
TIMEOUT = 30000
MOCHA_OPTS =
REGISTRY = --registry=http://registry.npm.taobao.org

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

autod: install
	@./node_modules/.bin/autod -w --prefix="~" \
	-e assets,views \
	-t test \
	-D istanbul-harmony,mocha,should,should-http,co-mocha
	@$(MAKE) install

.PHONY: test
