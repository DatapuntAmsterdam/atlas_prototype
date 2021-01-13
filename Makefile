# show help by default
.DEFAULT_GOAL := help

# PHONY prevents filenames being used as targets
.PHONY: help info rebuild status start stop logs restart build shell

_MAKEFILE_BUILTIN_VARIABLES := .DEFAULT_GOAL CURDIR MAKEFLAGS MAKEFILE_LIST SHELL

_MAKEFILE_VARIABLES := $(foreach make_variable, $(sort $(.VARIABLES)),\
	$(if $(filter-out _% HELP_FUN $(_MAKEFILE_BUILTIN_VARIABLES),$(make_variable)),\
		$(if $(filter file,$(origin $(make_variable))),\
			"\n$(make_variable)=$($(make_variable))"\
		)\
	)\
)

help: ## show this help screen
	@echo "Atlas Makefile help"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

info: ## dump Makefile variables to screen
	@echo -e $(_MAKEFILE_VARIABLES)

build: ## build Docker Compose images
	docker-compose build

start: ## start single Docker Compose service
	docker-compose up --remove-orphans

stop: ## stop Docker Compose
	docker-compose down -v --remove-orphans

images: ## list Docker Compose images
	docker-compose images

restart: stop start status ## restart Docker Compose

status: ## show Docker Compose process list
	docker-compose ps

rebuild: stop build start status ## rebuild Docker Compose

shell: ## execute command on container
	docker-compose exec atlas sh

logs: ## tail Docker Compose container logs
	docker-compose logs --tail=100 -f atlas
