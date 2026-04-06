# OSITrac API Reference
**Base URL:** https://imt.ositrac.com
**Auth:** Cookie-based session (login via /login). All requests require an active browser session.
**User context:** username=mgovan, auditorId=9, userId=34770

---

## Authentication

### Get Current User
GET /userinfo
Returns: { name, displayName, email, givenName, roles, upn, userId, canAccessDashboard, isExternalUser }
Example response: { "displayName": "Marcel Govan", "roles": ["Survey Consultant"], "userId": 34770, "isExternalUser": true }

### Common Credentials
GET /CommonCred
Returns shared credential/config data used app-wide.

---

## Dashboard

### Main Dashboard Summary
GET /auditordashboard/{username}/{auditorId}
Example: GET /auditordashboard/mgovan/9
Returns: { totalNumberOfOrders, workableInventory, noRecordSelected, writeupPiRFCOver24Hours, newInventory, todayInventory, appointmentOlderThanToday, ordersPastDueDate, workOrdersWithNoPR, daysInWhichNoPRExists, withRushRetryReopen, overDueActions, unReviewedRecords, orders[] }
orders[] aging buckets: { category, categoryID, platinum, gold, silver, totalOfCategory }
Categories: ">=60 Days Past Due" | "1-59 Days Past Due" | "0-9 Days To Due" | "10-29 Days To Due" | "30+ Days To Due"

Sample values (2026-03-30): totalNumberOfOrders=19, workableInventory=18, ordersPastDueDate=4, workOrdersWithNoPR=2

---

### Inventory Life Cycle Chart
GET /auditordashboard/getInventoryLifeCycle/{username}/{auditorId}
Example: GET /auditordashboard/getInventoryLifeCycle/mgovan/9
Returns: { inventory: [{ item1: stageName, item2: count, item3: "I", item4: 0 }] }

Stages (sample counts 2026-03-30):
  "Assigned, 0 Call"      → 3
  "Assigned, 1 Call"      → 0
  "Assigned, 2+ Calls"    → 4
  "Escalated to Agent/UW" → 1
  "Scheduled"             → 2
  "Write-Up"              → 5
  "Review"                → 4
  "RFC"                   → 0
  "Suspended"             → 0

NOTE FOR ELLA: item1 = stage name, item2 = count of orders in that stage.
Click a bar → filter orders by that stage using POST /woids with adStatusTypes filter.

---

### Week-To-Date Performance
GET /auditordashboard/getwtdperformance/{username}/{auditorId}?date={date}
Example: GET /auditordashboard/getwtdperformance/mgovan/9?date=Sun%20Mar%2029%202026
Date format: URL-encoded full date string e.g. Sun%20Mar%2029%202026
Returns: { closeOutPercentage, timeServicePercentage, workordersBilled, production, totalIncentive, asOfDate, prodHrs, qualityPercentage, timeServiceBonus, qualityBonus, totalBonus, biWeeklyBonus }

---

### Current Pay Cycle
GET /auditordashboard/GetCurrentPayCycle
Returns: [{ payPeriodID, weekStart, weekEnd, weekNumber }]
Current: payPeriodID=58, weekStart=2026-03-29T00:00:00, weekEnd=2026-04-04T00:00:00, weekNumber=2

---

### Employee Hierarchy
GET /auditordashboard/getEmployeeHierarchy/{username}/{auditorId}
Example: GET /auditordashboard/getEmployeeHierarchy/mgovan/9

### Notifications
GET /auditordashboard/notification/getall/{auditorId}/{username}
Example: GET /auditordashboard/notification/getall/9/mgovan

### Overdue Action Count
GET /auditordashboard/overDueCount/{username}/{auditorId}
Example: GET /auditordashboard/overDueCount/mgovan/9

---

## Orders / Queue

