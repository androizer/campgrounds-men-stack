# This folder contains routes which are split up in different files so that routes don't get conflict
# with each other and keep the things clean and organize.

* 'router = express.Router()' is used and the 'app' is replaced with 'router' variable.
* And every 'router' associated with different file is exported to main 'app.js' file. 