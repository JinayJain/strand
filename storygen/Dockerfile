FROM python:3.9-alpine

# Install required packages
COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

# Copy script and CRON task
COPY ./generate.py /app/generate.py
COPY ./cronfile /app/cronfile
COPY ./.env /app/.env

# Copy and enable CRON task
RUN crontab /app/cronfile

# Create empty log (TAIL needs this)
RUN touch /tmp/out.log

# Start TAIL - as always-on process (otherwise - container exits right after start)
CMD ["crond", "-f", "-d", "8"]
