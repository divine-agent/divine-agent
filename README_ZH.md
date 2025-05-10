<p align="center">
  <a href="https://divine-agent.com/"><img width="128" height="128" src="https://raw.githubusercontent.com/Kaikaikaifang/divine-agent/main/docs/images/thinking-angel.png" alt='Divine Agent'></a>
</p>

<p align="center"><strong>神明代理人</strong> <em>– 完全开源的Agent可观测性方案，简单、清晰。</em></p>

<p align="center">
<a href="https://pypi.org/project/divi/">
    <img src="https://img.shields.io/pypi/v/divi.svg" alt="Package version">
</a>
</p>

<div align="center">

中文 / [English](README.md)

</div>

divine-agent 是面向LLM Agent的可观测性工具，提供全链路追踪、智能评估与用量统计三件套。

---

> [!重要]
> **当前是实验性版本**，随时可能表演原地进化。本项目正处于疯狂迭代阶段，这意味着API可能在凌晨三点突然变身，功能可能在你眨眼时消失又出现。
>
> 除非你想体验刺激的线上惊魂，否则建议等稳定版发布后再用于生产环境。

## 安装

本项目需要的 Python 版本为 3.11+

```shell
pip install divi
```

## Usage

1. 从[官网](https://www.divine-agent.com/dashboard/api-keys)领取 API 密钥.
2. 创建 `.env` 文件并添加:
  ```env
  DIVI_API_KEY=your_api_key
  ```
3. 运行以下代码:
  ```python
  from divi import Score, obs_openai, observable
  from dotenv import load_dotenv
  from openai import OpenAI

  load_dotenv()


  class Pirate:
      def __init__(self):
          self.client = obs_openai(
              OpenAI(),
              name="Sun Wukong",
              scores=[Score.instruction_adherence],
          )

      @observable(name="Talk with Wukong")
      def talk(self, message: str):
          """Talk like Sun Wukong."""
          res = self.client.chat.completions.create(
              model="gpt-4o",
              messages=[
                  {"role": "developer", "content": "像孙悟空一样说话。"},
                  {
                      "role": "user",
                      "content": message,
                  },
              ],
          )
          return res.choices[0].message.content


  pirate = Pirate()
  pirate.talk("如何检查一个Python对象是否是某个类的实例？")
  ```
