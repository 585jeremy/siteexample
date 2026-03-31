window.RULES_DATA = {
  updatedAt: "2026-03-31",
  sections: [
    {
      id: "preface",
      title: "Preface",
      content: [
        {
          type: "paragraph",
          text: "This is the complete rule page of SGCNR for FiveM."
        },
        {
          type: "paragraph",
          text: "These rules are written for a non-RP Cops and Robbers server with freeroam, PvP, gangs, police, EMS, robberies, rotating safe zones, and a rotating red zone system."
        },
        {
          type: "list",
          items: [
            "Not knowing the rules or being new does not excuse rulebreaking",
            "These rules apply in-game and in official SGCNR spaces such as Discord",
            "Staff interpret the rules and may act against bad-faith loopholes even if a situation is not written word-for-word",
            "Proof matters in reports and appeals, and the burden of proof is on the person making the claim",
            "If a server system allows something but it is clearly abusive or unfair, do not do it",
            "Rules may be updated over time, so check this page regularly instead of relying on old screenshots or downloaded copies"
          ]
        }
      ]
    },
    {
      id: "definitions",
      title: "Definitions",
      content: [
        {
          type: "table",
          columns: ["Term", "Definition"],
          rows: [
            ["Player", "a human-controlled character"],
            ["Friend", "a player you are reasonably allied with or actively helping"],
            ["Enemy", "a player whose objective or conduct is directly against yours"],
            ["Your property", "your money, vehicles, items, active objectives, and other server-owned possessions under your control"],
            ["Point of interest", "common shared locations such as stores, hospitals, police stations, mechanic areas, and other places where many players have a valid reason to be"],
            ["RDM", "attacking or killing another player without a valid rule-backed reason"],
            ["Revenge", "a limited right to retaliate after another player has seriously wronged you or your side"],
            ["KOS", "kill on sight status that is only valid when both sides have clearly agreed to it through the official server process"],
            ["Provocation", "clear and targeted behavior meant to antagonize, bait, or escalate a conflict"],
            ["Safe zone", "an active protected area where normal hostilities should not begin"],
            ["Red zone", "a rotating high-risk area where players should expect a higher chance of combat"],
            ["Police activity", "an arrest attempt, pursuit, shootout, stop, or other police action against crime"],
            ["Job abuse", "using a role, job tool, or job system in a way that breaks fairness or bypasses normal consequences"],
            ["Combat logging", "leaving the server to avoid a negative outcome that would otherwise happen in-game"]
          ]
        }
      ]
    },
    {
      id: "rule-1-community",
      title: "1. Community Conduct",
      rules: [
        {
          id: "1",
          title: "Respect players, staff, and community members",
          body: "Treat other players, staff, and community members with basic respect. Competitive banter is fine, but you are expected to keep it within reason.",
          explanation: "This server allows competition and trash talk, but not behavior that turns normal rivalry into a hostile environment.",
          tags: ["conduct", "community"]
        },
        {
          id: "1a",
          title: "No hate speech, real-life threats, or doxxing",
          body: "Hate speech, discrimination, slurs, real-life threats, doxxing, blackmail, or sharing personal information are not allowed under any circumstance.",
          explanation: "These behaviors go beyond normal rulebreaking and may lead to severe punishment immediately.",
          tags: ["conduct", "safety", "harassment"]
        },
        {
          id: "1b",
          title: "No targeted harassment or bullying",
          body: "Do not stalk, harass, mass-target, or repeatedly bully players across chat, voice, gameplay, or official community spaces.",
          explanation: "A single heated argument is one thing. A repeated pattern of chasing the same person to make their experience miserable is not allowed.",
          tags: ["conduct", "harassment"]
        },
        {
          id: "1c",
          title: "No staff impersonation or fake authority",
          body: "Do not claim to be staff, pretend to have staff powers, or threaten players with punishments you do not control.",
          explanation: "Fake authority creates confusion, scams, and abuse, so it is treated seriously.",
          tags: ["conduct", "staff", "integrity"]
        }
      ]
    },
    {
      id: "rule-2-chat-voice",
      title: "2. Chat, Voice, and Discord",
      rules: [
        {
          id: "2",
          title: "No spam or disruptive audio",
          body: "Do not spam chat, flood channels, command spam, mic spam, scream, earrape, or use soundboards and noises to disrupt others.",
          explanation: "Public channels should stay readable and voice should stay usable for normal play.",
          tags: ["chat", "voice", "conduct"]
        },
        {
          id: "2a",
          title: "No unrelated advertising",
          body: "Advertising unrelated servers, communities, stores, services, or invite links without permission is not allowed.",
          explanation: "A casual mention is different from promotion. Recruitment and repeated exposure count as advertising.",
          tags: ["chat", "discord", "conduct"]
        },
        {
          id: "2b",
          title: "No sexual or age-inappropriate conduct in public spaces",
          body: "Sexual harassment, explicit public sexual behavior, or age-inappropriate conduct in text or voice is not allowed.",
          explanation: "Keep public spaces safe and normal. If there is any doubt about age, act cautiously and avoid the subject entirely.",
          tags: ["conduct", "safety", "voice", "chat"]
        },
        {
          id: "2c",
          title: "Official Discord follows the same standards",
          body: "The same behavior standards apply in official Discord channels, tickets, and other community spaces as they do in-game.",
          explanation: "Players should not behave one way in-game and another way in official channels just because they left the server.",
          tags: ["discord", "conduct", "staff"]
        }
      ]
    },
    {
      id: "rule-3-staff",
      title: "3. Staff, Interpretation, and Common Sense",
      rules: [
        {
          id: "3",
          title: "Follow staff instructions during active situations",
          body: "If staff give you an instruction related to moderation, order, disruption, or a live incident, follow it first and dispute it later through the proper channel.",
          explanation: "Live moderation only works if the situation is stabilized first. Appeals exist for disagreements afterward.",
          tags: ["staff", "moderation"]
        },
        {
          id: "3a",
          title: "Do not lie to staff or submit fake evidence",
          body: "Do not knowingly lie to staff in reports, appeals, claims, or tickets. Do not submit edited, clipped, or misleading evidence as if it were complete proof.",
          explanation: "False reports and dishonest appeals waste staff time and can lead to unfair outcomes for other players.",
          tags: ["staff", "reports", "integrity"]
        },
        {
          id: "3b",
          title: "Rules are interpreted by staff",
          body: "Rules are to be interpreted by server staff and management in the most reasonable way for the server. Bad-faith rule lawyering is not protected.",
          explanation: "If a player is technically following the wording of a rule while clearly abusing the spirit of it, staff may still act.",
          tags: ["staff", "common-sense", "moderation"]
        }
      ]
    },
    {
      id: "rule-4-pvp",
      title: "4. PvP Direction and RDM",
      rules: [
        {
          id: "4",
          title: "PvP is allowed, but it is not the whole point of the server",
          body: "PvP is allowed on SGCNR, but the server is not meant to be nonstop random deathmatch. PvP should come from gameplay, objectives, conflict, and situations.",
          explanation: "Robberies, gangs, police, EMS, freeroam, and competition all matter here. Constantly forcing gunfights into every situation is against the server's direction.",
          tags: ["pvp", "combat"]
        },
        {
          id: "4a",
          title: "No random deathmatch",
          body: "Attacking or killing another player without a valid reason is RDM and is not allowed.",
          explanation: "If you cannot clearly explain why your attack was justified under the rules, it will usually be treated as RDM.",
          tags: ["pvp", "combat", "rdm"]
        },
        {
          id: "4b",
          title: "Valid reasons to fight or kill",
          body: "Valid reasons can include self-defense, defense of friends, defense of your property, active robbery conflict, theft, pickpocketing, serious provocation, revenge, police activity, or direct interference in an active conflict.",
          explanation: "The reason must be real, recent, and understandable to a normal player reviewing the situation afterward.",
          tags: ["pvp", "combat", "rdm"]
        },
        {
          id: "4c",
          title: "Minor trash talk is not always enough",
          body: "Minor trash talk or generic insults alone may not be enough to justify killing someone. Staff may judge the difference between serious provocation and players forcing excuses to kill.",
          explanation: "The more targeted and deliberate the provocation is, the stronger the case. Normal heated chat in a busy area does not automatically become a free kill.",
          tags: ["pvp", "combat", "provocation"]
        }
      ]
    },
    {
      id: "rule-5-revenge-kos",
      title: "5. Revenge, KOS, and Provocation",
      rules: [
        {
          id: "5",
          title: "Revenge is allowed in valid situations",
          body: "Being attacked, killed, robbed, seriously provoked, or having your property stolen or damaged can give you a right of revenge against the responsible player or players.",
          explanation: "Revenge exists so players can settle serious conflicts without everything being forced into instant self-defense only.",
          tags: ["combat", "revenge"]
        },
        {
          id: "5a",
          title: "Revenge is limited and cannot be dragged forever",
          body: "Once you have already taken your revenge for a specific incident, you may not keep using that same old reason to attack again and again. If the conflict is clearly over, later attacks may be treated as fresh RDM.",
          explanation: "Revenge is not a permanent pass to keep farming someone hours later for the same original problem.",
          tags: ["combat", "revenge", "rdm"]
        },
        {
          id: "5b",
          title: "KOS requires mutual agreement through Discord",
          body: "KOS is only valid when a Discord forum post has been opened and both sides have clearly agreed to it. If there is no agreed KOS post, normal RDM and revenge rules apply.",
          explanation: "KOS is a special agreement, not a default server state.",
          tags: ["combat", "kos", "discord"]
        },
        {
          id: "5c",
          title: "Provocation can justify escalation, but not abuse",
          body: "Provoking someone can create a valid conflict, but players may not bait others on purpose just to farm clips or manufacture a reason to kill.",
          explanation: "If a staff review shows the entire situation was forced by one side for an excuse, that can still be punished.",
          tags: ["combat", "provocation", "abuse"]
        }
      ]
    },
    {
      id: "rule-6-objectives-zones",
      title: "6. Robberies, Safe Zones, and Red Zones",
      rules: [
        {
          id: "6",
          title: "Robberies may be contested and taken over",
          body: "If you start a robbery, other players may contest it. If they kill you fairly during that robbery, they may take the robbery over.",
          explanation: "Robberies are meant to create conflict and opportunity, not guaranteed safe income.",
          tags: ["robbery", "pvp", "objectives"]
        },
        {
          id: "6a",
          title: "Joining or interfering with robberies can create valid conflict",
          body: "Joining a robbery, contesting a robbery, stealing a robbery, or interfering with the players currently doing it can create valid PvP.",
          explanation: "If your actions directly affect another player's payout, objective, or survival in an active robbery, expect resistance.",
          tags: ["robbery", "combat", "objectives"]
        },
        {
          id: "6b",
          title: "Safe zones protect players from starting hostilities",
          body: "Multiple safe zones may be active at the same time, and they rotate around the map. Players should not be killed, robbed, or openly attacked inside active safe zones.",
          explanation: "Safe zones exist to reduce chaos and give players room to breathe, not to erase every conflict on the server.",
          tags: ["safe-zone", "combat", "map"]
        },
        {
          id: "6c",
          title: "No safe zone abuse",
          body: "You may not provoke someone, create a valid revenge situation, start a conflict, or commit hostile actions and then instantly hide inside a safe zone just to avoid the consequences.",
          explanation: "Safe zones are not a reset button. If a player already has a valid reason on you, abusing zone protection may still get you punished.",
          tags: ["safe-zone", "abuse", "combat"]
        },
        {
          id: "6d",
          title: "One red zone rotates every 15 minutes",
          body: "One red zone rotates every 15 minutes. Red zones are higher-risk areas where players should expect a much higher chance of combat.",
          explanation: "Red zones loosen expectations around danger, but they do not remove every other rule on the server.",
          tags: ["red-zone", "combat", "map"]
        },
        {
          id: "6e",
          title: "Basic rules still apply inside red zones",
          body: "Cheating, exploiting, griefing, staff disrespect, and other obvious rulebreaking are still not allowed inside red zones.",
          explanation: "Higher-risk combat does not mean a complete rule vacuum.",
          tags: ["red-zone", "cheating", "conduct"]
        }
      ]
    },
    {
      id: "rule-7-jobs-groups",
      title: "7. Jobs, Gangs, and Group Conduct",
      rules: [
        {
          id: "7",
          title: "There is no fixed group limit, but numbers may not be abused",
          body: "There is currently no hard group limit. Gangs, crews, and temporary alliances are allowed, but they may not be used purely to grief, overwhelm, or repeatedly ruin the experience for others.",
          explanation: "Large numbers are part of open CnR gameplay, but zerging every situation just because you can is still punishable if it becomes abusive.",
          tags: ["gangs", "groups", "fairplay"]
        },
        {
          id: "7a",
          title: "Jobs must be used fairly",
          body: "Police, EMS, and other jobs must be used fairly. Do not abuse job tools, vehicles, systems, or role-specific powers to troll, farm, or bypass normal consequences.",
          explanation: "A job is part of the server's gameplay structure, not a loophole to protect friends or create one-sided advantages.",
          tags: ["jobs", "fairplay", "abuse"]
        },
        {
          id: "7b",
          title: "Police must act within their role",
          body: "Police may use force based on the situation, but may not randomly hunt, collude, or ignore their role rules just to join fights for fun.",
          explanation: "Police are part of server balance. When they act outside that role, ordinary combat often turns into unfair job abuse.",
          tags: ["police", "jobs", "combat"]
        },
        {
          id: "7c",
          title: "EMS are support, not a combat loophole",
          body: "EMS may defend themselves and do their job, but should not act like an extra gang or extra police unit. Using EMS as a combat loophole is not allowed.",
          explanation: "Revives and medical support are meant to support gameplay, not to create permanent unfair backup in every fight.",
          tags: ["ems", "jobs", "combat"]
        },
        {
          id: "7d",
          title: "No unfair cross-teaming between opposing sides",
          body: "Players may not use cops, medics, civilians, or other roles to unfairly protect, transport, hide, revive, or assist an opposing side in ways that bypass normal combat and arrest outcomes.",
          explanation: "If the support would clearly change the outcome of a fight or arrest unfairly, staff may treat it as cross-teaming or job abuse.",
          tags: ["jobs", "cross-teaming", "fairplay"]
        }
      ]
    },
    {
      id: "rule-8-vehicles-spawns",
      title: "8. Vehicles, Chases, and Repeated Targeting",
      rules: [
        {
          id: "8",
          title: "Vehicle combat is partly allowed, but pure grief VDM is not",
          body: "Vehicle combat is partly allowed, but using vehicles only to roadkill, ram nonstop, or wipe players for no real gameplay reason is not allowed.",
          explanation: "Conflict-related vehicle use is one thing. Mindless vehicle grief with no actual objective is another.",
          tags: ["vehicles", "combat", "vdm"]
        },
        {
          id: "8a",
          title: "Chases, pressure, and interference can create conflict",
          body: "Aggressive driving, chase pressure, interfering with another player's robbery, vehicle, towing, or impound situation can create valid conflict depending on context.",
          explanation: "If you insert yourself into an active vehicle-based objective, you should expect the situation to escalate.",
          tags: ["vehicles", "chases", "objectives"]
        },
        {
          id: "8b",
          title: "No spawn killing or unfair farming",
          body: "Do not repeatedly kill players who have little or no fair chance to respond, especially around fresh spawns, protected states, or obvious reset moments.",
          explanation: "Winning a fight is allowed. Farming players who cannot reasonably re-enter the fight is not.",
          tags: ["spawnkill", "combat", "fairplay"]
        },
        {
          id: "8c",
          title: "Objective camping may be valid, harassment camping is not",
          body: "Camping robbery routes, contested areas, or travel paths for a real gameplay reason can be valid. Repeatedly camping the same player or group only to frustrate them may be treated as harassment or griefing.",
          explanation: "Intent and context matter. Holding a useful position is different from making one player your entire activity for the night.",
          tags: ["camping", "combat", "objectives"]
        }
      ]
    },
    {
      id: "rule-9-integrity",
      title: "9. Cheating, Exploiting, Combat Logging, and Ban Evasion",
      rules: [
        {
          id: "9",
          title: "No cheating or unfair external tools",
          body: "Cheats, injected menus, spoofers, wallhacks, unfair macros, abuse tools, or any external modification that gives an unfair advantage are not allowed.",
          explanation: "If a tool makes you stronger, harder to catch, better informed, or harder to detect than normal players, expect it to be treated as cheating.",
          tags: ["cheating", "integrity", "fairplay"]
        },
        {
          id: "9a",
          title: "No exploiting bugs, glitches, or loopholes",
          body: "Exploiting bugs, script issues, broken systems, money loopholes, physics glitches, or unintended outcomes for advantage is not allowed.",
          explanation: "If it is obviously not working the way it was meant to, do not use it to gain money, safety, kills, escapes, or position.",
          tags: ["exploiting", "integrity", "fairplay"]
        },
        {
          id: "9b",
          title: "No combat logging or disconnecting to avoid consequences",
          body: "Leaving the server to avoid death, arrest, punishment, robbery loss, medical fees, or any other unwanted outcome is not allowed.",
          explanation: "If the negative result would have happened while you stayed online, disconnecting to dodge it is combat logging.",
          tags: ["combat-logging", "integrity", "fairplay"]
        },
        {
          id: "9c",
          title: "No ban evasion or alt abuse",
          body: "Ban evasion, alt abuse, using another account to avoid punishment, or using accounts to hide identity or gain unfair advantages is not allowed.",
          explanation: "The server moderates players, not just account names. Avoiding action through extra accounts is treated seriously.",
          tags: ["ban-evasion", "accounts", "integrity"]
        }
      ]
    },
    {
      id: "rule-10-economy",
      title: "10. Economy, Trading, and Property",
      rules: [
        {
          id: "10",
          title: "Property and losses through normal gameplay are valid",
          body: "Your money, items, vehicles, and active objectives count as your property. Losing them through normal robberies, takeovers, arrests, or valid gameplay systems is part of the server.",
          explanation: "Not every loss is a rulebreak. If the system and the situation were valid, the loss is usually part of normal CnR gameplay.",
          tags: ["economy", "property", "gameplay"]
        },
        {
          id: "10a",
          title: "No duplication, laundering, or economy abuse",
          body: "Do not abuse duplication methods, alt laundering, fake trades, loopholes, or market systems for unfair economic gain.",
          explanation: "If money or items are created or moved through dishonest methods, staff may remove them even in addition to other punishment.",
          tags: ["economy", "integrity", "trading"]
        },
        {
          id: "10b",
          title: "Do not scam agreed trades",
          body: "If you agree to an item or money trade with another player, you must complete the deal as agreed or fully return what you received. Trade scams are not allowed.",
          explanation: "Server economies only work when players can trust direct deals. Keep proof of your agreement in case something goes wrong.",
          tags: ["economy", "scamming", "trading"]
        },
        {
          id: "10c",
          title: "No real-money trading or account sales",
          body: "Trading in-game money, items, services, or accounts for real-world money or outside value is not allowed unless server management explicitly announces an exception.",
          explanation: "RMT harms the economy, encourages fraud, and creates unfair shortcuts outside the game.",
          tags: ["economy", "rmt", "accounts"]
        }
      ]
    },
    {
      id: "rule-11-reports",
      title: "11. Reports, Evidence, and Punishments",
      rules: [
        {
          id: "11",
          title: "Use proper report channels",
          body: "If you need to report a player, use the proper in-game or Discord report channels rather than dragging the situation through public chat.",
          explanation: "Reports are easier to review fairly when they are submitted through the right place with actual evidence.",
          tags: ["reports", "discord", "staff"]
        },
        {
          id: "11a",
          title: "Do not over-report, fake-report, or bait for clips",
          body: "Do not spam reports, submit revenge reports in bad faith, or intentionally bait someone just to produce a clip for staff.",
          explanation: "A clean report helps staff. Manufactured drama and low-quality spam do the opposite.",
          tags: ["reports", "integrity", "staff"]
        },
        {
          id: "11b",
          title: "Evidence should be clear and complete",
          body: "If you report another player, you should have enough proof to support your claim. Clips, screenshots, and context matter, especially in PvP-related reports.",
          explanation: "The stronger your evidence, the easier it is for staff to make a fair decision.",
          tags: ["reports", "evidence", "staff"]
        },
        {
          id: "11c",
          title: "Punishments depend on severity and history",
          body: "Punishments may include warnings, mutes, fines, job bans, temporary bans, and permanent bans depending on severity, history, intent, and repeat behavior.",
          explanation: "Not every offense is treated the same. Repeated bad conduct and obvious bad faith usually lead to harsher action.",
          tags: ["punishments", "staff", "moderation"]
        },
        {
          id: "11d",
          title: "Final rule",
          body: "If a player follows the exact wording of a rule while clearly abusing the spirit of the server, staff may still act.",
          explanation: "This exists to stop loophole play and bad-faith technical compliance.",
          tags: ["common-sense", "staff", "moderation"]
        }
      ]
    }
  ]
};
