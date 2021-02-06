web: gunicorn miniproject.wsgi --log-file -
web: gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 miniproject.wsgi:application