---
layout: post
title: "Building an OSINT domain recon tool from scratch"
date: 2026-05-18
tags: [python, osint, cybersecurity, tools]
excerpt: "How I built a Python-based domain reconnaissance tool as my first real coding project, what I learned along the way, and why it matters for practical security work."
---

This is my first real coding project beyond PowerShell scripts and one-liners. I wanted to build something that was actually useful, tied directly to my security interests, and demonstrated skills relevant to the kind of work I want to do. A domain recon tool checked all three boxes.

## What it does

The tool automates the first phase of any domain investigation. Given a target domain, it runs four checks in sequence:

- IP resolution via standard DNS lookup
- WHOIS data (registrar, creation date, expiry, name servers, country)
- DNS record enumeration (A, AAAA, MX, NS, TXT, CNAME, SOA)
- HTTP/HTTPS probing (status code, server header, redirect chain)

Results print to the terminal or export to a plaintext report with the `-o` flag.

## Why I built it this way

Most people learning Python start with calculator apps or guessing games. Those are fine for syntax, but they don't teach you anything about how tools actually work in the field. Starting with a recon tool meant I had to learn:

- How DNS resolution actually works under the hood
- What WHOIS data tells you and what it doesn't
- How HTTP redirects chain together
- How to handle errors gracefully when a host is unreachable
- How to structure a CLI tool with argument parsing

Every one of those things is directly applicable to real security work.

## The hardest part

Error handling. When you're probing domains across the internet, everything can and will fail. DNS timeouts, NXDOMAIN responses, SSL certificate errors, connection refusals. The first version of this tool crashed constantly because I wasn't catching exceptions properly.

Learning to anticipate failure modes and handle them gracefully is one of the most valuable things a security practitioner can learn. Production systems fail in the same ways.

## What I'd add next

The current version is functional but basic. The roadmap includes:

- Subdomain enumeration
- SSL/TLS certificate inspection
- Shodan API integration for open port data
- JSON report export

## The code

The full project with installation instructions is on GitHub:

[github.com/Jorgy762/osint-domain-recon](https://github.com/Jorgy762/osint-domain-recon)

If you're just getting started with Python and want a real project to work through, feel free to fork it, break it, and improve it.
