---
layout: post
title: "Upgrading my OSINT recon tool: RDAP, email auth, and what auditing my own domain taught me"
date: 2026-05-31
tags: [python, osint, cybersecurity, rdap, email-security, dmarc]
excerpt: "Two weeks after the first version, I swapped WHOIS for RDAP, added a full email-authentication audit, and ran the tool against my own domain. Here is what I found, what I changed, and what it taught me about my own infrastructure."
---

The first version of my OSINT recon tool was a learning project. It worked, but it had real problems I did not see until I started using it on real targets. This is the second pass. Two big changes, one smaller one, and one moment that taught me more than the code did.

## Switching from WHOIS to RDAP

The original tool used the `python-whois` library to pull registration data. That library parses raw WHOIS text returned by registrars. The problem is that every registrar formats their WHOIS output differently, and they change those formats whenever they want. The parser breaks silently. One day you get a registrar field, the next day you get an empty string because the registrar updated their template and added a colon.

RDAP solves this. It is the Registration Data Access Protocol, defined in RFC 7480 through 7484, and it has been mandated for gTLD registrars by ICANN since 2019. Instead of unstructured text, you get a structured JSON response with named fields. The data is the same, but you can actually rely on the parsing.

I switched the primary lookup to RDAP using the `whoisit` library, with the old WHOIS path kept as a fallback for the small number of TLDs that still do not run RDAP servers. The output now tells you which protocol returned the data, so you can see at a glance whether your scan got modern structured data or legacy text parsing.

There is a real portfolio signal in this change too. RDAP is where the industry has actually gone. Using the modern standard shows you are tracking the field, not just grabbing the first library that came up on Stack Overflow.

## Adding email authentication audits

This is the bigger change. The tool now has a full SPF, DMARC, DKIM, and BIMI audit that runs by default. There is a `--no-email-security` flag if you want to skip it.

The interesting part is the SPF parser. Anyone can read an SPF record and count the includes in it. That is not useful. What actually matters is the recursive DNS lookup count, which RFC 7208 caps at 10 per evaluation. Most enterprise SPF records silently break because nested includes blow past that limit. So the parser walks the entire include chain, resolves each one, and counts the real DNS queries that would happen during a real SPF check. It also tracks void lookups (NXDOMAIN responses), which RFC 7208 caps at 2.

For DMARC, the parser pulls out every tag and flags the things that matter most. Is the policy actually enforcing, or is it sitting at `p=none` doing nothing? Are aggregate reports being collected anywhere?

DKIM was the hardest design call. There is no standard for selector names. Microsoft 365 uses `selector1` and `selector2`. Google Workspace uses `google`. Custom setups can use anything. The tool probes 29 common selectors based on what I have seen across major mail providers, and it tells you explicitly that a "no DKIM found" result means "no DKIM at common selectors," not "DKIM does not exist." Being honest about a tool's limitations is the difference between a tool a security professional respects and one they roll their eyes at.

## Service-token classification

Smaller but useful addition. When a SaaS provider verifies you own a domain, they ask you to publish a TXT record with a specific prefix. Those prefixes are persistent fingerprints. `MS=ms...` means Microsoft 365. `google-site-verification=` means Google Workspace or Search Console. `facebook-domain-verification=` means Meta. There are dozens of these, and they are passive OSINT signal about a target's entire SaaS footprint. The tool now maps 30+ of them against a domain's TXT records and tells you which services have touched it.

## What it found on my own domain

I ran the upgraded tool against `threatvector762.dev`. The numbers were better than I expected. SPF is hard-fail with one DNS lookup out of ten. DMARC is at `p=reject` with `pct=100`, the strictest enforcement available. DKIM is signing at both Microsoft 365 selectors. Aggregate report collection is working.

That gave me a moment of pride and then a moment of awareness. I have been telling people for years that they should harden their mail authentication. I had actually done it, and my own tool confirmed it. The feeling of having a security-branded persona that holds up to its own audit is hard to overstate.

## The lesson that was not in the code

There was a moment during this work where I removed a TXT verification token from my DNS because I read an offhand comment suggesting it was a minor OSINT leak. The advice was overstated. The token was already five degrees redundant given everything else discoverable about my mail setup. Worse, removing it carried a small but real operational risk: Microsoft 365 sometimes re-prompts for tenant verification, and that token can be required.

I acted without verifying. The token came out before I asked the question "what breaks if this advice is wrong?" The recovery was trivial, the lesson was not. Any change to live infrastructure (DNS, certificates, identity providers, firewall rules) deserves a 30-second pause and a recovery plan. That habit is easy to build on small infrastructure where the stakes are zero. It is much harder to build on big infrastructure where the stakes are everything. Build it now.

## What is next

The roadmap is shorter than it was. The big remaining items:

- Subdomain enumeration
- SSL/TLS certificate inspection
- JSON report export
- Refactor into proper modules before adding more

Subdomain enumeration is where this tool stops being "a thing that audits one domain" and starts being "a thing that maps a target's attack surface." That is the next major feature, and it deserves a proper design pass before any code gets written.

## The code

Full project on GitHub:

[github.com/Jorgy762/osint-domain-recon](https://github.com/Jorgy762/osint-domain-recon)

If you want to try it on your own domain, you should. There is real value in running adversarial tools against your own infrastructure. You learn what is discoverable, what is exposed, and what you forgot to clean up. Just remember the disclaimer: only run it against domains you own or have explicit written permission to test.
