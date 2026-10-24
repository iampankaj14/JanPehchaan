# JanPehchaan --- Complete Project Context

> **Instruction for Antigravity:** Read this document fully and use it
> as the source of truth for understanding the JanPehchaan project. For
> now, only read and understand it. Do not create, edit, or run code, do
> not generate files, do not ask questions, and do not start
> implementation unless the user explicitly asks in a later message.

## 1. Project Identity

-   **Project name:** JanPehchaan
-   **Tagline:** "Aapki Pehchaan, Aapka Adhikaar."
-   **Meaning:** A simple platform that brings family records together
    and helps people understand which welfare schemes they may qualify
    for.
-   **Project context:** A hackathon prototype for unified
    citizen/family records and accessible public documentation.
-   **Core promise:** Make family information easier to manage and make
    welfare-benefit checks easier to understand.
-   **Communication style:** Plain, simple English. Assume a person with
    no technical background should understand every screen and
    explanation quickly.

## 2. The Problem

Citizens may need to manage family details and documents across
different records, offices, or departments. This can create several
difficulties:

1.  **Scattered family records:** Information is spread across different
    documents and systems.
2.  **Confusing benefit rules:** People may not know which benefits they
    or their family could qualify for.
3.  **Repeated paperwork:** Updating details or applying for benefits
    can involve submitting the same information repeatedly.
4.  **Outdated or inconsistent records:** Names, addresses, family
    relationships, and other details may contain mistakes or may not
    reflect recent life changes.
5.  **Possible duplicate records:** Similar or overlapping records may
    need to be checked instead of being automatically treated as fraud.

These are the problem areas the prototype aims to address. Do not claim
that every government department currently shares data or that all these
issues are solved nationally.

## 3. The Proposed Solution

JanPehchaan is a unified family-record and welfare-entitlement platform
concept. It aims to:

-   Keep relevant family details together in one place.
-   Help check records for missing, inconsistent, or possibly duplicate
    information.
-   Match family details against a set of welfare-scheme rules.
-   Explain which benefits a person or household may qualify for, based
    on available information and configured rules.
-   Make it easier to review and update family details when important
    changes happen.
-   Flag doubtful records for human review instead of automatically
    rejecting an application.

**Important:** Eligibility results should be presented as guidance based
on the information and rules available in the prototype---not as an
official government approval or guarantee.

## 4. Who It Is For

### Citizens and families

People who want to organise family information and understand which
welfare benefits they may be eligible for.

### Frontline staff or authorised reviewers

People who may need to review incomplete, inconsistent, or possibly
duplicate records and resolve them fairly.

### Administrators

People who manage scheme rules, record access, and the overall system in
a future, properly authorised deployment.

For the hackathon prototype, these user types can be demonstrated with
sample accounts and synthetic data.

## 5. Main User Journey

The intended high-level workflow is:

1.  **Family Details** --- Enter or view basic family information.
2.  **Record Verification** --- Check the information for missing fields
    or inconsistencies.
3.  **Welfare Scheme Matching** --- Compare the available family details
    with the rules for selected schemes.
4.  **Benefit Eligibility** --- Show which benefits the person or
    household may qualify for and explain the reason in simple language.
5.  **Duplicate Record Review** --- Flag possible duplicates or
    conflicts for further review.

This flow is also the one used in the project presentation. Keep the
wording and order consistent unless the user asks to change it.

## 6. Core Features for the Prototype

Prioritise a small number of useful features over a large number of
unfinished features.

### A. Family profile

-   Basic family or household information.
-   Family members and their relationships.
-   Clear distinction between a benefit for an individual and one meant
    for a household or property.

### B. Record checks

-   Required-field checks.
-   Basic checks for inconsistent information.
-   Possible duplicate detection using available sample fields, such as
    similar names or matching household details.
-   Show a warning or review status rather than making a final
    accusation.

### C. Scheme matching

-   A small set of sample welfare schemes with clearly defined
    eligibility rules.
-   Match the supplied profile to the configured rules.
-   Explain the result using plain language.
-   Distinguish "may qualify based on the entered details" from
    "officially approved."

### D. Record updates

-   Allow relevant family details to be edited.
-   Make it clear when a record was updated, if this is included in the
    prototype.
-   Do not claim automatic updates from civil registries unless a real,
    authorised integration exists.

### E. Review workflow

-   Display records that need checking.
-   Give a reviewer a way to mark a record as reviewed in the prototype.
-   Do not automatically deny benefits merely because two records look
    similar.

## 7. Key Innovation and Design Principles

### Connected family records

Represent family members and relationships in a way that helps the
system consider relevant family context.

### Smart benefit matching

Match family details with relevant welfare schemes to identify suitable
benefits.

### Review, do not blindly reject

