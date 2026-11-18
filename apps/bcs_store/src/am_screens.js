'use strict';
const { LOGO } = require('./bcs_brand.js');
/**
 * The Store's renderer screens, in iDrive 8 design pixels (2880 x 960; the
 * Store scales them into iDrive 8's box, src/store_compact.js lays the same
 * screens out for iDrive 7's). store,
 * app, confirm (the sheet), installed, usb and settings are IterioDev's App
 * Manager 2 screens (mgu-app-store apps/oap-appmanager/renderer/screens.json
 * @ 4d5f508, the HMI UI builder's export of projects/app-manager.json) with the Store's labels; source, pick, accounts, login, phone,
 * type (his Add repository page's text box and keyboard), wifi (his App Manager 2.0.6's Wi-Fi page), prefer and proxy are the Store's
 * own in the same frame; BCS Store lays them out for six tabs and large cards (tools/gen_bcs_screens.js writes this file
 * from tools/upstream/am_screens.upstream.js). Each element is drawn by am_gpu.js; src/store_ui.js gives their values.
 */
module.exports = {
 "design": {
  "w": 2880,
  "h": 960
 },
 "screens": [
  {
   "name": "store",
   "kind": "gpu",
   "title": "Apps",
   "theme": "m_red",
   "bg": "theme",
   "bgArea": "app",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 138,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "Store",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "subtitle",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 227,
     "w": 1300,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "restartNow",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 936,
     "y": 134,
     "w": 540,
     "h": 84,
     "opts": {
      "text": "Restart now",
      "vicon": "refresh",
      "style": "primary",
      "size": 34,
      "color": "#e4002b",
      "hidden": true,
      "shift": {}
     },
     "onTap": "event:restartNow"
    },
    {
     "name": "safeModeOff",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 936,
     "y": 134,
     "w": 540,
     "h": 84,
     "opts": {
      "text": "Leave safe mode",
      "vicon": "unlock",
      "style": "primary",
      "size": 34,
      "color": "#e4002b",
      "hidden": true
     },
     "onTap": "event:safeModeOff"
    },
    {
     "name": "online",
     "rtype": "gpu",
     "gpu": "chips",
     "x": 2200,
     "y": 146,
     "w": 640,
     "h": 84,
     "opts": {
      "items": "",
      "align": "right"
     }
    },
    {
     "name": "grid",
     "rtype": "gpu",
     "gpu": "appGrid",
     "x": 460,
     "y": 270,
     "w": 2380,
     "h": 570,
     "opts": {
      "items": "",
      "cols": 3,
      "tileH": 285,
      "empty": "",
      "cardStyle": "billboard",
      "iconK": 0.5,
      "titleSize": 40,
      "subSize": 27
     }
    },
    {
     "name": "viewAll",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1630,
     "y": 134,
     "w": 260,
     "h": 84,
     "opts": {
      "text": "",
      "vicon": "",
      "style": "outline",
      "size": 30,
      "shift": {
       "subtitle": [
        0,
        -170
       ]
      }
     },
     "onTap": "event:viewAll"
    },
    {
     "name": "viewInstalled",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1910,
     "y": 134,
     "w": 270,
     "h": 84,
     "opts": {
      "text": "",
      "vicon": "",
      "style": "outline",
      "size": 30
     },
     "onTap": "event:viewInstalled"
    }
   ],
   "entry": true
  },
  {
   "name": "app",
   "kind": "gpu",
   "title": "App Manager",
   "theme": "m_red",
   "bg": "theme",
   "bgArea": "app",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "icon",
     "rtype": "gpu",
     "gpu": "appIcon",
     "x": 630,
     "y": 150,
     "w": 300,
     "h": 300,
     "opts": {
      "vicon": "gauge",
      "colors": "#ff4b55,#a8101c",
      "badge": "update"
     }
    },
    {
     "name": "name",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1000,
     "y": 161,
     "w": 1200,
     "h": 120,
     "opts": {
      "text": "",
      "size": 96,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "author",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1004,
     "y": 272,
     "w": 1100,
     "h": 50,
     "opts": {
      "text": "",
      "size": 40,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "facts",
     "rtype": "gpu",
     "gpu": "chips",
     "x": 1000,
     "y": 352,
     "w": 1080,
     "h": 68,
     "opts": {
      "items": ""
     }
    },
    {
     "name": "desc",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 470,
     "w": 1560,
     "h": 250,
     "opts": {
      "text": "",
      "size": 40,
      "wrap": true,
      "color": "text"
     }
    },
    {
     "name": "panel",
     "rtype": "gpu",
     "gpu": "rect",
     "x": 2100,
     "y": 136,
     "w": 740,
     "h": 700,
     "opts": {
      "color": "panelTop",
      "radius": 28
     }
    },
    {
     "name": "instLabel",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2140,
     "y": 187,
     "w": 340,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "instValue",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2140,
     "y": 239,
     "w": 340,
     "h": 80,
     "opts": {
      "text": "",
      "size": 64,
      "font": "num",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "availLabel",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2500,
     "y": 187,
     "w": 300,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "availValue",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2500,
     "y": 239,
     "w": 300,
     "h": 80,
     "opts": {
      "text": "",
      "size": 64,
      "font": "num",
      "align": "left",
      "color": "#e4002b"
     }
    },
    {
     "name": "note1",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2140,
     "y": 364,
     "w": 660,
     "h": 40,
     "opts": {
      "text": "",
      "size": 32,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "note2",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2140,
     "y": 410,
     "w": 660,
     "h": 40,
     "opts": {
      "text": "",
      "size": 32,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "note3",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2140,
     "y": 474,
     "w": 660,
     "h": 40,
     "opts": {
      "text": "",
      "size": 32,
      "font": "label",
      "align": "left",
      "color": "#ffb020"
     }
    },
    {
     "name": "progress",
     "rtype": "gpu",
     "gpu": "progress",
     "x": 2140,
     "y": 560,
     "w": 660,
     "h": 124,
     "opts": {
      "label": "Downloading",
      "right": "42 %",
      "sub": "0.8 of 2.0 MB",
      "value": 42,
      "percent": false,
      "size": 34,
      "hidden": true
     }
    },
    {
     "name": "primary",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 2140,
     "y": 562,
     "w": 660,
     "h": 120,
     "opts": {
      "text": "",
      "vicon": "arrowDown",
      "style": "primary",
      "color": "#e4002b"
     },
     "onTap": "event:primary"
    },
    {
     "name": "secondary",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 2140,
     "y": 702,
     "w": 660,
     "h": 106,
     "opts": {
      "text": "",
      "vicon": "trash",
      "style": "outline"
     },
     "onTap": "event:secondary"
    },
    {
     "name": "problem",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 730,
     "w": 1560,
     "h": 90,
     "opts": {
      "text": "",
      "size": 36,
      "font": "label",
      "align": "left",
      "color": "#ffb020",
      "wrap": true
     }
    }
   ]
  },
  {
   "name": "confirm",
   "kind": "gpu",
   "title": "App Manager",
   "theme": "m_red",
   "bg": "theme",
   "bgArea": "app",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "sheet",
     "rtype": "gpu",
     "gpu": "sheet",
     "x": 900,
     "y": 250,
     "w": 1500,
     "h": 520,
     "opts": {}
    },
    {
     "name": "icon",
     "rtype": "gpu",
     "gpu": "appIcon",
     "x": 960,
     "y": 310,
     "w": 150,
     "h": 150,
     "opts": {
      "vicon": "gauge",
      "colors": "#ff4b55,#a8101c"
     }
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1150,
     "y": 290,
     "w": 1200,
     "h": 70,
     "opts": {
      "text": "",
      "size": 56,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "text",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1150,
     "y": 362,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "",
      "size": 36,
      "font": "label",
      "align": "left",
      "color": "dim",
      "wrap": true
     }
    },
    {
     "name": "also",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1150,
     "y": 466,
     "w": 1190,
     "h": 80,
     "opts": {
      "text": "Remove all",
      "vicon": "trash",
      "style": "outline",
      "size": 32,
      "hidden": true
     },
     "onTap": "event:also"
    },
    {
     "name": "now",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 960,
     "y": 560,
     "w": 680,
     "h": 130,
     "opts": {
      "text": "Restart now",
      "vicon": "refresh",
      "style": "primary",
      "color": "#e4002b"
     },
     "onTap": "event:restartNow"
    },
    {
     "name": "later",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1660,
     "y": 560,
     "w": 680,
     "h": 130,
     "opts": {
      "text": "At the next start",
      "vicon": "clock",
      "style": "outline"
     },
     "onTap": "event:later"
    },
    {
     "name": "note",
     "rtype": "gpu",
     "gpu": "text",
     "x": 960,
     "y": 716,
     "w": 1380,
     "h": 38,
     "opts": {
      "text": "",
      "size": 30,
      "font": "label",
      "align": "center",
      "color": "dim"
     }
    }
   ]
  },
  {
   "name": "installed",
   "kind": "gpu",
   "title": "App Manager",
   "theme": "m_red",
   "bg": "theme",
   "bgArea": "app",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 1
     }
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 138,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "Installed",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "subtitle",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 227,
     "w": 1300,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "updateAll",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 2300,
     "y": 140,
     "w": 540,
     "h": 100,
     "opts": {
      "text": "",
      "vicon": "arrowDown",
      "style": "primary",
      "color": "#e4002b"
     },
     "onTap": "event:updateAll"
    },
    {
     "name": "restartNow",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 2300,
     "y": 140,
     "w": 540,
     "h": 100,
     "opts": {
      "text": "Restart now",
      "vicon": "refresh",
      "style": "primary",
      "size": 34,
      "color": "#e4002b",
      "hidden": true,
      "shift": {
       "updateAll": [
        -564,
        0
       ],
       "subtitle": [
        0,
        -70
       ]
      }
     },
     "onTap": "event:restartNow"
    },
    {
     "name": "appsLabel",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 292,
     "w": 400,
     "h": 38,
     "opts": {
      "text": "APPS",
      "size": 30,
      "font": "bold",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "apps",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 480,
     "y": 336,
     "w": 1280,
     "h": 480,
     "opts": {
      "items": "",
      "rowH": 120,
      "empty": "No apps installed"
     }
    },
    {
     "name": "svcLabel",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1840,
     "y": 292,
     "w": 600,
     "h": 38,
     "opts": {
      "text": "HEAD-UNIT TOOLS",
      "size": 30,
      "font": "bold",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "services",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 1840,
     "y": 336,
     "w": 1000,
     "h": 480,
     "opts": {
      "items": "",
      "rowH": 150
     }
    }
   ]
  },
  {
   "name": "usb",
   "kind": "gpu",
   "title": "App Manager",
   "theme": "m_red",
   "bg": "theme",
   "bgArea": "app",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 2
     }
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 138,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "USB",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "subtitle",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 227,
     "w": 1300,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "grid",
     "rtype": "gpu",
     "gpu": "appGrid",
     "x": 460,
     "y": 270,
     "w": 2380,
     "h": 570,
     "opts": {
      "items": "",
      "cols": 3,
      "tileH": 285,
      "empty": "",
      "cardStyle": "billboard",
      "iconK": 0.5,
      "titleSize": 40,
      "subSize": 27
     }
    }
   ]
  },
  {
   "name": "settings",
   "kind": "gpu",
   "title": "App Manager",
   "theme": "m_red",
   "bg": "theme",
   "bgArea": "app",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 3
     }
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 138,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "Settings",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "subtitle",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 227,
     "w": 1300,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "note",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1500,
     "y": 227,
     "w": 1340,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "#ffb020"
     }
    },
    {
     "name": "accessLeft",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 470,
     "y": 292,
     "w": 1170,
     "h": 548,
     "opts": {
      "items": [],
      "rowH": 170,
      "fit": true
     }
    },
    {
     "name": "accessRight",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 1690,
     "y": 292,
     "w": 1150,
     "h": 548,
     "opts": {
      "items": [],
      "rowH": 170,
      "fit": true
     }
    }
   ]
  },
  {
   "name": "sources",
   "kind": "gpu",
   "title": "App Manager",
   "theme": "m_red",
   "bg": "theme",
   "bgArea": "app",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 3
     }
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 138,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "Sources",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "subtitle",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 227,
     "w": 1300,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "repos",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 460,
     "y": 292,
     "w": 2380,
     "h": 440,
     "opts": {
      "items": "",
      "rowH": 130
     }
    },
    {
     "name": "addRepo",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 744,
     "w": 1000,
     "h": 96,
     "opts": {
      "text": "Add source",
      "vicon": "plus",
      "style": "tinted",
      "color": "#e4002b"
     },
     "onTap": "event:addRepo"
    },
    {
     "name": "note",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 227,
     "w": 1300,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "#ffb020"
     }
    },
    {
     "name": "refresh",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1500,
     "y": 744,
     "w": 880,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "plus",
      "style": "tinted",
      "color": "#e4002b"
     },
     "onTap": "event:addRepo"
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "system",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "note",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 227,
     "w": 1600,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "#ffb020"
     }
    },
    {
     "name": "unit",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 292,
     "w": 2230,
     "h": 40,
     "opts": {
      "text": "",
      "size": 30,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "versions",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 336,
     "w": 2230,
     "h": 40,
     "opts": {
      "text": "",
      "size": 28,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "about",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 610,
     "y": 398,
     "w": 2230,
     "h": 330,
     "opts": {
      "items": [],
      "rowH": 110,
      "fit": true
     }
    },
    {
     "name": "checkNow",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 610,
     "y": 744,
     "w": 640,
     "h": 96,
     "opts": {
      "text": "Check now",
      "vicon": "refresh",
      "style": "outline",
      "size": 30
     },
     "onTap": "event:checkNow"
    },
    {
     "name": "restart",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1280,
     "y": 744,
     "w": 700,
     "h": 96,
     "opts": {
      "text": "Restart head unit",
      "vicon": "refresh",
      "style": "outline",
      "size": 30
     },
     "onTap": "event:restart"
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "theme",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 1600,
     "h": 90,
     "opts": {
      "text": "",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "status",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 227,
     "w": 1600,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "list",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 610,
     "y": 292,
     "w": 1500,
     "h": 230,
     "opts": {
      "items": [],
      "rowH": 108,
      "empty": ""
     }
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "source",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "icon",
     "rtype": "gpu",
     "gpu": "appIcon",
     "x": 630,
     "y": 150,
     "w": 220,
     "h": 220,
     "opts": {
      "vicon": "lock",
      "kind": "service",
      "colors": "#3a4352,#232a35"
     }
    },
    {
     "name": "name",
     "rtype": "gpu",
     "gpu": "text",
     "x": 900,
     "y": 161,
     "w": 1200,
     "h": 110,
     "opts": {
      "text": "",
      "size": 80,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "state",
     "rtype": "gpu",
     "gpu": "text",
     "x": 904,
     "y": 262,
     "w": 1100,
     "h": 50,
     "opts": {
      "text": "",
      "size": 40,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "facts",
     "rtype": "gpu",
     "gpu": "chips",
     "x": 900,
     "y": 340,
     "w": 1180,
     "h": 68,
     "opts": {
      "items": []
     }
    },
    {
     "name": "desc",
     "rtype": "gpu",
     "gpu": "text",
     "x": 480,
     "y": 470,
     "w": 1560,
     "h": 300,
     "opts": {
      "text": "",
      "size": 40,
      "font": "label",
      "align": "left",
      "color": "#ffb020",
      "wrap": true
     }
    },
    {
     "name": "panel",
     "rtype": "gpu",
     "gpu": "rect",
     "x": 2100,
     "y": 136,
     "w": 740,
     "h": 700,
     "opts": {
      "color": "panelTop",
      "radius": 28
     }
    },
    {
     "name": "appLabel",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2140,
     "y": 180,
     "w": 660,
     "h": 48,
     "opts": {
      "text": "Install on GitHub",
      "size": 38,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "appQr",
     "rtype": "gpu",
     "gpu": "qr",
     "x": 2240,
     "y": 250,
     "w": 460,
     "h": 460,
     "opts": {
      "text": ""
     }
    },
    {
     "name": "appUrl",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2140,
     "y": 730,
     "w": 660,
     "h": 36,
     "opts": {
      "text": "",
      "size": 26,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "remove",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 720,
     "w": 520,
     "h": 106,
     "opts": {
      "text": "Remove",
      "vicon": "trash",
      "style": "outline"
     },
     "onTap": "event:remove"
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "accounts",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "Accounts",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "status",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 227,
     "w": 1600,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "list",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 610,
     "y": 292,
     "w": 1500,
     "h": 400,
     "opts": {
      "items": [],
      "rowH": 120,
      "empty": "None"
     }
    },
    {
     "name": "signIn",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 610,
     "y": 724,
     "w": 760,
     "h": 106,
     "opts": {
      "text": "Sign in with GitHub",
      "vicon": "plus",
      "style": "primary",
      "color": "#e4002b"
     },
     "onTap": "event:signIn"
    },
    {
     "name": "addToken",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1400,
     "y": 724,
     "w": 560,
     "h": 106,
     "opts": {
      "text": "Add token",
      "vicon": "plus",
      "style": "outline"
     },
     "onTap": "event:addToken"
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "pick",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 1600,
     "h": 90,
     "opts": {
      "text": "",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "status",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 227,
     "w": 1600,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "list",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 610,
     "y": 292,
     "w": 1500,
     "h": 400,
     "opts": {
      "items": [],
      "rowH": 120,
      "empty": ""
     }
    },
    {
     "name": "signIn",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 610,
     "y": 724,
     "w": 760,
     "h": 106,
     "opts": {
      "text": "Sign in with GitHub",
      "vicon": "plus",
      "style": "primary",
      "color": "#e4002b"
     },
     "onTap": "event:signIn"
    },
    {
     "name": "addToken",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1400,
     "y": 724,
     "w": 560,
     "h": 106,
     "opts": {
      "text": "Add token",
      "vicon": "plus",
      "style": "outline"
     },
     "onTap": "event:addToken"
    },
    {
     "name": "retry",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 610,
     "y": 724,
     "w": 560,
     "h": 106,
     "opts": {
      "text": "Try again",
      "vicon": "refresh",
      "style": "outline"
     },
     "onTap": "event:retry"
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "login",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 1600,
     "h": 90,
     "opts": {
      "text": "Sign in with GitHub",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "qr",
     "rtype": "gpu",
     "gpu": "qr",
     "x": 610,
     "y": 290,
     "w": 520,
     "h": 520,
     "opts": {
      "text": ""
     }
    },
    {
     "name": "code",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1220,
     "y": 330,
     "w": 1400,
     "h": 140,
     "opts": {
      "text": "",
      "size": 120,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "url",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1224,
     "y": 500,
     "w": 1400,
     "h": 50,
     "opts": {
      "text": "",
      "size": 40,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "status",
     "rtype": "gpu",
     "gpu": "text",
     "x": 1224,
     "y": 580,
     "w": 1400,
     "h": 50,
     "opts": {
      "text": "",
      "size": 38,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "cancel",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 1220,
     "y": 700,
     "w": 520,
     "h": 106,
     "opts": {
      "text": "Cancel",
      "style": "outline"
     },
     "onTap": "event:cancel"
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "phone",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 1200,
     "h": 90,
     "opts": {
      "text": "Phone access",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "toggleRow",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 610,
     "y": 292,
     "w": 1100,
     "h": 120,
     "opts": {
      "items": [],
      "rowH": 120
     }
    },
    {
     "name": "url",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 450,
     "w": 1100,
     "h": 200,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim",
      "wrap": true
     }
    },
    {
     "name": "error",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 680,
     "w": 1100,
     "h": 120,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "#ffb020",
      "wrap": true
     }
    },
    {
     "name": "qr",
     "rtype": "gpu",
     "gpu": "qr",
     "x": 1900,
     "y": 220,
     "w": 600,
     "h": 600,
     "opts": {
      "text": ""
     }
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "type",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 2200,
     "h": 90,
     "opts": {
      "text": "",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "field",
     "rtype": "gpu",
     "gpu": "field",
     "x": 480,
     "y": 258,
     "w": 2360,
     "h": 96,
     "opts": {
      "text": "",
      "caret": true,
      "focus": true,
      "size": 40
     }
    },
    {
     "name": "keyboard",
     "rtype": "gpu",
     "gpu": "keyboard",
     "x": 480,
     "y": 372,
     "w": 2360,
     "h": 462,
     "opts": {
      "shift": false
     }
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "wifi",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 800,
     "h": 90,
     "opts": {
      "text": "Wi-Fi",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "subtitle",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 227,
     "w": 1400,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "allow5",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 480,
     "y": 292,
     "w": 1560,
     "h": 108,
     "opts": {
      "items": [],
      "rowH": 108
     }
    },
    {
     "name": "networks",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 480,
     "y": 412,
     "w": 1560,
     "h": 420,
     "opts": {
      "items": [],
      "rowH": 108,
      "empty": ""
     }
    },
    {
     "name": "panel",
     "rtype": "gpu",
     "gpu": "rect",
     "x": 2100,
     "y": 136,
     "w": 740,
     "h": 700,
     "opts": {
      "color": "panelTop",
      "radius": 28
     }
    },
    {
     "name": "icon",
     "rtype": "gpu",
     "gpu": "appIcon",
     "x": 2140,
     "y": 176,
     "w": 120,
     "h": 120,
     "opts": {
      "vicon": "wifi",
      "kind": "service",
      "colors": "#7a808a,#3a3f47"
     }
    },
    {
     "name": "state",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2290,
     "y": 192,
     "w": 510,
     "h": 48,
     "opts": {
      "text": "",
      "size": 38,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "info",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2290,
     "y": 248,
     "w": 510,
     "h": 40,
     "opts": {
      "text": "",
      "size": 30,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "note",
     "rtype": "gpu",
     "gpu": "text",
     "x": 2140,
     "y": 336,
     "w": 660,
     "h": 130,
     "opts": {
      "text": "",
      "size": 32,
      "font": "label",
      "align": "left",
      "color": "#ffb020",
      "wrap": true
     }
    },
    {
     "name": "power",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 2140,
     "y": 496,
     "w": 660,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "wifi",
      "style": "outline"
     },
     "onTap": "event:power"
    },
    {
     "name": "scan",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 2140,
     "y": 608,
     "w": 660,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "refresh",
      "style": "outline"
     },
     "onTap": "event:scan"
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "prefer",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 1600,
     "h": 90,
     "opts": {
      "text": "Preferred connection",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "status",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 227,
     "w": 1600,
     "h": 43,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "dim"
     }
    },
    {
     "name": "list",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 610,
     "y": 292,
     "w": 1500,
     "h": 432,
     "opts": {
      "items": [],
      "rowH": 108,
      "empty": ""
     }
    },
    {
     "name": "usbPhone",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 610,
     "y": 732,
     "w": 1500,
     "h": 108,
     "opts": {
      "items": [],
      "rowH": 108,
      "empty": ""
     }
    }
   ]
  },
  {
   "kind": "gpu",
   "name": "proxy",
   "theme": "m_red",
   "bg": "theme",
   "components": [
    {
     "name": "headerLogo",
     "rtype": "gpu",
     "gpu": "image",
     "x": 126,
     "y": 38,
     "w": 300,
     "h": 64,
     "opts": {
      "src": LOGO,
      "radius": 0
     }
    },
    {
     "name": "nav",
     "rtype": "gpu",
     "gpu": "sideNav",
     "x": 126,
     "y": 114,
     "w": 300,
     "h": 726,
     "opts": {
      "items": "Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear",
      "sel": 0
     }
    },
    {
     "name": "back",
     "rtype": "gpu",
     "gpu": "vbutton",
     "x": 480,
     "y": 138,
     "w": 96,
     "h": 96,
     "opts": {
      "text": "",
      "vicon": "back",
      "style": "round",
      "color": "#f4f7fb"
     },
     "onTap": "event:back"
    },
    {
     "name": "title",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 138,
     "w": 1600,
     "h": 90,
     "opts": {
      "text": "Proxy",
      "size": 72,
      "font": "bold",
      "align": "left",
      "color": "text"
     }
    },
    {
     "name": "rows",
     "rtype": "gpu",
     "gpu": "appList",
     "x": 610,
     "y": 292,
     "w": 1500,
     "h": 240,
     "opts": {
      "items": [],
      "rowH": 120,
      "empty": ""
     }
    },
    {
     "name": "error",
     "rtype": "gpu",
     "gpu": "text",
     "x": 610,
     "y": 570,
     "w": 1500,
     "h": 160,
     "opts": {
      "text": "",
      "size": 34,
      "font": "label",
      "align": "left",
      "color": "#ffb020",
      "wrap": true
     }
    }
   ]
  }
 ]
};
