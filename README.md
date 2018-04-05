# Instructions

## Build setup for backend server

``` bash
# install dependencies
npm install

# initialize virtual environment (in backend directory)
virtualenv -p python3 venv

# enable virtual environment
source venv/bin/activate

# use VE to install Flask
(venv) pip install Flask

# run Flask app (from root directory) at localhost:5000 
(venv) FLASK_APP=run.py FLASK_DEBUG=1 flask run
```


## Build setup for frontend

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
