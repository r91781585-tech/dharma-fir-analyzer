// Legal sections data for standalone version
const LEGAL_DATA = {
  "bns_2023": {
    "name": "Bharatiya Nyaya Sanhita 2023",
    "sections": {
      "115": {
        "title": "Voluntarily causing hurt",
        "description": "Whoever voluntarily causes hurt shall be punished with imprisonment of either description for a term which may extend to one year, or with fine which may extend to ten thousand rupees, or with both.",
        "keywords": ["hurt", "injury", "assault", "physical harm"]
      },
      "116": {
        "title": "Voluntarily causing grievous hurt",
        "description": "Whoever voluntarily causes grievous hurt shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        "keywords": ["grievous hurt", "serious injury", "permanent damage"]
      },
      "309": {
        "title": "Robbery",
        "description": "Whoever commits robbery shall be punished with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine; and, if the robbery be committed on the highway between sunset and sunrise, the imprisonment may be extended to fourteen years.",
        "keywords": ["robbery", "theft", "force", "snatching", "highway robbery"]
      },
      "351": {
        "title": "Criminal intimidation",
        "description": "Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person, commits criminal intimidation.",
        "keywords": ["threat", "intimidation", "fear", "coercion"]
      }
    }
  },
  "sc_st_act": {
    "name": "Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989",
    "sections": {
      "3(1)(r)": {
        "title": "Abuses or humiliates members of SC/ST",
        "description": "Whoever, not being a member of a Scheduled Caste or a Scheduled Tribe, abuses or humiliates a member of a Scheduled Caste or a Scheduled Tribe in any place within public view.",
        "keywords": ["caste abuse", "humiliation", "scheduled caste", "scheduled tribe", "public humiliation"]
      },
      "3(1)(s)": {
        "title": "Promotes or attempts to promote feelings of enmity, hatred or ill-will against SC/ST",
        "description": "Whoever promotes or attempts to promote feelings of enmity, hatred or ill-will against members of the Scheduled Castes or the Scheduled Tribes.",
        "keywords": ["enmity", "hatred", "ill-will", "caste discrimination"]
      },
      "3(1)(u)": {
        "title": "Intentionally insults or intimidates with intent to humiliate SC/ST",
        "description": "Whoever intentionally insults or intimidates with intent to humiliate a member of a Scheduled Caste or a Scheduled Tribe in any place within public view.",
        "keywords": ["insult", "intimidate", "humiliate", "public view"]
      }
    }
  },
  "arms_act": {
    "name": "Arms Act, 1959",
    "sections": {
      "25": {
        "title": "Punishment for contravention of license or rule",
        "description": "Whoever acquires, has in his possession or carries any prohibited arms or prohibited ammunition shall be punishable with imprisonment for a term which shall not be less than five years but which may extend to ten years and shall also be liable to fine.",
        "keywords": ["prohibited arms", "illegal weapons", "unlicensed firearms", "ammunition"]
      }
    }
  },
  "keywords_to_sections": {
    "caste": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(s)"],
    "scheduled caste": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(s)", "sc_st_act.3(1)(u)"],
    "scheduled tribe": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(s)", "sc_st_act.3(1)(u)"],
    "abuse": ["sc_st_act.3(1)(r)", "bns_2023.115"],
    "humiliation": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(u)"],
    "robbery": ["bns_2023.309"],
    "theft": ["bns_2023.309"],
    "snatching": ["bns_2023.309"],
    "assault": ["bns_2023.115", "bns_2023.116"],
    "hurt": ["bns_2023.115", "bns_2023.116"],
    "injury": ["bns_2023.115", "bns_2023.116"],
    "threat": ["bns_2023.351"],
    "intimidation": ["bns_2023.351", "sc_st_act.3(1)(u)"],
    "weapon": ["arms_act.25"],
    "pistol": ["arms_act.25"],
    "gun": ["arms_act.25"],
    "firearm": ["arms_act.25"],
    "arms": ["arms_act.25"]
  }
};