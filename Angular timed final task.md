# Timed Personal Kanban
## Objective
Build a **clean, single-user Kanban board** with drag-and-drop and basic time tracking.
## Core Requirements

### 1. User Onboarding
-   When user opens the app for the first time:
    -   Ask for user's **name**
    -   Store it locally
-   Skip this step on future visits
----------
## Project System
### 2. Project List Page (Home)
This is the **main landing page after onboarding**
Display:
-   List of all projects
-   Each project should show:
    -   Project name
    -   Total number of tasks
    -   Number of columns in that project
----------

### 3. Create New Project
-   Input: **Project name only**
-   On create:
    -   Navigate to that project’s Kanban board
## Kanban Board (Per Project)
### 1. Default Columns
The app should start with these default columns:
```
Todo → Working → Testing → Review → Actual Testing → Completed
```
----------
### 2. Custom Columns
-   User can **add new columns**
-   Columns should appear in the board flow
-   Delete/Edit any column excluding `todo` and `completed`
- Deleting a column with existing tasks should have a way to move those tasks to another column or move them into a new column.  
----------
### 3. Tasks
Each task should:
-   Have a title
-   Be draggable across columns
- - Be deletable
----------
### 4. Drag & Drop
-   Tasks must be movable between columns using drag and drop
-   Movement should feel smooth and intuitive
----------
### 5. Time Tracking (Key Feature)
Track how long each task spends in each column:
-   When a task enters a column → start tracking time
-   When it leaves → stop tracking time
----------
### 6. Completed Task Stats
Once a task is moved to **Completed**:
-   Show a breakdown of time spent in each column
#### Example:
```
Working: 5m 20s
Testing: 2m 10s
Review: 1m 05s
```
----------
### 7. Persistence
-   Data should persist on refresh
----------
## UI Expectations
-   Horizontal column layout
-   Cards should be simple and readable
-   No heavy styling needed (unless time permits)
----------
## Constraints
-   No backend
-   No authentication
-   No multi-user support
-   Avoid over-engineering (remember YAGNI and KISS)
----------
## Guidance
-   Use **latest Angular concepts and patterns**
-   Keep architecture clean and maintainable
----------
## Deliverables
-   Live deployed app URL
-   GitHub repository
