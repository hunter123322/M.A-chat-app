---
name: Bug report
about: Create a report to help us improve
title: 'socket.io sever'
labels: 'server bug'
assignees: 'fix the server bug'

---

**Describe the bug**
An error occurs when you create a new user or when the user does not have a conversation.

**To Reproduce**
Steps to reproduce the behavior:
1. Start the server.
2. Login with a user that does not have any past conversations.

**Expected behavior**
The user should be able to proceed to login without issues.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**
 - OS: [e.g. Windows 11]
 - Browser [e.g. Chrome, Safari]
 - Version [e.g. 22]

**Smartphone (please complete the following information):**
 - Device: [e.g. iPhone 13]
 - OS: [e.g. iOS 17.1]
 - Browser [e.g. Safari, Chrome]
 - Version [e.g. 22]

**Additional context**
This issue is likely related to socket.io session handling for users without prior conversation history.
