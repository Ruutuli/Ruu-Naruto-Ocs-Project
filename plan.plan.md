<!-- e41a37c8-72d6-46aa-92a2-ae1db29f7f6c e699e5ec-cd96-4592-a309-ce24ea7fc13d -->
# Comprehensive Field Visibility Check and Fix Plan

## Goal

Verify and ensure ALL fields from `defaultOC` (data/default-data.js) are visible and properly displayed in the OC detail view, not just present in code.

## Methodology

1. Systematically go through every field in defaultOC
2. Check if field is visible in detail view (not just in code)
3. Identify fields that are hidden, conditionally rendered, or poorly organized
4. Create proper sections for better visibility
5. Ensure all fields display even when empty (with appropriate placeholders)

## Field Categories to Verify

### 1. Basic Information (9 fields)

- [ ] `id` - Currently: Used in edit button ✓
- [ ] `lastName` - Currently: Name card ✓
- [ ] `firstName` - Currently: Name card ✓
- [ ] `nameJapanese` - Currently: Name card (conditional) ✓
- [ ] `lastNameMeaning` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `firstNameMeaning` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `nameMeaning` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `aliases` - Currently: Info-grid ✓
- [ ] `profileImage` - Currently: Profile image ✓

### 2. Debut Information (6 fields)

- [ ] `debut.manga` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `debut.anime` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `debut.novel` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `debut.movie` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `debut.game` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `appearsIn` - Currently: Info-grid (conditional) - NEEDS CHECK

### 3. Personal Information (8 fields)

- [ ] `dob` - Currently: Info-grid ✓
- [ ] `ageByEra` (5 eras) - Currently: Info-grid with era support ✓
- [ ] `bloodType` - Currently: Info-grid ✓
- [ ] `gender` - Currently: Info-grid ✓
- [ ] `sexualOrientation` - Currently: Combined in orientation - NEEDS CHECK
- [ ] `romanticOrientation` - Currently: Combined in orientation - NEEDS CHECK
- [ ] `zodiac` - Currently: Info-grid (conditional) - NEEDS CHECK

### 4. Family Information (4 fields) - MISSING DEDICATED SECTION

- [ ] `family.father` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `family.mother` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `family.siblings` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `family.otherRelatives` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION

### 5. Physical Appearance (12+ fields) - SCATTERED, NEEDS ORGANIZATION

- [ ] `identifyingInfo.bodyType` - Currently: Info-grid ✓
- [ ] `heightByEra` (5 eras) - Currently: Info-grid with era support ✓
- [ ] `weightByEra` (5 eras) - Currently: Info-grid with era support ✓
- [ ] `eyeColor` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `hairColor` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `distinguishingFeatures` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `appearance.image` - Currently: Appearance section ✓
- [ ] `appearance.colors` - Currently: Appearance section ✓
- [ ] `appearance.gear` - Currently: Appearance section ✓
- [ ] `appearanceByEra` (5 eras × 4 fields) - Currently: Nested in appearance (conditional) - NEEDS DEDICATED SECTION

### 6. Affiliations (11 fields) - SCATTERED, NEEDS ORGANIZATION

- [ ] `village` - Currently: Badges only - NEEDS TEXT LIST IN SECTION
- [ ] `clanId` - Currently: Badges only - NEEDS TEXT LIST IN SECTION
- [ ] `clanName` - Currently: Badges only - NEEDS TEXT LIST IN SECTION
- [ ] `rank` - Currently: Badges + info-grid - NEEDS CONSOLIDATION
- [ ] `classification` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `ninjaRegistrationNumber` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `teamNumber` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `teammates` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `sensei` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `academyGraduationAge` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `madeGenin` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION
- [ ] `madeChunin` - Currently: Info-grid (conditional) - NEEDS DEDICATED SECTION

### 7. Abilities & Powers (30+ fields)

- [ ] `natureType` - Currently: Info-grid ✓
- [ ] `kekkeiGenkai` - Currently: Info-grid (conditional) - NEEDS CHECK
- [ ] `abilities.*` - Currently: Abilities section ✓
- [ ] `chakraPhysicalProwess.*` - Currently: Abilities section ✓
- [ ] `dojutsu.*` - Currently: Abilities section ✓
- [ ] `intelligence.*` - Currently: Abilities section ✓
- [ ] `stats.*` - Currently: Stats section ✓
- [ ] `statsByEra.*` - Currently: Stats section ✓

### 8. Combat Information (7 fields)

- [ ] `battleStrategy.*` - Currently: Battle strategy section ✓
- [ ] `missions.*` - Currently: Info-grid ✓

### 9. Personality (15+ fields)

