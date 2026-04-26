# Congé App Refactoring TODO
Status: ✅ In Progress

## Detailed Breakdown from Plan

### Phase 1: File Organization (Current)
- [x] Create TODO.md ✓
- [x] Step 1: Create all new folders ✓
- [x] Step 2: Move shared files to /shared/ (components/, contexts/, hooks/, lib/) ✓
- [ ] Step 3: Move role-specific pages from src/pages/ to role folders:
  | From | To |
  |------|----|
  | src/pages/Login.jsx | src/shared/pages/Login.jsx |
  | src/pages/NotFound.jsx | src/shared/pages/NotFound.jsx |
  | src/pages/LeaveRequest.jsx | src/employer/pages/LeaveRequest.jsx |
  | src/pages/LeaveHistory.jsx | src/employer/pages/LeaveHistory.jsx |
  | src/pages/PendingRequests.jsx | src/responsable/pages/PendingRequests.jsx | 
  | src/pages/Employees.jsx | src/directeur/pages/Employees.jsx |
  | src/pages/Holidays.jsx | src/directeur/pages/Holidays.jsx |
  - Delete all Dummy.txt
  - Delete empty src/pages/
- [ ] Step 4: Move components:
  - src/components/layout/* → src/shared/components/layout/
  - src/components/ui/* → src/shared/components/ui/
- [ ] Step 5: Move other shared: src/{hooks,lib,types}/ → src/shared/

### Phase 2: Update Imports & Routing
- [ ] Step 6: Update App.jsx imports to new paths (shared/role)
- [ ] Step 7: Update Sidebar.jsx imports (@/shared/...)
- [ ] Step 8: Batch update ALL files: search & replace old imports (src/pages/ → @/role/, src/components/ → @/shared/components/, etc.)

### Phase 3: Testing & Cleanup
- [ ] Step 9: Test: npm run dev, check all routes, role nav, no errors
- [ ] Step 10: Final: list_files, update TODO.md complete, attempt_completion

## Current Progress
✅ Phase 1 partial (folders/pages partial)
Next: Step 3 - Move pages
