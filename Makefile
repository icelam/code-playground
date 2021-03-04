define ESLINT_COMMAND
	npx eslint ./src
endef

define GIT_HOOKS_FOLDER
	.git/hooks
endef

define GIT_PRECOMMIT_HOOK
	$(GIT_HOOKS_FOLDER)/pre-commit
endef

# Start dev server
start:
	@npx es-dev-server@2.1.0 --root-dir ./src --app-index index.html --node-resolve --watch --open --port 8000

# Create git hooks
install-hooks:
	@mkdir -p ${GIT_HOOKS_FOLDER}
	@touch ${GIT_PRECOMMIT_HOOK}
	@echo '#!/bin/sh' > ${GIT_PRECOMMIT_HOOK}
	@echo $(ESLINT_COMMAND) >> ${GIT_PRECOMMIT_HOOK}
	@chmod +x ${GIT_PRECOMMIT_HOOK}

# eslint
lint:
	@${ESLINT_COMMAND}

# Create the first release
first-release:
	@npx standard-version --first-release

# Create a new release
release:
	@npx standard-version
