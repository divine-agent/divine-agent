<p align="center">
  <a href="https://divine-agent.com/"><img width="128" height="128" src="https://raw.githubusercontent.com/Kaikaikaifang/divine-agent/main/docs/images/thinking-angel.png" alt='Divine Agent'></a>
</p>

<p align="center"><strong>Divine Agent</strong> <em>– Fully open-source agent observability. Simple. Clear.</em></p>

<p align="center">
<a href="https://pypi.org/project/divi/">
    <img src="https://img.shields.io/pypi/v/divi.svg" alt="Package version">
</a>
</p>

<p align="center">
    <a href="./docs/README_ZH.md">中文</a> / English
</p>

divine-agent is an observability tool for LLM-based agents, offering tracing, evaluation, and usage statistics.

---

> [!IMPORTANT]
> **divine-agent is currently experimental** and may undergo significant changes at any time. This project is in active development, which means APIs and features might change without prior notice.
>
> We do not recommend using divine-agent in production environments until a stable release is available.

## Core Concepts

1. Tracing
2. Evaluation

Explore the [examples](exmples) directory to see the SDK in action, and read our [documentation](https://docs.divine-agent.com/) for more details.

## Get started

1. Create an account on [Divine Agent](https://www.divine-agent.com/signup?source=docs).

2. Install Divine Agent SDK

```shell
pip install divi
```

3. Get API Key from [Web](https://www.divine-agent.com/dashboard/api-keys).

4. Create a `.env` file and add the following line

```env
DIVI_API_KEY=your_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=your_llm_api_key
```

5. Run the following code:

```python
from divi import obs_openai, observable
from divi.evaluation import Score
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class Pirate:
    def __init__(self):
        self.client = obs_openai(
            OpenAI(),
            name="Pirate",
            scores=[Score.instruction_adherence, Score.task_completion],
        )

    @observable(name="Talk with pirate")
    def talk(self, message: str):
        """Talk like a pirate."""
        res = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "developer", "content": "Talk like a pirate."},
                {
                    "role": "user",
                    "content": message,
                },
            ],
        )
        return res.choices[0].message.content


pirate = Pirate()
pirate.talk("How do I check if a Python object is an instance of a class?")
```
