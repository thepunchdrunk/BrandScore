/**
 * Brand Rules Data
 * Embedded rules data for offline functionality
 * @module rulesData
 */

const BRAND_RULES = {
  "version": "1.0.0",
  "lastUpdated": "2025-11-25",
  "brandTone": [
    {
      "id": "bt-1",
      "phrase": "world-class",
      "penalty": 5,
      "severity": "warning",
      "message": "Brand tone avoids vague superlatives like \"world-class\".",
      "suggestion": "Describe the specific advantage (efficiency, uptime, lifetime) instead."
    },
    {
      "id": "bt-2",
      "phrase": "game-changing",
      "penalty": 5,
      "severity": "warning",
      "message": "Hype language like \"game-changing\" does not fit a calm, engineering-led tone.",
      "suggestion": "Use calm language such as \"significant improvement in energy efficiency\"."
    },
    {
      "id": "bt-3",
      "phrase": "super cheap",
      "penalty": 10,
      "severity": "warning",
      "message": "For B2B industrial machinery, \"super cheap\" undermines quality perception.",
      "suggestion": "Prefer \"lower total cost of ownership\" or \"cost-efficient operation\"."
    }
  ],
  "legalClaims": [
    {
      "id": "lc-1",
      "phrase": "100% safe",
      "penalty": 20,
      "severity": "critical",
      "message": "Absolute safety claims conflict with regulatory best practice.",
      "suggestion": "Describe safety functions and standards (e.g. \"designed according to ISO 13849-1\")."
    },
    {
      "id": "lc-2",
      "phrase": "zero emissions",
      "penalty": 25,
      "severity": "critical",
      "message": "Zero-emission claims need strong evidence and can be risky in EU markets.",
      "suggestion": "Use verifiable metrics, like \"up to 18% lower CO₂e vs. previous series (2019 baseline)\"."
    }
  ],
  "sustainability": [
    {
      "id": "su-1",
      "phrase": "eco-friendly",
      "penalty": 10,
      "severity": "warning",
      "message": "Generic \"eco-friendly\" wording without metrics can look like greenwashing.",
      "suggestion": "Mention concrete indicators: energy savings, CO₂e reduction, recycled content."
    },
    {
      "id": "su-2",
      "phrase": "green solution",
      "penalty": 10,
      "severity": "warning",
      "message": "Unqualified \"green solution\" is vague and off-brand.",
      "suggestion": "Tie to a standard (ISO 14001, ISO 50001) or a numeric improvement."
    },
    {
      "id": "su-3",
      "phrase": "climate neutral",
      "penalty": 20,
      "severity": "critical",
      "message": "\"Climate neutral\" should only be used with audited backing.",
      "suggestion": "Describe the mechanism (renewable sourcing, efficiency gains) instead of using the claim directly."
    }
  ],
  "technical": [
    {
      "id": "te-1",
      "phrase": "around 10 kw",
      "penalty": 10,
      "severity": "warning",
      "message": "Vague power rating \"around 10 kW\" might be unclear for engineering and tenders.",
      "suggestion": "Use a specific value or range (e.g. \"9.5–10.2 kW at nominal load\")."
    },
    {
      "id": "te-2",
      "phrase": "old gateway",
      "penalty": 10,
      "severity": "warning",
      "message": "Referring to \"old gateway\" without naming platform or migration path is ambiguous.",
      "suggestion": "Name the platform (e.g. \"legacy OPC-UA gateway v1.2\") and target replacement solution."
    }
  ],
  "cultural": {
    "DK": [
      {
        "id": "cu-dk-1",
        "phrase": "hq decides everything",
        "penalty": 5,
        "severity": "info",
        "message": "Nordic/Danish culture prefers low hierarchy and shared ownership.",
        "suggestion": "Frame as cross-BU or cross-functional collaboration instead."
      }
    ],
    "DE": [
      {
        "id": "cu-de-1",
        "phrase": "climate neutral motor",
        "penalty": 20,
        "severity": "critical",
        "message": "Germany is particularly strict on \"climate neutral\" claims without strong evidence.",
        "suggestion": "Use an efficiency or CO₂e metric and refer to applicable standards."
      }
    ],
    "IN": [
      {
        "id": "cu-in-1",
        "phrase": "cheap labour",
        "penalty": 15,
        "severity": "critical",
        "message": "Term \"cheap labour\" is not aligned with respectful partnership positioning.",
        "suggestion": "Focus on expertise, collaboration and long-term partnerships instead."
      }
    ],
    "US": [
      {
        "id": "cu-us-1",
        "phrase": "union-free workforce",
        "penalty": 10,
        "severity": "warning",
        "message": "Highlighting \"union-free workforce\" can be sensitive in the US.",
        "suggestion": "Emphasise safety, training and productivity instead."
      }
    ]
  },
  "businessUnits": {
    "hydraulics": {
      "id": "bu-hydraulics",
      "required": ["hydraulic", "cylinder", "pressure", "valve"],
      "penalty": 5,
      "severity": "info",
      "message": "Text does not reference typical hydraulics concepts.",
      "suggestion": "Mention pressure, flow, cylinders, or valves if relevant."
    },
    "automation": {
      "id": "bu-automation",
      "required": ["plc", "controller", "fieldbus", "iot"],
      "penalty": 5,
      "severity": "info",
      "message": "Text does not reference typical automation concepts.",
      "suggestion": "Mention PLC, controllers, protocols, or IIoT where relevant."
    },
    "pumping": {
      "id": "bu-pumping",
      "required": ["pump", "flow", "m3/h", "efficiency"],
      "penalty": 5,
      "severity": "info",
      "message": "Text does not reference typical pumping-system concepts.",
      "suggestion": "Mention pump type, flow rate, or efficiency if it is about that BU."
    },
    "sensors": {
      "id": "bu-sensors",
      "required": ["sensor", "condition monitoring", "vibration", "data"],
      "penalty": 5,
      "severity": "info",
      "message": "Text does not reference typical sensor / monitoring concepts.",
      "suggestion": "Mention sensors, data, or monitoring concepts if relevant."
    }
  },
  "assetTypes": {
    "slide": [
      {
        "id": "as-slide-1",
        "phrase": "tiny logo",
        "penalty": 5,
        "severity": "warning",
        "message": "Slides should use the prescribed logo size; \"tiny logo\" suggests misuse.",
        "suggestion": "Use standard logo size and clear space from the visual guideline."
      },
      {
        "id": "as-slide-2",
        "phrase": "all caps headline",
        "penalty": 5,
        "severity": "warning",
        "message": "All-caps headlines are discouraged except for short labels.",
        "suggestion": "Use sentence case for main slide headlines."
      }
    ],
    "image": [
      {
        "id": "as-image-1",
        "phrase": "smokestack",
        "penalty": 15,
        "severity": "critical",
        "message": "Smokestacks conflict with the sustainability-first visual direction.",
        "suggestion": "Prefer visuals of clean plants, modern equipment or people in PPE."
      },
      {
        "id": "as-image-2",
        "phrase": "coal plant",
        "penalty": 20,
        "severity": "critical",
        "message": "Coal plant imagery clashes with sustainability positioning.",
        "suggestion": "Show upgrade equipment, efficiency dashboards, or renewable-related visuals instead."
      }
    ],
    "social": [
      {
        "id": "as-social-1",
        "phrase": "click here now",
        "penalty": 5,
        "severity": "warning",
        "message": "Clickbait wording is off-brand.",
        "suggestion": "Use calm CTAs like \"Learn more about the upgrade\"."
      },
      {
        "id": "as-social-2",
        "phrase": "giveaway",
        "penalty": 5,
        "severity": "warning",
        "message": "Consumer-style giveaways rarely fit an industrial B2B brand.",
        "suggestion": "Focus on knowledge-sharing formats (webinars, whitepapers) instead."
      }
    ],
    "email": [],
    "doc": []
  },
  "contentTypeRules": {
    "customer-proposal": {
      "requiresDisclaimer": true,
      "disclaimerKeywords": ["not legally binding", "figures are subject to change"],
      "penalty": 10,
      "severity": "warning",
      "message": "Customer proposals typically need a short disclaimer.",
      "suggestion": "Add a line like: \"This is not legally binding; figures are indicative and subject to change.\""
    },
    "esg-report": {
      "requiresDisclaimer": true,
      "disclaimerKeywords": ["not legally binding", "figures are subject to change"],
      "penalty": 10,
      "severity": "warning",
      "message": "ESG communications typically need a short disclaimer.",
      "suggestion": "Add a line like: \"This is not legally binding; figures are indicative and subject to change.\""
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BRAND_RULES;
}