### List All Work Orders
POST /woids?sortParam={field}&ascending={bool}&activeWoidsOnly={bool}&viewAs={auditorId}
Example: POST /woids?sortParam=DaysAssigned&ascending=true&activeWoidsOnly=false&viewAs=9

Request body (filter criteria object):
{
  "adStatusTypes": [],           // stage filter e.g. ["I"] for Assigned
  "dueDateRangeStart": -75,      // days relative to today
  "dueDateRangeEnd": 75,
  "businessUnits": [],           // carrier filter
  "productLines": [],            // product line filter
  "woStatusTypes": ["In Process"],
  "isDueDate": true,
  "ageRangeStart": -120,
  "ageRangeEnd": 120,
  "isIncludeInactive": false,
  "serviceLevel": []
}

Sort param options: DaysAssigned | DaysUntilDue | Insured | WFStatus
Returns: Array of work orders
Grid columns: WOID | BizUnit Name | Days Until Due | Insured | Product | WF Status/Days in Status | Days Since Last Act. | Address | Coverage | Service Level | Days Assn

---

### Orders Grid Configuration
POST /woids/gridInfo?viewAs={auditorId}&tenant=osi
Example: POST /woids/gridInfo?viewAs=9&tenant=osi
Returns column configuration and display settings.

---

### Get Saved Filters
GET /filter/{username}/{auditorId}/osi
Example: GET /filter/mgovan/9/osi
Returns: [{ orderSearchFilterId, systemUserId, filterName, isDefault, filterCriteria }]
NOTE: filterCriteria is a JSON-encoded string — use JSON.parse() on it before using as POST body for /woids

Sample filter "Surveys To Schedule":
  filterCriteria: { adStatusTypes:[], dueDateRangeStart:-75, dueDateRangeEnd:75, woStatusTypes:["In Process"], isDueDate:true }

---

## Order Detail

### General Info (Full Order Record)
GET /orders/{woid}/generalinfo
Example: GET /orders/64280072/generalinfo
Top-level response keys: woId, prodTypeId, policies, generalInfo, insuredInfo, recLoInfo, agentInfo, otherInfo, undwrInfo, policyInfo, inspectionDetail, isAssist, orderedBy, atmsTextSetting, insuredPortalRedirectURL, revisedDueDateLink, duplicateWoid

--- insuredInfo (KEY SCHEDULING FIELDS) ---
  name1         → insured full name  e.g. "VENUGOPALA RAO KONDAPAVULURI DEVI MADHAVI KONDAPAVULURI"
  name2         → secondary name
  addressLine1  → street address     e.g. "10678 E SAN SALVADOR DR"
  addressLine2  → unit/apt
  city          → city               e.g. "SCOTTSDALE"
  state         → state              e.g. "AZ"
  zip           → zip code           e.g. "85258"
  contactName1  → contact name
  mainPhone     → primary phone      e.g. "(480)467-8851"
  cellPhone     → mobile             e.g. "(480)467-8851"
  fax           → fax number
  email         → email address
  insuredCounty → county             e.g. "Maricopa"

--- generalInfo (order metadata) ---
  woid                → work order ID number
  workOrderType       → "Normal" | "Rush" | etc.
  workOrderTypeId     → numeric ID
  serviceLevel        → "Normal" | "Rush" | etc.
  serviceLevelId      → numeric ID (11=Normal)
  productLine         → "High Value" | "Course of Construction" | "USAA Intermediate High Value"
  productLineId       → numeric ID (122=High Value)
  businessUnit        → carrier name e.g. "Auto-Owners Insurance"
  bizUnitId           → e.g. 1057122
  bizUnitType         → full business unit name
  receivedDate        → ISO datetime order was received
  dueDate             → ISO datetime inspection deadline
  lastProgRpt         → ISO datetime of last progress report
  auditCompletionDate → completion date (null if open)
  woStatus            → "In Process" | "Completed" | etc.
  woStatusId          → status code string
  adStatusId          → short code: "CA"=Confirmed Appt, "A"=Assigned, "S"=Scheduled, "WU"=Write-Up, "R"=Review
  isVoid              → boolean
  frepName            → assigned inspector full name
  accountManagerName  → account manager name
  prodTypeId          → product type ID (4=survey)
  daysInStatus        → human-readable e.g. "3 Days in Status"
  specialInstructions → sq ft, year built, occupancy type from carrier

