# MADLABS Home Page Content Guide

**Date:** 2026-04-16  
**Purpose:** Define what the MADLABS home page should contain, and compare it with the current implementation.

---

## 1. Why This Document

Current home UI still contains legacy "ASTRONAV 3D" branding and messaging.  
This guide aligns the homepage with MADLABS identity and product goals.

---

## 2. Current State (Existing UI Audit)

### Existing files powering home page

1. `src/App.tsx`  
   - Routes `/` to home and `/login` to login.
2. `src/components/HomePage.tsx`  
   - Renders 3D scene + HTML overlay.
3. `src/components/Overlay.tsx`  
   - Contains navbar, hero text, sections, buttons (main visible content).

### Current visible sections in home page

1. Fixed top navbar (`ASTRONAV 3D`, Home/Explore/Projects/Features/Blog/Contact, Get Started)
2. Hero section (`NAVIGATE THE FUTURE OF 3D TECHNOLOGY`)
3. Services section (3D Modeling, VR, Game Dev, UI/UX)
4. Capabilities section (engineering standards with progress bars)
5. CTA section ("Ready to ignite?")

### Main gap

- Brand and content are not MADLABS-specific; they read like a 3D template/demo product.

---

## 3. What MADLABS Home Page Should Include

Recommended high-level structure:

1. **Navbar**
   - Logo: MADLABS
   - Links: Home, Services, Work, Process, About, Contact
   - Primary CTA: "Start a Project" or "Book a Call"

2. **Hero**
   - Clear value proposition:
     - What MADLABS does
     - Who it serves
     - Why it is different
   - CTAs:
     - Primary: "Start a Project"
     - Secondary: "View Work"

3. **Services**
   - 3-6 service cards with clear outcomes
   - Example: Web Apps, AI Features, Product Design, Cloud Deployment

4. **Featured Work / Case Studies**
   - 2-4 highlighted projects with:
     - Problem
     - Solution
     - Outcome/metrics

5. **Process / Delivery Model**
   - Discovery -> Design -> Build -> Launch -> Support
   - Build trust through transparency

6. **Proof / Trust Signals**
   - Testimonials, client logos, key metrics, delivery stats

7. **Final CTA + Contact**
   - Short conversion block
   - CTA: "Book discovery call" / "Send project brief"

8. **Footer**
   - Contact details, social links, legal links

---

## 4. Content Direction (Copy Style)

Guidelines:

1. Use practical, outcome-focused messaging.
2. Avoid generic futuristic wording unless tied to real service value.
3. Keep tone professional, confident, and clear.
4. Prioritize customer problems and business results over visual buzzwords.

Example hero direction:

- **Headline:** "We build fast, scalable digital products for growing teams."
- **Subtext:** "MADLABS designs and engineers web platforms, internal tools, and AI-enabled workflows from idea to launch."

---

## 5. Brand Alignment Checklist

Before finalizing homepage content, verify:

1. No legacy names (e.g., ASTRONAV) remain.
2. Navbar and hero communicate MADLABS value clearly.
3. Services reflect actual MADLABS offerings.
4. At least one trust/proof section exists.
5. Primary CTA appears in navbar, hero, and footer.
6. Home page language matches login page and other routes.

---

## 6. Mapping: Current -> Target

| Current Section | Keep / Replace | Target Direction |
|---|---|---|
| ASTRONAV Navbar | Replace | MADLABS navbar + service-focused nav links |
| 3D Hero Copy | Replace | MADLABS value proposition + project-oriented CTA |
| Services Grid | Keep structure, replace content | Real MADLABS services and outcomes |
| Capabilities Block | Keep concept, rewrite | MADLABS process/engineering quality section |
| Final CTA | Keep concept, rewrite | Conversion CTA tied to inquiry/contact |

---

## 7. Recommended Next Implementation Order

1. Replace navbar brand and navigation labels.
2. Replace hero headline/subtext/buttons.
3. Rewrite services cards with MADLABS offerings.
4. Convert capabilities block into "How We Work".
5. Update final CTA to contact/lead-gen action.
6. Add footer with real contact links.

---

## 8. Acceptance Criteria for Home Page Update

1. No legacy brand text remains in `Overlay.tsx`.
2. All top-level sections reflect MADLABS business context.
3. CTA flow from home page to contact/login is clear.
4. UI remains responsive on desktop and mobile.
5. Visual style stays consistent across `/` and `/login`.

---

## 9. Related Files

- `src/components/Overlay.tsx` (primary homepage content)
- `src/components/HomePage.tsx` (home page 3D + overlay wrapper)
- `src/components/LoginPage.tsx` (should stay stylistically aligned)
- `src/App.tsx` (route entry points)
