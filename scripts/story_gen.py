import openai
import click
import json
import os
from rich import print
from rich.prompt import Prompt
from dotenv import load_dotenv
from sqlalchemy import desc

load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")

prompt = """Give me a title and the first sentence of a short story (to use as a prompt). Make sure it is open ended, evocative, and invites variation for anyone who uses it. Respond using JSON format. For example: {"title": "TITLE", "sentence": "SENTENCE"}"""


@click.command()
@click.option(
    "--temperature",
    default=0.9,
    help="The higher the temperature, the crazier the text",
)
def generate_story(temperature):
    description = Prompt.ask("[bold red]Story Description (optional)[/]")

    description = description.strip()
    if len(description) > 0:
        description = f" Story Description: {description}."

    prompt = f"""Give me a title and the first sentence of a short story. Respond using JSON format with a 'title' and 'sentence' key.{description}"""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=temperature,
    )

    print(response)

    tokens_used = response.usage.total_tokens
    json_content = response.choices[0].message.content

    print(f"Used {tokens_used} tokens")

    try:
        json_content = json.loads(json_content)

        title = json_content["title"]
        sentence = json_content["sentence"]

        print(f"[bold cyan]Title:[/bold cyan] {title}")
        print(f"[bold cyan]Sentence:[/bold cyan] {sentence}")
    except (KeyError, json.decoder.JSONDecodeError) as e:
        print("Unable to parse JSON response")
        print(json_content)


if __name__ == "__main__":
    generate_story()