- [ ] `personality.likes` - Currently: Known behavior section ✓
- [ ] `personality.dislikes` - Currently: Known behavior section ✓
- [ ] `personality.demeanor.*` - Currently: Demeanor section ✓
- [ ] `fears` - Currently: Known behavior section ✓
- [ ] `moralAlignment` - Currently: Known behavior section ✓
- [ ] `mbti` - Currently: Known behavior section ✓
- [ ] `enneagram` - Currently: Known behavior section ✓

### 10. Background & History (3+ fields)

- [ ] `recordHistory.*` - Currently: Record history section ✓
- [ ] `relationships` - Currently: Relationships section ✓
- [ ] `storyArcs.*` - Currently: Story arcs section (conditional) - NEEDS CHECK

### 11. Other Media (5 fields)

- [ ] `otherMedia.*` - Currently: Other media section (conditional) - NEEDS CHECK

### 12. Miscellaneous (5 fields)

- [ ] `themeSong` - Currently: Miscellaneous section ✓
- [ ] `themeSongLink` - Currently: Miscellaneous section ✓
- [ ] `voiceActors.*` - Currently: Miscellaneous section ✓
- [ ] `quotes` - Currently: Miscellaneous section ✓
- [ ] `trivia` - Currently: Miscellaneous section ✓
- [ ] `gallery` - Currently: Gallery section (conditional) - NEEDS CHECK

## Implementation Tasks

### Phase 1: Audit Current State

1. Read through renderIdentifyingInfo() function and document all fields currently displayed
2. Check renderOCDetail() main template to see all sections rendered
3. Compare against defaultOC template field by field
4. Create comprehensive list of: visible fields, hidden fields, conditionally rendered fields
5. Identify fields that exist in code but are never shown due to conditions

### Phase 2: Create Missing Sections

1. Create renderFamily() function - displays father, mother, siblings, otherRelatives in organized format
2. Add collapsible Family section after Relationships section in main template
3. Create renderPhysicalAppearance() function - displays bodyType, eyeColor, hairColor, distinguishingFeatures
4. Add collapsible Physical Appearance section after Family section
5. Create renderAppearanceByEra() function - extract from current appearance section
6. Add collapsible Appearance by Era section after Physical Appearance section
7. Create renderAffiliations() function - displays village, clan, rank, classification, ninjaRegistrationNumber, teamNumber, teammates, sensei, academyGraduationAge, madeGenin, madeChunin
8. Add collapsible Affiliations section after Appearance by Era section

### Phase 3: Fix Conditional Rendering

1. Update Family section to always show (with "No family information recorded" if empty)
2. Update Physical Appearance section to always show (with placeholders for empty fields)
3. Update Appearance by Era section to always show header (with "No appearance data by era" if empty)
4. Update Affiliations section to always show (with placeholders for empty fields)
5. Review all other conditional sections (storyArcs, otherMedia, gallery) to ensure they show when empty
6. Remove conditional hiding logic that prevents sections from appearing

### Phase 4: Reorganize Existing Fields

1. Remove family fields (lines 806-813) from renderIdentifyingInfo()
2. Remove physical appearance fields (eyeColor, hairColor, distinguishingFeatures, bodyType) from renderIdentifyingInfo()
3. Remove affiliation fields (classification, ninjaRegistrationNumber, teamNumber, teammates, sensei, academyGraduationAge, madeGenin, madeChunin) from renderIdentifyingInfo()
4. Remove appearanceByEra rendering from appearance-section (lines 141-167)
5. Keep only core identifying info in renderIdentifyingInfo(): aliases, name meaning, dob, zodiac, age, bloodType, gender, orientation, natureType, kekkeiGenkai, debut, appearsIn, height, weight, missions

### Phase 5: Verify All Fields

1. Create systematic checklist going through every field in defaultOC
2. For each field, verify it appears in detail view
3. Test with OC that has all fields filled
4. Test with OC that has all fields empty
5. Document any fields that still don't appear
6. Update FIELD_CHECKLIST.md with actual visibility status (mark fields as visible/not visible)
7. Fix any remaining missing fields

## Files to Modify

- `components/oc-detail.js` - Main detail view component
- `FIELD_CHECKLIST.md` - Update with actual visibility status

## Success Criteria

- Every field from defaultOC is visible in detail view
- Fields are organized into logical, collapsible sections
- Empty fields show appropriate placeholders, not hidden
- All sections are easily discoverable

### To-dos

- [ ] Create renderFamily() function and add collapsible Family section after Relationships
- [ ] Create renderPhysicalAppearance() function and add collapsible Physical Appearance section
- [ ] Extract appearanceByEra rendering into renderAppearanceByEra() function and make it a dedicated collapsible section
- [ ] Create renderAffiliations() function and add collapsible Affiliations section with all affiliation details
- [ ] Remove family, physical appearance, and affiliation fields from renderIdentifyingInfo() to avoid duplication

