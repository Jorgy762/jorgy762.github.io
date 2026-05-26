---
layout: post
title: "The Grey Zone Is Not a Metaphor"
date: 2026-05-25
tags: [cybersecurity, hybrid-warfare, military, corporate-security, geopolitics, canada]
excerpt: "We are already in an active conflict with peer and near-peer adversaries. It does not look like what the movies told us war looks like. Here is why that matters to every sysadmin, MP, and security professional in Canada."
---

We are already at war.

Not in the way that triggers Article 5. Not with uniformed soldiers crossing recognized borders -- at least not yet. What we are in right now is a sustained, multi-domain conflict being waged below the threshold of conventional armed conflict by state actors who have calculated, correctly, that ambiguity is a strategic weapon.

This is the grey zone. And it is not a metaphor.

I want to write this series for two audiences: the corporate security professional who has never worn a uniform, and the military member who has never thought about their job in terms of NIST frameworks or threat modeling. Both of you are operating in the same environment, facing the same adversaries, using different language to describe identical problems. That gap costs us. This series is about closing it.

## What the Grey Zone Actually Means

The concept is not new. The term gets tossed around in think-tank papers and NATO briefings, but the underlying activity -- operations designed to coerce, destabilize, and undermine a target state without triggering a formal military response -- is older than the internet. Soviet dezinformatsiya campaigns during the Cold War were grey zone operations. KGB active measures targeting Western institutions were grey zone operations.

What has changed is the scale, the speed, and the attack surface.

NATO's own framework describes hybrid threats as activities that are "deliberately designed to avoid attribution and to remain below the threshold of formally declared warfare." The deliberate avoidance of attribution is the point. When a Russian GRU unit deploys destructive malware against Ukrainian infrastructure that then spreads globally, causing over ten billion dollars in damage to multinational corporations, that is not an accident of poor target selection. The deniability is the feature.

The Canadian Centre for Cyber Security (CCCS) laid this out plainly in the National Cyber Threat Assessment 2023-2024: state-sponsored actors are the number one strategic cyber threat to Canada. Not criminal ransomware groups, not hacktivists. Nation-states. And they are not waiting for a declaration of war to start.

## The Two Actors You Need to Understand

**Russia** operates with urgency and disruption as primary objectives. APT28, also known as Fancy Bear, linked to Russian military intelligence (GRU), has conducted operations against NATO member states including Canada for years. GRU Unit 74455, known publicly as Sandworm, executed the NotPetya attack in 2017 -- initially a Ukraine-targeted operation that went global, hitting shipping companies, pharmaceutical manufacturers, and critical infrastructure operators worldwide. The UK's National Cyber Security Centre, along with Canada's Communications Security Establishment (CSE), formally attributed NotPetya to Russian military intelligence. The playbook is: deny, disrupt, demoralize.

**China** plays a longer game. Where Russian operations tend toward disruption and noise, Chinese state-sponsored activity is often patient, quiet, and positioned for future use. Volt Typhoon, attributed by CISA, the NSA, and Canada's CSE in a joint advisory in early 2024, represents something particularly alarming: pre-positioning inside Western critical infrastructure with no immediate intent to act. They are not stealing data or causing outages. They are installing themselves and waiting. The Canadian Security Intelligence Service (CSIS) also documented in its 2023 annual report that Chinese state actors conducted foreign interference operations against Canadian federal elections and targeted Canadian political figures, researchers, and diaspora communities.

Both actors operate simultaneously across cyber, information, economic, and physical domains. That is the key to understanding hybrid warfare -- it is not a sequence of phases, it is a continuous, overlapping campaign across all available vectors.

## Why This Is Your Problem Too

If you work in corporate IT security, you might be thinking this sounds like a government problem. It is not. The vast majority of Canada's critical infrastructure -- energy, telecommunications, financial systems, transportation -- is privately owned and operated. Public Safety Canada's National Strategy for Critical Infrastructure identifies ten sectors. Most of them are run by companies with security teams that look like yours.

