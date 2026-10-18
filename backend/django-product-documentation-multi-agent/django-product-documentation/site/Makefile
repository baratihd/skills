PYTHON ?= python3
DOC_PYTHON := .venv/bin/python

.PHONY: help setup build serve check check-theme clean
help:
	@printf '%s\n' 'make setup: install documentation dependencies (network requires authorization)' 'make serve: local preview' 'make check: strict build' 'make check-theme: optional offline Chrome checks'
setup:
	$(PYTHON) -m venv .venv
	$(DOC_PYTHON) -m pip install -r requirements.txt
build:
	$(DOC_PYTHON) -m mkdocs build --strict
serve:
	$(DOC_PYTHON) -m mkdocs serve --dev-addr 127.0.0.1:8001
check: build
check-theme: build
	node tools/check-theme.mjs
clean:
	rm -rf _site
