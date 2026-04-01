window.WIKI_DATA = {
  updatedAt: "2026-04-01",
  categories: [
    { id: "basics", title: "Getting Started", pages: ["introduction"] },
    { id: "emergency", title: "Response Roles", pages: ["police-officer", "paramedic"] },
    { id: "civilian", title: "City Jobs", pages: ["civilian", "mechanic", "drug-dealer", "delivery-driver", "hitman", "doctor", "arms-dealer"] },
    { id: "gameplay", title: "Systems & Utility", pages: ["wanted-level-system", "appearance", "stores", "personal-vehicles", "party-system", "crews-memberships", "phone", "economy"] },
    { id: "criminal", title: "Illegal Operations", pages: ["robberies", "atm-hacking", "pickpocket", "vehicle-export", "vehicle-scrap"] },
    { id: "properties", title: "Storage & Ownership", pages: ["garages", "warehouses"] },
    { id: "misc", title: "Support & Tools", pages: ["help-center", "other-settings", "website-api"] }
  ],
  pages: {
    introduction: {
      title: "Operations Manual",
      navLabel: "Manual",
      eyebrow: "SGCNR handbook",
      summary: "The SGCNR operations manual is the central reference for roles, systems, illegal routes, and support tools. It is written to get new players settled faster and give regulars a cleaner place to check mechanics as the server changes.",
      facts: [
        ["Purpose", "Operations reference"],
        ["Focus", "Jobs, systems, and progression"],
        ["Audience", "New and returning players"],
        ["Style", "Practical and fast to scan"]
      ],
      overviewCards: [
        { title: "Emergency Roles", text: "Police and medical pages focus on response flow, priorities, and how those roles fit into the wider city loop." },
        { title: "Civilian Jobs", text: "Legal and mixed jobs explain how players earn money, build progression, and branch into more specialized paths." },
        { title: "Gameplay Systems", text: "These pages cover wanted levels, appearance, parties, phones, economy, and the quality-of-life systems around them." },
        { title: "Criminal Activities", text: "Illegal routes such as robberies, hacking, pickpocketing, export, and scrap each have their own flow and risk profile." },
        { title: "Properties", text: "Garages and warehouses hold the progression side of vehicles, storage, and long-term organization." },
        { title: "Help & Tools", text: "Support pages, settings, and the website API section keep the handbook practical instead of turning it into filler." }
      ],
      updates: [
        "The wiki is grouped by how players actually move through the server, not by random isolated pages.",
        "Core systems and activity pages are separated more clearly so progression is easier to understand.",
        "The introduction page now acts as a real front door to the handbook instead of a placeholder.",
        "New systems can be added later without rewriting the whole navigation structure."
      ],
      sections: [
        {
          title: "How to use this wiki",
          paragraphs: [
            "If you are new, start with the pages that match what you want to do first: joining the server, finding a job, learning how wanted levels work, or understanding the map and support systems.",
            "If you already play regularly, use the category navigation to jump straight to the system or role you need. The goal is to reduce guesswork and keep the handbook useful during live updates."
          ],
          bullets: [
            "Start with the role you plan to play most.",
            "Use gameplay pages when a mechanic applies across multiple jobs.",
            "Use criminal pages when you want the objective loop for illegal activities.",
            "Use help and settings pages when the issue is technical or quality-of-life related."
          ]
        },
        {
          title: "What this wiki is for",
          paragraphs: [
            "This handbook is designed to explain how the server works at a practical level. It is not a replacement for the rules page, but it supports the rules by helping players understand the systems they are interacting with."
          ],
          bullets: [
            "Jobs and role flow",
            "Progression and economy",
            "Core gameplay systems",
            "Criminal activities and support pages"
          ]
        }
      ]
    },
    "police-officer": {
      title: "Police Officer",
      navLabel: "Police Officer",
      eyebrow: "Emergency role",
      summary: "Police is the law-enforcement side of the city loop. The role focuses on patrol, response, traffic presence, suspect pressure, and arresting criminals without turning every situation into chaos.",
      facts: [["Type", "Emergency"], ["Risk", "High"], ["Main goal", "Control criminals"], ["Pairs with", "Wanted system"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Police officers are the main pressure against crime. Good police play is not just about chasing every target on sight. It is about controlling situations, responding to crime scenes, and keeping enough structure in the city that criminal players still have to think before acting."
          ],
          bullets: [
            "Respond to active crimes and player calls.",
            "Patrol areas with frequent criminal activity.",
            "Coordinate with other units instead of acting alone all the time.",
            "Use arrests and pressure as the core win condition."
          ]
        },
        {
          title: "Good habits",
          bullets: [
            "Stay aware of wanted levels and active objective zones.",
            "Do not tunnel on one suspect while ignoring the rest of the city.",
            "Keep vehicles and positioning under control before forcing risky pushes.",
            "Communicate clearly so multiple units are not doing the same job badly."
          ]
        }
      ]
    },
    paramedic: {
      title: "Paramedic",
      navLabel: "Paramedic",
      eyebrow: "Emergency role",
      summary: "Paramedics keep players moving by reviving, healing, and reducing downtime. The role works best when it reads the scene well and knows when to help, when to wait, and when to reposition.",
      facts: [["Type", "Emergency"], ["Risk", "Medium"], ["Main goal", "Heal and revive"], ["Best for", "Support-minded players"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Medical gameplay is about response and timing. A good medic keeps players alive without blindly stepping into every dangerous scene, and helps restore flow after fights, crashes, or chaotic city events."
          ],
          bullets: [
            "Heal injured players quickly.",
            "Revive downed players when the situation allows it.",
            "Work around active danger instead of feeding into it.",
            "Support the wider city rather than only one friend group."
          ]
        },
        {
          title: "Scene discipline",
          bullets: [
            "Read the area before committing to a revive.",
            "Use safe positioning when multiple parties are still active.",
            "Do not treat every scene like it is automatically secure.",
            "Remember that your value comes from keeping others moving, not from gambling revives."
          ]
        }
      ]
    },
    civilian: {
      title: "Civilian",
      navLabel: "Civilian",
      eyebrow: "Civilian role",
      summary: "Civilian is the baseline free-roam path and often the first role players understand. It covers everyday movement through the city, legal opportunities, and the transition into more specialized jobs or criminal play.",
      facts: [["Type", "Civilian"], ["Risk", "Low to medium"], ["Main goal", "Flexible progression"], ["Best for", "General gameplay"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Civilian is where players learn the map, vehicles, city services, and general pacing of the server. It is flexible on purpose and acts as the foundation for moving into other activities later."
          ],
          bullets: [
            "Explore the city and learn key locations.",
            "Build money through legal systems or transition into illegal activity.",
            "Use civilian time to learn movement, routes, and server rhythm."
          ]
        },
        {
          title: "What makes it useful",
          bullets: [
            "Low-pressure way to learn the server.",
            "Flexible enough for social play or progression-focused sessions.",
            "Pairs naturally with vehicles, economy, and appearance systems."
          ]
        }
      ]
    },
    mechanic: {
      title: "Mechanic",
      navLabel: "Mechanic",
      eyebrow: "Civilian role",
      summary: "Mechanic is the service role built around vehicle recovery, support, and customization access. It works well for players who like moving around the city and helping other players through vehicle-focused gameplay.",
      facts: [["Type", "Civilian"], ["Risk", "Low"], ["Main goal", "Vehicle support"], ["Best for", "Service play"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Mechanics turn vehicle knowledge into progression. The role usually revolves around helping other players, recovering or impounding vehicles, and taking part in the customization side of the city."
          ],
          bullets: [
            "Respond to vehicle-related service needs.",
            "Support other players through recovery and maintenance loops.",
            "Learn the layout of the city through constant movement."
          ]
        },
        {
          title: "Where mechanics matter",
          bullets: [
            "Busy city routes with frequent crashes or abandoned vehicles.",
            "Player hubs where customization and service demand overlap.",
            "Sessions where legal utility work is safer than crime."
          ]
        }
      ]
    },
    "drug-dealer": {
      title: "Drug Dealer",
      navLabel: "Drug Dealer",
      eyebrow: "Civilian role",
      summary: "Drug dealing is a criminal-leaning money route based on supply, movement, and risk. It rewards players who know where to work, when to disappear, and how to avoid drawing unnecessary police pressure.",
      facts: [["Type", "Civilian / illegal"], ["Risk", "Medium"], ["Main goal", "Sell contraband"], ["Best for", "Steady illegal income"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Drug dealing sits between free-roam and high-pressure crime. It is not as loud as a full robbery loop, but it still creates exposure if players become careless or too predictable."
          ],
          bullets: [
            "Move product efficiently.",
            "Avoid obvious routes when police pressure is high.",
            "Treat location choice and timing as part of the job."
          ]
        },
        {
          title: "Practical mindset",
          bullets: [
            "Do not stay in one selling spot forever.",
            "Watch city heat before expanding activity.",
            "Use lower-pressure sessions to build up faster."
          ]
        }
      ]
    },
    "delivery-driver": {
      title: "Delivery Driver",
      navLabel: "Delivery Driver",
      eyebrow: "Civilian role",
      summary: "Delivery Driver is a legal route built around moving goods across the city. It is a strong job for players who want a simple objective loop, route learning, and stable progression without constant combat pressure.",
      facts: [["Type", "Civilian"], ["Risk", "Low"], ["Main goal", "Timed deliveries"], ["Best for", "Reliable money"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "The delivery loop rewards clean movement and route familiarity. It is especially useful early on because it teaches the road network while still giving players a clear and repeatable objective."
          ],
          bullets: [
            "Take jobs and complete deliveries quickly.",
            "Protect the vehicle and avoid unnecessary delays.",
            "Learn faster routes as you repeat the job."
          ]
        },
        {
          title: "Efficiency tips",
          bullets: [
            "Treat traffic and cornering as time management.",
            "Plan around dense city zones before the route gets messy.",
            "Use this job to build map knowledge that pays off in every other role."
          ]
        }
      ]
    },
    hitman: {
      title: "Hitman",
      navLabel: "Hitman",
      eyebrow: "Civilian role",
      summary: "Hitman is a contract-focused role built around hunting marked targets. It works best for players who can stay patient, track movement, and turn one clean elimination into a controlled payout.",
      facts: [["Type", "Civilian / contract"], ["Risk", "Medium to high"], ["Main goal", "Complete hits"], ["Best for", "Target hunting"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Hitman is not random violence. The job is strongest when the player chooses moments carefully and treats target movement, escape paths, and city pressure as part of the contract loop."
          ],
          bullets: [
            "Track marked targets rather than sprinting in blindly.",
            "Use patience and route prediction to close distance.",
            "Avoid forcing a contract into a bad fight."
          ]
        },
        {
          title: "Good discipline",
          bullets: [
            "Work the contract, not your ego.",
            "Do not become predictable once your target notices you.",
            "If the server uses a revenge or contract system, respect its boundaries."
          ]
        }
      ]
    },
    doctor: {
      title: "Doctor",
      navLabel: "Doctor",
      eyebrow: "Civilian role",
      summary: "Doctor is the civilian medical route that focuses more on treatment, supplies, and player-facing support than emergency scene response alone. It suits players who enjoy utility gameplay with a medical angle.",
      facts: [["Type", "Civilian support"], ["Risk", "Low to medium"], ["Main goal", "Medical utility"], ["Best for", "Support economy"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Doctor gameplay usually sits between economy and support. It is about helping players recover, handling medical services, and building progression through useful interaction rather than raw combat."
          ],
          bullets: [
            "Provide treatment and support items.",
            "Use player demand to build reliable income.",
            "Pair the job with city knowledge and steady movement."
          ]
        },
        {
          title: "Why it matters",
          bullets: [
            "It adds support value outside direct emergency response.",
            "It gives players a lower-chaos way to contribute to the city.",
            "It fits well for players who like economy and utility loops."
          ]
        }
      ]
    },
    "arms-dealer": {
      title: "Arms Dealer",
      navLabel: "Arms Dealer",
      eyebrow: "Civilian role",
      summary: "Arms Dealer is a higher-risk supplier role focused on weapons, ammo, and preparation. It rewards players who understand demand, danger, and how to work around police attention.",
      facts: [["Type", "Civilian / illegal"], ["Risk", "High"], ["Main goal", "Supply gear"], ["Best for", "Late-stage illegal support"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "The arms loop is about supplying value before the fight even starts. Good dealers understand where demand comes from and how much risk they can absorb while moving gear through the city."
          ],
          bullets: [
            "Move and distribute weapons or combat supplies.",
            "Think in terms of routes and exposure, not only sales.",
            "Treat law-enforcement pressure as part of the job."
          ]
        },
        {
          title: "Risk profile",
          bullets: [
            "Expect stronger police interest around known deal zones.",
            "Treat inventory and timing as the difference between profit and loss.",
            "Bad positioning can collapse a good deal very quickly."
          ]
        }
      ]
    },
    "wanted-level-system": {
      title: "Wanted Level System",
      navLabel: "Wanted Level",
      eyebrow: "Gameplay",
      summary: "The wanted system is the pressure engine that links crime to police response. Understanding how heat rises, what keeps it active, and how it shapes movement is one of the most important parts of the server.",
      facts: [["Type", "Gameplay system"], ["Affects", "Police and criminals"], ["Main goal", "Crime pressure"], ["Best for", "Decision-making"]],
      sections: [
        {
          title: "Why it matters",
          paragraphs: [
            "Wanted levels tell criminals how exposed they are and tell police how much attention a target deserves. That makes the system one of the core links between legal and illegal gameplay."
          ],
          bullets: [
            "Higher heat means more pressure and less room for mistakes.",
            "Wanted levels shape chase decisions, hiding, and target priority.",
            "Reading heat correctly changes how you move through the city."
          ]
        },
        {
          title: "How to play around it",
          bullets: [
            "Do not commit to loud crime if you have no exit plan.",
            "Use city geography and timing to reduce exposure.",
            "Police players should balance hot targets against the rest of the city."
          ]
        }
      ]
    },
    appearance: {
      title: "Appearance",
      navLabel: "Appearance",
      eyebrow: "Gameplay",
      summary: "Appearance covers the wardrobe, uniforms, accessories, and identity systems that let players shape how they look. It matters more than cosmetics alone because it also affects recognition, role identity, and crew presence.",
      facts: [["Type", "Gameplay system"], ["Main goal", "Character identity"], ["Best for", "Personalization"], ["Touches", "Jobs and crews"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Appearance systems usually include civilian clothing, job uniforms, crew outfits, and accessories. The point is not just to look good, but to make characters feel distinct and readable inside the city."
          ],
          bullets: [
            "Build a civilian look that feels like your own.",
            "Use job uniforms when you want clearer role identity.",
            "Treat wardrobe tools as part of the server experience, not just cosmetics."
          ]
        },
        {
          title: "Where it matters",
          bullets: [
            "Job recognition and clean role presentation.",
            "Crew identity and shared style.",
            "Personal progression and immersion."
          ]
        }
      ]
    },
    stores: {
      title: "Stores",
      navLabel: "Stores",
      eyebrow: "Gameplay",
      summary: "Stores are the utility layer of the city. They support clothing, supplies, gear, and general progression, and they become more important as players learn what each route actually needs.",
      facts: [["Type", "Gameplay system"], ["Main goal", "Buy essentials"], ["Best for", "Preparation"], ["Touches", "Every role"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Store systems matter because they connect money to actual progression. Whether you are preparing for legal work, utility play, or criminal activity, the right purchases change how effective you are."
          ],
          bullets: [
            "Use stores to prepare instead of improvising every session.",
            "Learn which locations matter for your favorite role.",
            "Treat supply runs as part of the gameplay loop."
          ]
        },
        {
          title: "Good habits",
          bullets: [
            "Restock before long sessions, not after things go wrong.",
            "Know the difference between convenience and necessity.",
            "If a role depends on tools, build a repeatable prep routine."
          ]
        }
      ]
    },
    "personal-vehicles": {
      title: "Personal Vehicles",
      navLabel: "Personal Vehicles",
      eyebrow: "Gameplay",
      summary: "Personal vehicles are the backbone of movement, status, and utility. They affect how players travel, escape, respond to jobs, and organize progression across the city.",
      facts: [["Type", "Gameplay system"], ["Main goal", "Mobility"], ["Best for", "Route control"], ["Touches", "Every role"]],
      sections: [
        {
          title: "Why they matter",
          paragraphs: [
            "A good vehicle setup changes almost everything: travel time, survivability, job efficiency, and how confidently you move between city zones."
          ],
          bullets: [
            "Faster movement increases opportunity.",
            "Better vehicle choice supports better route planning.",
            "Owning the right vehicles changes both legal and illegal play."
          ]
        },
        {
          title: "Practical use",
          bullets: [
            "Use vehicles that match the route, not just the look.",
            "Think about recovery, storage, and replacement cost.",
            "Treat vehicle management as long-term progression."
          ]
        }
      ]
    },
    "party-system": {
      title: "Party System",
      navLabel: "Party System",
      eyebrow: "Gameplay",
      summary: "The party system exists to make grouping cleaner. It helps players move together, share activities more smoothly, and keep team-based sessions from turning into confusion.",
      facts: [["Type", "Gameplay system"], ["Main goal", "Group coordination"], ["Best for", "Friends and crews"], ["Touches", "Jobs and events"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Grouping systems make shared play easier by reducing friction. Whether you are doing jobs, city movement, or criminal activity, a clean party setup keeps information and movement organized."
          ],
          bullets: [
            "Use parties to coordinate routes and objectives.",
            "Treat parties as utility, not clutter.",
            "The better the group flow, the fewer mistakes happen under pressure."
          ]
        },
        {
          title: "Best use cases",
          bullets: [
            "Job runs with multiple players.",
            "City activities that need fast regrouping.",
            "Shared learning sessions for new players."
          ]
        }
      ]
    },
    "crews-memberships": {
      title: "Crews & Memberships",
      navLabel: "Crews & Memberships",
      eyebrow: "Gameplay",
      summary: "Crews and memberships cover the group identity side of the server. This includes team tags, shared outfits or liveries, and any wider progression systems linked to community or supporter features.",
      facts: [["Type", "Gameplay system"], ["Main goal", "Group identity"], ["Best for", "Teams and supporters"], ["Touches", "Appearance and progression"]],
      sections: [
        {
          title: "Crew basics",
          paragraphs: [
            "Crews are how players build recognizable groups inside the city. They often affect tags, outfit identity, vehicle style, and how players organize long-term sessions."
          ],
          bullets: [
            "Use crews for identity and repeatable coordination.",
            "Treat tags and visual style as part of recognition.",
            "Make sure a crew improves play instead of only stacking numbers."
          ]
        },
        {
          title: "Memberships and extras",
          bullets: [
            "Supporter perks should feel like convenience, not a replacement for game knowledge.",
            "Shared outfits and liveries work best when they reinforce clear identity.",
            "Group systems are strongest when they help people play together more cleanly."
          ]
        }
      ]
    },
    phone: {
      title: "Phone",
      navLabel: "Phone",
      eyebrow: "Gameplay",
      summary: "The phone system handles city communication, shortcuts, and service access. It becomes more useful the more players rely on it for routine movement instead of treating it like a cosmetic extra.",
      facts: [["Type", "Gameplay system"], ["Main goal", "Communication"], ["Best for", "Service access"], ["Touches", "Groups and utility"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "A strong phone system compresses many city tasks into one interface. That can include communication, job access, utilities, and quick interaction with features that would otherwise waste time."
          ],
          bullets: [
            "Use it to reduce setup time between activities.",
            "Treat it as part of your routine, not just a side feature.",
            "The more systems connect to it, the more valuable it becomes."
          ]
        },
        {
          title: "Useful mindset",
          bullets: [
            "Learn the menus you actually use often.",
            "Keep communication clean instead of spammy.",
            "If a feature exists in the phone, use it to simplify your flow."
          ]
        }
      ]
    },
    economy: {
      title: "Economy",
      navLabel: "Economy",
      eyebrow: "Gameplay",
      summary: "The economy page explains how money turns into progression. It covers legal income, illegal income, spending priorities, and why efficient players often feel richer even when they are not grinding harder.",
      facts: [["Type", "Gameplay system"], ["Main goal", "Money and progression"], ["Best for", "Long-term planning"], ["Touches", "All jobs"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Economy is not just about earning cash. It is about understanding what to buy first, what to delay, and how to turn one good system into progress across the rest of the server."
          ],
          bullets: [
            "Use stable income to unlock better movement and utility.",
            "Avoid spending everything on cosmetics too early.",
            "Treat legal and illegal income as different tools, not just different speeds."
          ]
        },
        {
          title: "Good progression habits",
          bullets: [
            "Prioritize utility before luxury.",
            "Build repeatable money routes instead of relying on one lucky win.",
            "Know when faster income also brings more risk."
          ]
        }
      ]
    },
    robberies: {
      title: "Robberies",
      navLabel: "Robberies",
      eyebrow: "Criminal activity",
      summary: "Robberies are the loud objective side of criminal gameplay. They create conflict, attract police response, and often become the center of contested action between multiple players or groups.",
      facts: [["Type", "Criminal"], ["Risk", "High"], ["Main goal", "Objective cash"], ["Best for", "Group play"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "A robbery is more than a quick payout. It creates an event that other players can notice, challenge, or respond to, which is why planning matters far more than rushing in blind."
          ],
          bullets: [
            "Treat entry, control, escape, and takeover risk as one loop.",
            "Expect pressure from both police and rival players.",
            "The objective only matters if you can finish or escape with it."
          ]
        },
        {
          title: "Good robbery flow",
          bullets: [
            "Know where your fallback route is before the job starts.",
            "Do not waste time in objective zones once the pressure is real.",
            "Treat loot control and escape timing as equal priorities."
          ]
        }
      ]
    },
    "atm-hacking": {
      title: "ATM Hacking",
      navLabel: "ATM Hacking",
      eyebrow: "Criminal activity",
      summary: "ATM hacking is a quick illegal money route built around setup, hotspot awareness, and fast exits. It suits players who prefer small high-risk actions over long multi-stage crimes.",
      facts: [["Type", "Criminal"], ["Risk", "Medium"], ["Main goal", "Fast cash"], ["Best for", "Solo crime"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "ATM hacking rewards players who can move fast and disappear faster. It is less about raw firepower and more about knowing where to go, when to hit, and how to leave before attention builds."
          ],
          bullets: [
            "Prepare before entering dense city zones.",
            "Know where common ATM clusters are.",
            "Treat the escape as part of the job, not an afterthought."
          ]
        },
        {
          title: "Best habits",
          bullets: [
            "Avoid obvious repetition in one neighborhood.",
            "Use the map and road network to shorten exposure time.",
            "Work cleanly or move on quickly."
          ]
        }
      ]
    },
    pickpocket: {
      title: "Pickpocket",
      navLabel: "Pickpocket",
      eyebrow: "Criminal activity",
      summary: "Pickpocketing is a smaller-scale criminal loop focused on opportunity, density, and quick execution. It is useful for players who like compact risk without committing to major objectives.",
      facts: [["Type", "Criminal"], ["Risk", "Low to medium"], ["Main goal", "Steal quietly"], ["Best for", "Fast opportunistic play"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Pickpocketing usually lives in crowded or high-traffic spaces where players can take advantage of movement and distraction. It is less dramatic than a robbery, but mistakes still create heat fast."
          ],
          bullets: [
            "Work where density supports quick opportunities.",
            "Do not stay visible after a successful attempt.",
            "Treat subtlety as the main advantage."
          ]
        },
        {
          title: "Good habits",
          bullets: [
            "Use movement and crowding to your advantage.",
            "Do not keep pressing the same spot once attention rises.",
            "Know when to stop instead of forcing extra attempts."
          ]
        }
      ]
    },
    "vehicle-export": {
      title: "Vehicle Export",
      navLabel: "Vehicle Export",
      eyebrow: "Criminal activity",
      summary: "Vehicle export turns specific stolen vehicles into objective-based income. It rewards map knowledge, car recognition, and efficient travel from pickup to drop-off.",
      facts: [["Type", "Criminal"], ["Risk", "Medium"], ["Main goal", "Deliver target vehicles"], ["Best for", "Route-focused crime"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Export jobs create a more structured vehicle-theft loop than scrap alone. The player needs the right vehicle, a clean path, and enough awareness to avoid losing the run halfway through."
          ],
          bullets: [
            "Know which vehicles are worth prioritizing.",
            "Treat travel time and route safety as part of the payout.",
            "Do not overcomplicate the run once you have the right target."
          ]
        },
        {
          title: "Practical use",
          bullets: [
            "Learn export patterns to reduce decision time.",
            "Avoid loud routes when a quieter route protects the vehicle.",
            "If pressure rises, think in terms of successful delivery, not ego driving."
          ]
        }
      ]
    },
    "vehicle-scrap": {
      title: "Vehicle Scrap",
      navLabel: "Vehicle Scrap",
      eyebrow: "Criminal activity",
      summary: "Vehicle scrap is one of the cleanest entry-level criminal routes: steal a suitable vehicle, move it to a scrap location, and convert it into quick money without committing to a larger objective chain.",
      facts: [["Type", "Criminal"], ["Risk", "Low to medium"], ["Main goal", "Scrap stolen vehicles"], ["Best for", "Entry-level crime"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Scrap is attractive because it is simple, repeatable, and teaches the vehicle side of criminal gameplay without needing a full robbery setup."
          ],
          bullets: [
            "Recognize good scrap targets quickly.",
            "Move to the drop point without attracting avoidable heat.",
            "Use the route to build criminal map knowledge."
          ]
        },
        {
          title: "Why players use it",
          bullets: [
            "Low setup requirement compared with larger crimes.",
            "Strong early criminal route for learning movement.",
            "Easy to chain with other city activity once you know the map."
          ]
        }
      ]
    },
    garages: {
      title: "Garages",
      navLabel: "Garages",
      eyebrow: "Properties",
      summary: "Garages are the practical storage side of vehicle progression. They matter because they turn a loose collection of cars into something players can manage, protect, and use intentionally.",
      facts: [["Type", "Property"], ["Main goal", "Vehicle storage"], ["Best for", "Organization"], ["Touches", "Personal vehicles"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Once players own more than one useful vehicle, garage structure becomes important. Storage is not only about owning cars, but about being able to pick the right one fast when the situation changes."
          ],
          bullets: [
            "Use garages to organize your vehicle lineup.",
            "Treat storage location as part of convenience and efficiency.",
            "A better garage setup usually means faster response everywhere else."
          ]
        },
        {
          title: "Good habits",
          bullets: [
            "Keep utility vehicles easy to access.",
            "Avoid turning storage into clutter you cannot read quickly.",
            "Think about travel flow when choosing where to keep things."
          ]
        }
      ]
    },
    warehouses: {
      title: "Warehouses",
      navLabel: "Warehouses",
      eyebrow: "Properties",
      summary: "Warehouses are the heavier storage and progression side of the server. They matter most when players start organizing larger criminal or business-style loops and need a stable place to support them.",
      facts: [["Type", "Property"], ["Main goal", "Storage and progression"], ["Best for", "Long-term organization"], ["Touches", "Criminal systems"]],
      sections: [
        {
          title: "Role overview",
          paragraphs: [
            "Warehouse systems are useful because they support scale. Once players begin handling larger quantities, repeatable objectives, or structured crew play, basic pocket storage stops being enough."
          ],
          bullets: [
            "Use warehouses when your loop grows beyond simple short runs.",
            "Treat storage as support for the wider activity, not the whole activity itself.",
            "Good warehouse use helps reduce wasted city movement."
          ]
        },
        {
          title: "Why they matter",
          bullets: [
            "They support longer progression loops.",
            "They make repeated activity cleaner for groups.",
            "They help turn short-term success into stable structure."
          ]
        }
      ]
    },
    "help-center": {
      title: "Support Desk",
      navLabel: "Support Desk",
      eyebrow: "Support & Tools",
      summary: "The help center is the catch-all page for common player questions, support direction, and the simple answers people usually need before they open a ticket.",
      facts: [["Type", "Support"], ["Main goal", "Fast answers"], ["Best for", "New players"], ["Pairs with", "Discord"]],
      sections: [
        {
          title: "What belongs here",
          paragraphs: [
            "Use this page for the questions that show up all the time: how to join, where to report someone, how to appeal, or what to do when you are unsure about a rule or system."
          ],
          bullets: [
            "Joining and setup help",
            "Report and appeal direction",
            "Support process expectations",
            "Common server questions"
          ]
        },
        {
          title: "When to move to support",
          bullets: [
            "If the issue needs evidence, open a ticket.",
            "If the issue affects your account or punishment, use the correct support route.",
            "If you are only unsure what a system does, the wiki should answer that first."
          ]
        }
      ]
    },
    "other-settings": {
      title: "Other Settings",
      navLabel: "Other Settings",
      eyebrow: "Support & Tools",
      summary: "Other settings cover the quality-of-life side of the experience: controls, visual clarity, convenience bindings, and the small tweaks that make long sessions feel cleaner.",
      facts: [["Type", "Miscellaneous"], ["Main goal", "Quality of life"], ["Best for", "Comfort"], ["Touches", "All players"]],
      sections: [
        {
          title: "Why settings matter",
          paragraphs: [
            "Small improvements in controls, layout, and visual comfort add up quickly. Players who tune their setup usually react faster, waste less time, and enjoy the city more."
          ],
          bullets: [
            "Use comfortable control setups for repeated actions.",
            "Tune visual clutter down when learning new systems.",
            "Keep the server readable first, flashy second."
          ]
        },
        {
          title: "What to review",
          bullets: [
            "HUD or overlay visibility",
            "Keybinds for repeated actions",
            "Any settings that reduce friction during long sessions"
          ]
        }
      ]
    },
    "website-api": {
      title: "Website API",
      navLabel: "Website API",
      eyebrow: "Support & Tools",
      summary: "The website API page is for live status or external integrations that read useful information from the server or site. It is mainly a utility reference for people building around the SGCNR ecosystem.",
      facts: [["Type", "Developer utility"], ["Main goal", "Integration reference"], ["Best for", "Website tools"], ["Touches", "Status and automation"]],
      sections: [
        {
          title: "What this page is for",
          paragraphs: [
            "As the website grows, live status, player counts, or server-side tools may rely on endpoints or structured data. This page exists so those tools have a home instead of being scattered through unrelated support pages."
          ],
          bullets: [
            "Live status integrations",
            "External widgets or overlays",
            "Website-side automation and monitoring"
          ]
        },
        {
          title: "Important note",
          bullets: [
            "Keep sensitive data private and out of public pages.",
            "Use API pages for technical reference, not general player help.",
            "If the server changes, update the docs with it."
          ]
        }
      ]
    }
  }
};