A possible duplicate or inconsistency should trigger a review, not an
automatic rejection or an assumption of fraud.

### Clear change history

Where implemented, keep a simple record of important updates so
authorised users can understand what changed.

### Individual rights and household benefits

A benefit intended for one person---such as a student benefit---should
not automatically be treated as the same as a household or
property-level grant. The rules should distinguish these categories.

### Privacy by design

Only collect the information needed for the demonstration. Avoid
exposing sensitive personal information. Use appropriate access controls
if authentication is implemented.

## 8. Technical Direction

The team has discussed the following technologies as the
intended/proposed stack:

-   **React** --- user interface.
-   **TypeScript** --- adds types to JavaScript.
-   **Tailwind CSS** --- styling and layout.
-   **Node.js** --- runtime for server-side JavaScript.
-   **Express.js** --- framework for backend routes and API requests.
-   **Supabase** --- potential database and related backend services.
-   **Firebase** --- also discussed; its exact role must be decided by
    the team.
-   **Surge** --- proposed option for frontend deployment.

Do not assume that every technology above is already integrated. Do not
add services, libraries, or integrations without checking the actual
project files or receiving instructions from the user.

### Important stack clarification

Supabase and Firebase can overlap in some areas. Before implementation,
the team should decide which service is responsible for each task. Do
not claim that both are used for the same function unless that is
intentional and implemented.

A possible division, only if the team confirms it, could be: -
Supabase/PostgreSQL for structured family and scheme data. - Firebase
only for a specific feature the team actually chooses to use. - Surge
for deploying the frontend.

Do not assume this division is final.

## 9. Hackathon Prototype Boundaries

This is a prototype, not a live government platform.

-   Use **synthetic/demo data** for the presentation.
-   Do not use real Aadhaar numbers, real citizens' private documents,
    or other sensitive personal data in the demo.
-   Do not claim access to Aadhaar, land records, civil registries, API
    Setu, or government portals unless the team has verified and
    implemented an authorised integration.
-   Do not claim that the prototype is legally certified or fully
    compliant with a law simply because privacy is a design goal.
-   If a government integration is not available, demonstrate the flow
    with sample data and clearly label it as a simulation.
-   Do not invent measured impact figures, cost savings, rejection
    reductions, or verification improvements. Any estimate must be
    clearly labelled and supported by a stated assumption or source.
-   Do not claim that the app guarantees eligibility or official benefit
    approval.

## 10. Team Roles

-   **Pankaj Kumar --- Team Leader and Backend Developer:** Coordinates
    the team and leads backend work.
-   **Ranya Bisht --- Frontend Developer:** Builds the screens and
    user-facing interactions.
-   **Ayush Pal --- UI/UX Designer:** Designs the layout, flow, and
    usability of the experience.
-   **Shubham Kumar --- QA Tester:** Checks the main features, finds
    issues, and verifies prototype behaviour.

Team members should coordinate decisions and keep the prototype scope
realistic for the hackathon timeframe.

## 11. Presentation Language and Visual Direction

Use simple English and short sentences throughout the app and
presentation.

Preferred examples: - "Family Records in One Place" - "Find Benefits You
May Qualify For" - "Check Records" - "Needs Review" - "Possible
Duplicate" - "Update Family Details"

Avoid technical phrases in citizen-facing screens unless they are
explained in plain language. Avoid overpromising terms such as "zero
paperwork," "automatic government verification," or "guaranteed
benefits" unless they are genuinely supported.

### Brand direction

-   **Name:** JanPehchaan
-   **Tagline:** "Aapki Pehchaan, Aapka Adhikaar."
-   **Visual identity:** Clean white backgrounds, deep navy headings,
    and restrained saffron/orange and green accents.
-   Keep the UI professional, accessible, uncluttered, and easy to
    understand.

## 12. What Success Looks Like for the Demo

A judge or first-time user should be able to understand the idea quickly
and complete a simple journey:

1.  Open a sample family profile.
2.  Review family details.
3.  Run record checks.
4.  See relevant sample welfare schemes and a plain-language explanation
    of the match.
5.  See a possible duplicate or inconsistent record marked for review.
6.  Understand that the system supports people and reviewers---it does
    not make final government decisions.

## 13. Instructions for Antigravity

For this first step:

1.  Read this entire file.
2.  Understand the product purpose, intended users, main workflow,
    boundaries, team roles, and proposed technical direction.
3.  Do **not** create or edit any code or files.
4.  Do **not** install dependencies, run commands, deploy anything, or
    make external integrations.
5.  Do **not** invent missing features or treat proposed technologies as
    confirmed implementations.
6.  Wait for the user's next instruction.

When implementation is requested later, inspect the existing project
before proposing or changing anything. Keep changes aligned with this
document and ask a concise question only if a decision is essential.