--- policies[] ---
  policyNumber, policyPeriodStartDate, policyPeriodEndDate, policyType, estHouseValue, surveyReasonId

---

### Order Timeline / History
GET /orders/{woid}/timeline
Example: GET /orders/64280072/timeline
Returns chronological history of all status changes and actions on the order.

---

### Documents List
GET /documents/{woid}/documentlistpace
Example: GET /documents/64280072/documentlistpace
Returns all documents attached to the work order (photos, reports, etc.)

---

### Prior Report
GET /reference/{woid}/getPriorReport
Example: GET /reference/64280072/getPriorReport
Returns prior inspection/survey report data if a previous inspection exists.

---

### Special Letters
GET /specialletter/woid/{woid}
Example: GET /specialletter/woid/64280072
Returns special letter templates or previously sent letters for the order.

---

### Truepic Automation Status
GET /orders/{woid}/getTruepicAutomation
Example: GET /orders/64280072/getTruepicAutomation
Returns 204 No Content if Truepic not configured. Returns automation data when active.

---

### Related Product Lines (for BizUnit)
GET /orders/relatedprodlines/{bizUnitId}
Example: GET /orders/relatedprodlines/1057122
Returns product lines available for a given business unit/carrier.

---

### Progress Report Types (for Product Line)
GET /progressreporttypes/{productLineId}
Example: GET /progressreporttypes/122  (High Value = productLineId 122)
Returns progress report type options available for that product line.

---

### Application URLs
POST /orders/getApplicationURLs
Returns URLs for linked external applications (Survey Hub, ATMS, etc.)

---

## Text / SMS

### Get WOIDs by Phone Number
GET /text/woidsbypreferredtextnumber/{phone}?excludeConfirmedAppt={bool}
Example: GET /text/woidsbypreferredtextnumber/(480)467-8851?excludeConfirmedAppt=true
Use excludeConfirmedAppt=true to exclude already-confirmed appointments.
Returns: Array of WOIDs associated with that phone number.
Use this before scheduling to prevent double-booking the same insured.

---

## Actions

### Action Status Count
GET /action/status/1/count
Returns count of pending/open actions.

### Past Due Actions
GET /action/pastdue?allactions={bool}&woid={id}&page={n}&pagesize={n}&myaction={bool}
Example: GET /action/pastdue?allactions=false&woid=0&page=0&pagesize=20&myaction=true
Returns paginated list of overdue action items assigned to current user.

### Upcoming Actions
GET /action/upcoming?allactions={bool}&woid={id}&page={n}&pagesize={n}&myaction={bool}
Example: GET /action/upcoming?allactions=false&woid=0&page=0&pagesize=20&myaction=true
Returns paginated list of upcoming action items.

---

## Agenda / Calendar

### Get Agenda Appointments
GET /agenda/username/{username}/agenda?date={date}
Example: GET /agenda/username/mgovan/agenda?date=Mon%20Mar%2030%202026
Date format: URL-encoded full date string e.g. Mon%20Mar%2030%202026
Returns: Array of appointment objects for that day. Returns [] if no appointments.
USE BEFORE SCHEDULING: Check this first to see what time slots are already taken.

### Get External Agenda URL
GET /app/getagendaimturl
Returns: { "url": "https://agenda.ositrac.com/" }
The external agenda portal URL.

### Available Auditors for Scheduling
GET /schedule/auditors
Returns list of auditors available for scheduling assignment. Returns [] when none configured.

---

## Library

