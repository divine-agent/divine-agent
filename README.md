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

## Install

Requires Python 3.11+

```shell
pip install divi
```

## Trace

1. Get API Key from [Web](https://www.divine-agent.com/dashboard/api-keys).
2. Create a `.env` file and add the following line:
  ```env
  DIVI_API_KEY=your_api_key
  ```
3. Run the following code:
  ```python
  from divi import obs_openai, observable
  from dotenv import load_dotenv
  from openai import OpenAI

  load_dotenv()


  class Pirate:
      def __init__(self):
          self.client = obs_openai(
              OpenAI(),
              name="Pirate",
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
