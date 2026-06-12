---
layout: post
title: "Refactoring my OSINT recon tool: from script to Python package"
date: 2026-06-12
tags: [python, refactoring, software-engineering, packaging, testing, cybersecurity]
excerpt: "v0.3.0 of my OSINT recon tool shipped last night with no new features. Here's why that was the right call, and what refactoring a 1083-line script into a proper Python package taught me."
---

v0.3.0 shipped last night. Nothing changed for users. The CLI behaves identically, the output matches v0.2.1 byte for byte, every flag still works the same way. Release notes show zero new features.

It's the release that mattered most so far.

## Refactoring without features

I started with one Python file. v0.1.0 was about 300 lines: WHOIS lookups, DNS records, HTTP probing. Two weeks later v0.2.0 added RDAP, full email auth audits, and service-token classification, and the file hit 800. The v0.2.1 cleanup pass added type hints and section dividers but kept everything in one file. That release crossed 1000 lines.

Subdomain enumeration is next on the roadmap. Adding it to a 1083-line file would have meant editing code scattered across half a dozen logical sections. Scrolling to find a specific function meant five page-downs. Each new feature was getting harder to land cleanly.

Refactoring is for the moment when adding features starts to feel like archaeology.

## From script to package

Two layout options exist for a Python package. Flat layout puts the package directory at the repo root next to README.md. Src layout puts the package one level deep under `src/`. The Python Packaging User Guide recommends src for new projects because it prevents accidental imports of the development copy and forces you to install the package before testing it. Packaging bugs surface earlier that way.

I went with src.

Pair that with `pyproject.toml` declaring metadata, dependencies, and a console script entry point, and the project becomes pip-installable. After `pip install -e .` the tool runs as `osint-recon example.com` from anywhere on PATH inside the venv. That console script line in pyproject.toml is what turns "a Python file I wrote" into "a Python tool I built."

1083 lines split across 11 files. `constants.py` holds the lookup tables. `utils.py` has the small display helpers used in two or three other modules. `validation.py` handles domain input sanitization. `registration.py` does RDAP with WHOIS fallback. `dns_enum.py` covers DNS records plus the service-token classifier. `email_security.py` is the SPF, DMARC, DKIM, BIMI audit. `http_probe.py` does HTTP and HTTPS checks. `reporting.py` writes the plaintext report. `cli.py` ties everything together with argparse, the dependency check, and the main coordinator. `__init__.py` and `__main__.py` make the package importable and runnable as a module.

The boundaries follow scan stages. Shared helpers got factored out where multiple modules needed them. The cli.py entry point does a friendly dependency check before importing modules that need third-party libraries, so a user missing whoisit or dnspython sees a clean install instruction instead of a Python traceback.

The dependency graph between modules is clean. No circular imports. Each module can be reasoned about independently. Subdomain enumeration in v0.4.0 will land as a new file in this directory, called from cli.py like any other scan stage.

## The tests

Five test files, 67 tests, all pytest, all green in under a second.

They cover the pure-logic helpers: domain validation, SPF parsing, DMARC parsing, service-token classification, datetime formatting, and the report section writers. Everything in that list operates on string inputs and produces string or structured outputs. No network mocking needed because nothing in the test suite touches the network.

The functions that do touch the network (DNS lookups, HTTP probing, RDAP queries) aren't tested here. Those need either live network access or careful mocking, and both are bigger lifts than they're worth right now. Unit tests cover the logic most likely to break during refactors, which is what unit tests are for.

Writing tests retroactively for code that already worked felt weird the first time. The code was already correct. I'd manually tested it. Why bother codifying that? Because "I tested it manually and it looked right" isn't durable knowledge. Six months from now I won't remember which inputs I covered. The test suite remembers for me.

## Phased shipping

I shipped v0.3.0 across three commits over the course of one evening. Phase A was the module split and the pyproject.toml. Phase B was the pytest test suite. Phase C was the CHANGELOG update, the v0.3.0 tag, and the GitHub release. Each phase got smoke-tested before commit. Each commit got pushed before the next phase started.

Three small focused commits with clear messages. The alternative would have been one giant "v0.3.0" commit with hundreds of changes across a dozen new files. That commit would have been worse along every axis: harder to review, harder to bisect if something broke, less informative in the log, harder to roll back partially if Phase B revealed a problem in Phase A.

This phased rhythm is now my default. Big refactors get broken into shippable steps. Each step preserves a working state. The git history reads as a story instead of a wall of "fixed stuff" messages.

## What this signals

Portfolio projects tempt you to only ship things that show up on a feature list. New capability, demo-able output, something to brag about. Refactoring produces none of that.

But the tool went from "a script that grew" to "a Python package that can be installed, tested, and extended." That's a different kind of change. Adding subdomain enumeration to the old monolithic file would have meant pain. Adding it to the new structure is straightforward: new file, new tests, called from cli.py like any other scan stage. Structural work earns the next ten features.

Click through to the repo today and what shows up is a pyproject.toml, a tests directory with 67 passing tests, a CHANGELOG.md following Keep a Changelog, and four tagged releases. These are the things a recruiter or hiring engineer scans for in thirty seconds when evaluating a portfolio piece. Working code is the entry condition. Disciplined structure is what gets noticed.

## What's next

v0.4.0 will add subdomain enumeration through wordlist probes and certificate transparency log lookups. That work is landable cleanly now because of what shipped tonight.

v0.3.0 is on GitHub. The CHANGELOG entry for it runs longer than the previous three releases combined.

Full project: [github.com/Jorgy762/osint-domain-recon](https://github.com/Jorgy762/osint-domain-recon).

If your Python script is approaching 1000 lines, refactor before adding the next feature. Phase the work. Smoke test between phases. Write tests for the pure-logic helpers first. Document everything in a CHANGELOG.
