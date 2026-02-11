# HypeShelf - Shared Recommendations Hub

## Project Overview
Create "HypeShelf" — a simple app where users can log in and share their favorite movies in one clean, public shelf.

**Tagline**: "Collect and share the stuff you're hyped about."

## Tech Stack
- **Frontend**: Next.js (App Router)
- **Authentication**: Clerk
- **Backend**: Convex
- **Language**: TypeScript

## Requirements

### 1. Public Page

**Goal**: Allow users to view a public list of recommendations.

- Display a small, read-only list of the latest public recommendations pulled from Convex.
- Show a **"Sign in to add yours"** button wired to Clerk for authentication.
  
### 2. Authenticated Experience

**Goal**: Provide a personalized experience for authenticated users.

- **Authentication**: Only signed-in users can add and delete recommendations.
  
**Recommendation Fields**:
- Title
- Genre (e.g., horror, action, comedy, etc.)
- Link to the movie (URL)
- Short blurb describing the recommendation

**User Features**:
- See who added each recommendation.
- Display a list of all recommendations made by users.
- Ability to filter recommendations by genre (e.g., action, comedy).

### 3. Roles & Rules

**Goal**: Implement role-based access control for two roles: admin and user.

#### Admin Role:
- Can **delete any recommendation**.
- Can **mark a recommendation as "Staff Pick"**.

#### User Role:
- Can **create** recommendations.
- Can **delete only their own recommendations**.

### 4. Security Considerations
- Implement role-based access control with best practices to ensure that users can only perform actions permitted by their role.

### 5. UX/UI

- Minimal, clean layout.
- Easy-to-use interface with intuitive navigation.
- Clear distinctions between public and authenticated experiences.
- Filter recommendations by genre for easy browsing.

### 6. Documentation & Code Structure

- Ensure clear and understandable code structure.
- Provide appropriate comments and documentation explaining your decisions and design choices.
- Ensure that the code is security-minded, following best practices in authentication and role management.

---

## Evaluation Criteria

- **Code Structure & Clarity**: Organize your code in a clean and understandable manner.
- **Security**: Implement robust role-based access control and secure authentication.
- **UX & Practicality**: Prioritize usability and minimalism in the design.
- **Documentation & Reasoning**: Provide sufficient explanations for design decisions and code choices.
