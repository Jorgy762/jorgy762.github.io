---
layout: post
title: "Building a Browser-Based Windows Log Analyzer"
date: 2026-05-19
tags: [tools, windows, security, sysadmin, blue-team, log-analysis, javascript]
excerpt: "How and why I built a client-side log parser for Windows Event XML, IIS W3C logs, and plain text -- and what I learned about browser XML parsing along the way."
---

I spend a fair amount of time digging through Windows logs -- triaging incidents, auditing policy changes on domain controllers, chasing down why IIS threw a wall of 500 errors at 2am. The standard approach is copying lines into Notepad and hammering Ctrl+F, which works right up until it doesn't.

**[Use the tool here &rarr;](/projects/log-analyzer)**

---

## The problem with .evtx

Binary EVTX files are not parseable in the browser. The format is a structured binary log container and there is no native browser API to read it. The workaround is exporting from Event Viewer first:

*Right-click any log channel &rarr; Save All Events As... &rarr; XML*

Or on the command line:

```powershell
Get-WinEvent -Path "C:\path\to\file.evtx" |
  Select-Object TimeCreated, Id, LevelDisplayName, ProviderName, Message |
  Export-Csv -Path "$env:USERPROFILE\Desktop\events.csv" -NoTypeInformation
```

The XML export gives you the full `<System>` block per event -- EventID, Level, TimeCreated, Provider, Computer -- plus all the `<EventData>` key-value pairs that carry the actual forensic detail.

---

## Format detection

The tool auto-detects format on drop using the first 600 bytes of the file:

- If the filename ends in `.xml` or the content opens with `<Events` or `<Event xmlns=` -- Event XML parser
- If the content contains `#Software: Microsoft Internet Information Services` or `#Fields:` -- IIS W3C parser
- Everything else -- plain text parser with regex level detection

No file extension guessing beyond `.xml`. A `.log` file gets sniffed by content.

---

## One thing I ran into

The initial version threw `illegal invocation` errors on every XML file. The cause was extracting `getAttribute` from a DOM element without binding `this`:

```javascript
// breaks -- getAttribute loses its context when detached like this
const rawTime = ((el || {}).getAttribute || (() => ''))('SystemTime');

// works
const rawTime = el ? el.getAttribute('SystemTime') : '';
```

It's a subtle JS gotcha. The fallback pattern `(el || {}).method` looks safe but the method is no longer bound to the element when you call it that way.

---

## Design decisions

**Client-side only.** No server, no upload endpoint, no third-party seeing your logs. This was non-negotiable -- these are production logs that may contain IP addresses, usernames, and authentication events.

**2,500 row render cap.** The DOM gets slow rendering thousands of rows. The cap applies to the table only -- export always writes the full filtered set regardless of how many rows that is.

**IIS field mapping is dynamic.** The `#Fields:` header line in W3C logs defines column order, and it can vary between IIS versions and configurations. The parser reads that header first and maps values positionally, so it handles any field layout without hardcoding.

---

The tool is at [/projects/log-analyzer](/projects/log-analyzer). If you run into a format it doesn't handle -- Windows Firewall logs, DHCP audit logs, Sysmon XML -- let me know.
