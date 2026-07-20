const RESOURCES = [
    {
        title: "Incident Briefing",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 201, incident briefing (v3).pdf",
        categories: ["planning"],
        tags: ["briefing", "initial response", "situation"],
        date: "2026-07-20",
        description: "Provides initial incident information for briefing arriving personnel."
    },
    {
        title: "Incident Objectives",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 202, incident objectives (v3.1).pdf",
        categories: ["planning"],
        tags: ["objectives", "planning meeting", "strategy"],
        date: "2026-07-20",
        description: "Describes incident objectives and strategy for the operational period."
    },
    {
        title: "Organization Assignment List",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 203, organization assignment list (v3).pdf",
        categories: ["planning"],
        tags: ["command", "objectives", "planning meeting"],
        date: "2026-07-14",
        description: "Lists who is filling each ICS position for the operational period."
    },
    {
        title: "Assignment List",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 204, assignment list (v3.1).pdf",
        categories: ["operations"],
        tags: ["assignments", "tactics", "operational period"],
        date: "2026-07-20",
        description: "Lists tactical assignments for resources within a division or group."
    },
    {
        title: "Incident Radio Communications Plan",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 205, incident radio communications plan (v3.1).pdf",
        categories: ["logistics"],
        tags: ["radio", "frequencies", "communications plan"],
        date: "2026-07-20",
        description: "Provides radio frequency assignments for the operational period."
    },
    {
        title: "Communications List",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 205a, communications list (v3).pdf",
        categories: ["logistics"],
        tags: ["contact list", "phone", "radio"],
        date: "2026-07-20",
        description: "Lists contact information for incident personnel and resources."
    },
    {
        title: "Medical Plan",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 206, medical plan (v3).pdf",
        categories: ["logistics"],
        tags: ["medical", "emergency", "aid stations"],
        date: "2026-07-20",
        description: "Provides medical aid and emergency transportation information for incident personnel."
    },
    {
        title: "Incident Organization Chart",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 207, incident organization chart (v3).pdf",
        categories: ["planning"],
        tags: ["organization chart", "command structure"],
        date: "2026-07-20",
        description: "Depicts the organizational structure of the incident command."
    },
    {
        title: "Safety Message/Plan",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 208, safety message-plan (v3.1).pdf",
        categories: ["command"],
        tags: ["safety message", "hazards"],
        date: "2026-07-20",
        description: "Communicates safety message and hazard information for the operational period."
    },
    {
        title: "Site Safety and Control Plan",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 208hm, site safety and control plan (v3).pdf",
        categories: ["command"],
        tags: ["hazmat", "site safety"],
        date: "2026-07-20",
        description: "Documents the site safety plan for hazardous materials incidents."
    },
    {
        title: "Incident Status Summary",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 209, incident status summary (v3).pdf",
        categories: ["planning"],
        tags: ["status summary", "situation report"],
        date: "2026-07-20",
        description: "Summarizes incident status information for reporting purposes."
    },
    {
        title: "Resource Status Change",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 210, resource status change (v3).pdf",
        categories: ["logistics", "planning"],
        tags: ["resource status", "tracking"],
        date: "2026-07-20",
        description: "Reports changes in the status of incident resources."
    },
    {
        title: "Incident Check-In List",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 211, incident check-in list (v3.1).pdf",
        categories: ["planning"],
        tags: ["check-in", "personnel", "resources"],
        date: "2026-07-20",
        description: "Records check-in information for incoming resources."
    },
    {
        title: "General Message",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 213, general message (v3).pdf",
        categories: ["command"],
        tags: ["message", "correspondence"],
        date: "2026-07-20",
        description: "Used to record general messages between incident personnel."
    },
    {
        title: "Resource Request Message",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 213rr, resource request message (v3).pdf",
        categories: ["logistics"],
        tags: ["resource request", "ordering"],
        date: "2026-07-20",
        description: "Used to request additional resources for the incident."
    },
    {
        title: "Activity Log",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 214, activity log (v3.1).pdf",
        categories: ["command"],
        tags: ["activity log", "unit log"],
        date: "2026-07-20",
        description: "Records notable activities at any incident level."
    },
    {
        title: "Operational Planning Worksheet",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 215, operational planning worksheet (v3).pdf",
        categories: ["planning", "operations"],
        tags: ["resource planning", "tactics"],
        date: "2026-07-20",
        description: "Documents tactical resource assignments for the operational period."
    },
    {
        title: "Incident Action Plan Safety Analysis",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 215a, incident action plan safety analysis (v3).pdf",
        categories: ["command"],
        tags: ["safety analysis", "hazards", "IAP"],
        date: "2026-07-20",
        description: "Identifies safety and health hazards associated with each planned operation."
    },
    {
        title: "Communications Resource Availability Worksheet",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 217a, comm resource avail worksheet (v3).pdf",
        categories: ["logistics"],
        tags: ["radio cache", "resources"],
        date: "2026-07-20",
        description: "Tracks availability of communications resources and equipment."
    },
    {
        title: "Support Vehicle/Equipment Inventory",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 218, support vehicle-equipment inventory (v3).pdf",
        categories: ["logistics"],
        tags: ["vehicles", "equipment", "inventory"],
        date: "2026-07-20",
        description: "Records inventory of support vehicles and equipment at the incident."
    },
    {
        title: "Air Operations Summary",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 220, air operations summary (v3).pdf",
        categories: ["operations"],
        tags: ["aviation", "air support"],
        date: "2026-07-20",
        description: "Summarizes air operations for the operational period."
    },
    {
        title: "Demobilization Check-Out",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 221, demobilization check-out (v3).pdf",
        categories: ["logistics", "planning"],
        tags: ["demobilization", "check-out"],
        date: "2026-07-20",
        description: "Records resource release and check-out information at demobilization."
    },
    {
        title: "Demobilization Check-Out",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 221, demobilization check-out (v3.1).pdf",
        categories: ["logistics", "planning"],
        tags: ["demobilization", "check-out"],
        date: "2026-07-20",
        description: "Records resource release and check-out information at demobilization."
    },
    {
        title: "Incident Personnel Performance Rating",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 225, incident personnel performance rating (v3).pdf",
        categories: ["command"],
        tags: ["performance rating", "personnel"],
        date: "2026-07-20",
        description: "Documents performance evaluation of incident personnel."
    },
    {
        title: "Daily Meeting Schedule",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 230cg, daily meeting schedule (v3).pdf",
        categories: ["planning"],
        tags: ["meeting schedule", "coordination"],
        date: "2026-07-20",
        description: "Lists scheduled meetings for the incident."
    },
    {
        title: "Incident Open Action Tracker",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 233cg, incident open action tracker (v3).pdf",
        categories: ["planning"],
        tags: ["action tracker", "follow-up"],
        date: "2026-07-20",
        description: "Tracks open action items requiring follow-up."
    },
    {
        title: "Resource Order",
        basepath: "resources/ics forms/ics forms pdf with instructions/",
        filename: "ics form 260, resource order.pdf",
        categories: ["logistics"],
        tags: ["resource order", "ordering"],
        date: "2026-07-20",
        description: "Used to order resources for the incident."
    }
];

// Built full path
RESOURCES.forEach(r => {r.path = r.basepath + r.filename;});