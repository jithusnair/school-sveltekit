### 0.5.0 (2021-12-10)

##### New Features

*  Show subtask completion count directly in list of tasks. (145c994d)

##### Other Changes

*  Fix task interface. Subtasks array should be optional (5ca6abc7)

#### 0.4.2 (2021-12-08)

##### Other Changes

*  scrolling in profile page started from the top of the page which is unnecessary. Only the template container needs overflow. (8e5e2089)

#### 0.4.1 (2021-12-08)

##### Bug Fixes

*  order task by ascending order of date in upcoming tasks. In other words upcoming ones will now come on top of the list. (224e48d5)

### 0.4.0 (2021-12-08)

##### New Features

*  add a filtered view of tasks. Now all tasks in a project are displayed under 'Upcoming', 'Completed', and 'All Tasks' (4989572a)
v
#### 0.3.2 (2021-12-07)

##### Bug Fixes

*  add css for date picker (previously forgot to include) (6543f128)

#### 0.3.1 (2021-12-06)

##### Bug Fixes

*  clicking save on edit window of a task, which does not have subtasks, marks the task as done (4a477d3b)

### 0.3.0 (2021-12-06)

##### New Features

*  Add due date to tasks. This is in preparation for notifications in the future (d9d84f4d)

#### 0.2.2 (2021-12-06)

##### Bug Fixes

*  edit window not clearing previous values (1ce41d21)

#### 0.2.1 (2021-12-04)

##### Bug Fixes

*  notes field distorting the dialog box width (e6472921)
*  typescript error -> notes property not in new task (a330c6ce)

##### Other Changes

*  List of tasks now spans both columns (ed43671b)

### 0.2.0 (2021-12-04)

##### New Features

*  Now one can add notes/description to a todo! (c656c1d9)

##### Other Changes

*  Avoid fullscreen dialog/modal as it is a bit janky in mobile. Also add some padding and margin to header. (50646ccf)

#### 0.1.3 (2021-12-03)

##### Chores

*  run npm update (2d19c2d9)

#### 0.1.2 (2021-12-03)

##### Chores

*  remove release scripts from package.json and do changelog & releases manually. Also fix changelog. (d6f1c0d7)
*  update package.json scripts and fix version not updating using release commands (1e0c25c7)

#### 0.1.1 (2021-12-03)

##### Chores

*  update package.json scripts and fix version not updating using release commands (1e0c25c7)

##### Other Changes

*  Fix success message grammer (cc65ba26)
*  Change scrollbar styling -> might change later based on feedback (5fee5091)

### 0.1.0 (2021-12-03)

##### New Features

*  Add a new profile page where a user can add/update their name and change password (fa13e07d)

##### Bug Fixes

*  overflow issue causing elements to be hidden on screens with small height (afe37cf7)
*  Change type from UserInfo to User in firebase/auth (0a87d438)

##### Other Changes

*  Change logout button to a dropdown menu which includes profile-settings link and logout option (b5509697)

