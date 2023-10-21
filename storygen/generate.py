import openai
import psycopg2
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from urllib.parse import urlparse
import json
import logging as log
import requests
from random import choice

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

WORD_LIST_URL = "https://raw.githubusercontent.com/dolph/dictionary/master/popular.txt"

NUM_RANDOM_WORDS = 5
PROMPT = """
Generate a short story prompt. Be creative and try to make it interesting. Make the title creative and the first sentence intriguing.

Here are some words to use for inspiration, choose 1-3 to use: {words}

Your output should be a JSON object with the following keys:
- title (string), the title of the story
- first_sentence (string), the first sentence of the story
- slug (string), a short URL slug for the story
"""


def check_story_exists(con, date):
    cur = con.cursor()

    cur.execute("SELECT * FROM story WHERE active_date = %s", (date,))
    story = cur.fetchone()

    cur.close()

    return story is not None


def generate_story():
    log.info("Generating story")

    random_words = get_random_words(NUM_RANDOM_WORDS)

    log.info("Random words: %s", random_words)

    prompt = PROMPT.format(words=", ".join(random_words))

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=1.3,
    )

    text = completion.choices[0].message.content

    return json.loads(text)


def get_random_words(n):
    log.info("Getting %s random words", n)

    r = requests.get(WORD_LIST_URL)
    words = r.text.split("\n")

    return [choice(words) for _ in range(n)]


def insert_story(con, story, date):
    log.info("Inserting story into database")

    cur = con.cursor()

    # Add the story without root strand
    cur.execute(
        """
        INSERT INTO story (title, id, active_date)
        VALUES (%s, %s, %s)
        """,
        (story["title"], story["slug"], date),
    )

    # Add the root strand
    cur.execute(
        """
        INSERT INTO strand (story_id, content)
        VALUES (%s, %s)
        RETURNING id
        """,
        (story["slug"], story["first_sentence"]),
    )

    root = cur.fetchone()

    # Update the story with the root strand
    cur.execute(
        """
        UPDATE story
        SET root_id = %s
        WHERE id = %s
        """,
        (root[0], story["slug"]),
    )

    con.commit()
    cur.close()


def main(con):
    log.basicConfig(level=log.INFO, format="[%(asctime)s] %(message)s")

    # Find tomorrow's date
    tomorrow = datetime.now() + timedelta(days=1)
    tomorrow = tomorrow.strftime("%Y-%m-%d")

    if check_story_exists(con, tomorrow):
        log.info("Story already exists for tomorrow, skipping")
        return

    # Generate completion
    story = generate_story()
    log.info("Generated story: %s", story)

    insert_story(con, story, tomorrow)


if __name__ == "__main__":
    conStr = os.getenv("DB_URL")
    p = urlparse(conStr)

    pg_connection_dict = {
        "host": p.hostname,
        "port": p.port,
        "dbname": p.path[1:],
        "user": p.username,
        "password": p.password,
    }

    con = psycopg2.connect(**pg_connection_dict)

    main(con)

    con.close()
