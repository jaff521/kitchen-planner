# Kitchen Layout Planner Design Spec

## Overview
A mobile application built on `uni-app` (Vue 3) that allows users to create simple kitchen floor plans by dragging and dropping predefined modules (sinks, slop buckets, worktables, etc.) into a canvas area. The canvas automatically scales modules to fill a horizontal space perfectly. The layouts are submitted to a `uniCloud` backend where food safety/hygiene supervisors can review and approve/reject them via a `uni-admin` desktop dashboard.

## Context
Target Users: Restaurant owners or food business applicants who need to submit a kitchen layout plan.
Business Goal: Streamline the layout planning process for food business licenses/supervision on mobile and allow food safety/hygiene supervisors to centrally review and approve/reject layouts with specific reasons in a standard admin backend.

## Architecture

### Frontend (Mobile App via uni-app)
- **Framework:** Vue 3 Composition API in uni-app.
- **State Management:** Pinia to locally track modules dropped onto the canvas.
- **Layout Approach:** Split-screen layout. Top 60% is the Design Canvas; Bottom 40% is the scrollable Module Tray.

### Backend (uniCloud serverless ecosystem)
- **Database (`uniCloud-JQL`):** Stores `users` (managed by `uni-id`) and `floorPlans`.
- **Admin Portal:** Uses `uni-admin` (Vue 3 PC template) linked to the same uniCloud instance to manage users and review submitted floor plan records.

## Components & Data Flow

### 1. Module Tray (`ModuleTray.vue`)
- Displays fixed mock units representing kitchen fixtures.
- Intercepts touch events (`@touchstart`, `@touchmove`, `@touchend`) to generate a "ghost" element under the user's finger.

### 2. Design Canvas & Auto-Scale Logic (`DesignCanvas.vue`)
- The canvas acts as the drop target.
- **Auto-Scale Magic:** When a user drops a unit into the canvas, it pushes an object into a Pinia array.
- The canvas renders a row using CSS Flexbox. Elements are assigned responsive `flex-grow` attributes (or percentage constraints based on base sizing scales). 
- Because the canvas is `display: flex; width: 100%`, adding modules smoothly compresses existing modules horizontally so the rectangle is always 100% perfectly filled instantly, preventing spacing gaps or complex absolute positioning math.

### 3. Submission & Error Handling
- **Constraint:** We will enforce a sane maximum number of modules per row (e.g. 5 or 6 units) so it doesn't scale down to unreadable sizes.
- **Validation:** Attempting to submit requires at least 1 module to be in the canvas.
- **Data Payload:** 
  ```json
  {
    "user_id": "xxx",
    "layout_data": [
      { "type": "sink", "order": 1, "width_weight": 1 },
      { "type": "worktable", "order": 2, "width_weight": 2 }
    ],
    "status": "pending",
    "reject_reason": "",
    "created_at": 1700101010
  }
  ```

### 4. Admin Review Dashboard
- Supervisors log into the `uni-admin` PC web interface.
- Navigate to "Floor Plan Approvals" table view to see pending applications from restaurant owners.
- Supervisors can preview the submitted sequential module list and layout data.
- Supervisors update the document's `status` to `approved` or `rejected`, and MUST provide a "reason string" (e.g., "Missing slop bucket", "Layout violates health code") if rejected.

## Verification & Testing
1. **Touch Responsiveness:** Test dragging on physical iOS and Android devices via uni-app companion to ensure touch-coordinates translate accurately without scrolling the window.
2. **Auto-Fill Edge Cases:** Verify behavior when adding massive amounts of items or deleting down to 1 item.
3. **Database Write Rules:** Ensure normal users can only insert their own `floorPlans` and cannot overwrite others' (uni-id `uid` bound roles). Admin accounts can update all `floorPlans`.