Supply chain compromise is the preferred corporate entry point. SolarWinds in 2020. 3CX in 2023. These were not attacks on governments -- they were attacks through trusted software vendors to reach government and corporate networks simultaneously. If your organization has third-party software vendors, managed service providers, or cloud dependencies, you are already inside someone's threat model.

If you wear a Canadian Armed Forces uniform part-time, you might be thinking this is an Active Force problem or a CSIS problem. It is not. Reservists present a unique intelligence collection opportunity for adversaries. You have security clearances, access to restricted areas and information, and you live your civilian life -- with a personal phone, social media accounts, and home network -- largely outside the security envelope of your unit. Your LinkedIn profile, your Facebook check-in at the armoury, your Instagram photo near a restricted area: these are data points. Aggregated, they are intelligence. CSIS has documented foreign interference efforts targeting CAF members specifically.

## The Framework Problem

Here is something that frustrates me about how these two communities operate: the military has robust doctrinal frameworks for threat assessment, layered defence, and incident response. Corporate security has robust compliance and risk management frameworks. They describe the same problems with almost zero shared vocabulary.

A corporate security analyst talks about the NIST Cybersecurity Framework functions -- Identify, Protect, Detect, Respond, Recover. A military intelligence officer talks about Intelligence Preparation of the Battlefield, threat actor capabilities, likely courses of action. These are the same analytical process. The language is different. The logic is identical.

NATO's Strategic Concept 2022 explicitly named cyber as a domain of warfare and hybrid threats as a core security challenge for the alliance. Canada is a NATO member. Canada is also a Five Eyes partner. CSE and CCCS publish threat bulletins and advisories that corporate security teams rarely read, and military units almost never see.

Closing that gap -- between doctrine and framework, between corporate and military security culture, between the analyst who thinks in ATT&CK matrices and the MP who thinks in threat assessments and force protection -- is the whole point of this series.

## The Bottom Line

The grey zone is active right now. It was active before you read this post and it will be active after. Russia and China are not preparing for a future conflict with Canada and its allies -- they are conducting one. The threshold question is not whether conflict is happening, it is whether it will turn kinetic.

Your job, whether you manage endpoints for a mid-size enterprise or you run perimeter security at a Canadian Forces installation, sits inside that conflict. The frameworks exist to help you organize your response. The doctrine exists to help you understand the adversary. Neither is enough on its own.

That is why both worlds need to learn each other's language.

---

**Next in the series:** Threat Actors Are Not Hackers in Hoodies -- a deep dive into Russian and Chinese TTPs mapped against MITRE ATT&CK and what they mean for both corporate and military targets.

---

**References and Further Reading**

- Canadian Centre for Cyber Security. *National Cyber Threat Assessment 2023-2024*. [cyber.gc.ca](https://www.cyber.gc.ca/en/guidance/national-cyber-threat-assessment-2023-2024)
- Communications Security Establishment Canada. *Cyber Threat Bulletins and Advisories*. [cse-cst.gc.ca](https://www.cse-cst.gc.ca/en/information-and-tools/advisories)
- Canadian Security Intelligence Service. *2023 Public Report*. [canada.ca](https://www.canada.ca/en/security-intelligence-service/corporate/publications/2023-public-report.html)
- CISA, NSA, FBI, and partner agencies including CSE. *Volt Typhoon Advisory AA24-038A*, February 2024. [cisa.gov](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a)
- NATO. *NATO 2022 Strategic Concept*. [nato.int](https://www.nato.int/cps/en/natohq/topics_210907.htm)
- National Institute of Standards and Technology. *Cybersecurity Framework 2.0*, February 2024. [nist.gov](https://www.nist.gov/cyberframework)
- Public Safety Canada. *National Strategy for Critical Infrastructure*. [publicsafety.gc.ca](https://www.publicsafety.gc.ca/cnt/rsrcs/pblctns/srtg-crtcl-nfrstrctr/index-en.aspx)
- UK National Cyber Security Centre. *Russian GRU Cyber Attacks Attribution*, October 2018. [ncsc.gov.uk](https://www.ncsc.gov.uk/news/reckless-campaign-cyber-attacks-russian-military-intelligence-service)