### Library Folder Structure
GET /library/getlibraryDetails/
Returns: Array of top-level folder nodes
[
  { "label": "High Value",   "data": "\High Value",   "leaf": false },
  { "label": "IMT",          "data": "\IMT",          "leaf": false },
  { "label": "Risk Control", "data": "\Risk Control", "leaf": false },
  { "label": "Survey Hub",   "data": "\Survey Hub",   "leaf": false }
]
Use data field as path for drilling into subfolders.

---

## Message Center

GET /messagecenter
Returns internal message center data and unread messages.

---

## Reference / Lookup Data

These are static lookup tables — fetch once and cache at session start.

GET /wotypes                       → Work order types (5): Normal, Rush, etc.
GET /woservicelvltypes             → Service level types (10): Rush, Normal, etc.
GET /progressreporttypes           → All progress report codes (122 entries)
GET /surveyreasontypes             → Survey reason types (8): New Business, Renewal, etc.
GET /workorders/businessentitytypes → Business entity types
GET /preorders/prodlines           → Pre-order product lines
GET /workorders/activeprodlines    → Active product lines only
GET /app/states/all                → All US states list
GET /app/buckets/all               → Bucket category list
GET /app/branches/all              → Branch office list
GET /app/representatives/all       → All field representatives
GET /repbucket/getFrepClassifications → FREP classification types

---

## Cache / Session (Internal — not needed for automation)

GET /app/getcache/{username}              → Get user UI cache
GET /app/setcache/{username}/{timestamp}  → Set user UI cache

---

## ELLA QUINN — Scheduling Automation Quick Reference

Minimum API calls needed to automate scheduling:

STEP 1 — Get inventory snapshot:
  GET /auditordashboard/getInventoryLifeCycle/mgovan/9
  → inventory[n].item1 = stage name
  → inventory[n].item2 = count

STEP 2 — List orders in target bucket (e.g. "Assigned, 0 Call"):
  POST /woids?sortParam=DaysAssigned&ascending=true&activeWoidsOnly=false&viewAs=9
  Body: { "adStatusTypes": ["I"], "woStatusTypes": ["In Process"], "isIncludeInactive": false }

STEP 3 — Get full details for each WOID:
  GET /orders/{woid}/generalinfo
  Key fields to extract:
    insuredInfo.name1          → insured full name
    insuredInfo.addressLine1   → street address
    insuredInfo.city           → city
    insuredInfo.state          → state
    insuredInfo.zip            → zip code
    insuredInfo.mainPhone      → primary phone number
    insuredInfo.cellPhone      → mobile/cell phone
    insuredInfo.email          → email address
    generalInfo.dueDate        → inspection deadline (ISO datetime)
    generalInfo.productLine    → inspection type (High Value, etc.)
    generalInfo.serviceLevel   → service level (Normal, Rush, etc.)
    generalInfo.adStatusId     → current status code
    generalInfo.businessUnit   → carrier name

STEP 4 — Check for existing appointments on that phone:
  GET /text/woidsbypreferredtextnumber/{mainPhone}?excludeConfirmedAppt=true
  If returns non-empty array → phone already has open orders, check for conflicts

STEP 5 — Check calendar availability:
  GET /agenda/username/mgovan/agenda?date={URLencodedDate}
  Returns [] if day is clear, otherwise shows booked appointments

STEP 6 — Record outcome (progress report):
  Endpoint TBD — requires capturing form submit from browser session

---

## adStatusId Quick Reference

  A   → Assigned (no calls made)
  I   → Assigned (with calls — maps to "Assigned, 0 Call" / "1 Call" / "2+ Calls")
  S   → Scheduled
  CA  → Confirmed Appointment
  WU  → Write-Up
  R   → Review
  RFC → Returned for Correction
  SUS → Suspended
  E   → Escalated to Agent/UW

---

*Generated by NEXA AI — Live capture from imt.ositrac.com on 2026-03-30*
*All endpoints confirmed working with Marcel Govan session (auditorId=9)*
