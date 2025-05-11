<p align="center">
  <a href="https://divine-agent.com/"><img width="128" height="128" src="https://raw.githubusercontent.com/Kaikaikaifang/divine-agent/main/docs/images/thinking-angel.png" alt='Divine Agent'></a>
</p>

<p align="center"><strong>神明代理人</strong> <em>– 全栈开源的智能体可观测方案，简单、清晰。</em></p>

<p align="center">
<a href="https://pypi.org/project/divi/">
    <img src="https://img.shields.io/pypi/v/divi.svg" alt="Package version">
</a>
</p>

<p align="center">
中文 / <a href="./docs/README.md">English</a>
</p>

神明代理人 (Divine Agent) 是一个智能体可观测工具，提供追踪、评估和用量统计功能。

---

> [!IMPORTANT]
> **神明代理人目前处于实验性阶段**，随时可能进行重大变更。本项目正处于活跃开发阶段，接口和功能模块可能在没有事先通知的情况下发生变更。
>
> 在正式稳定版本发布前，不建议在生产环境中使用该组件。

## 安装

建议 Python 版本 3.11+

```shell
pip install divi
```

## 追踪

1. 从[官网](https://www.divine-agent.com/dashboard/api-keys)获取 API Key.
2. 创建 `.env` 文件并添加以下行:
  ```env
  DIVI_API_KEY=your_divi_api_key
  OPENAI_BASE_URL=https://api.deepseek.com
  OPENAI_API_KEY=your_llm_api_key
  ```
3. 运行以下代码:
  ```python
  from divi import obs_openai, observable
  from dotenv import load_dotenv
  from openai import OpenAI

  load_dotenv()


  class Wukong:
      def __init__(self):
          self.client = obs_openai(
              OpenAI(),
              name="Wukong",
          )

      @observable(name="Talk with Wukong")
      def talk(self, message: str):
          """Talk like Wukong."""
          res = self.client.chat.completions.create(
              model="deepseek-chat",
              messages=[
                  {"role": "system", "content": "像孙悟空一样说话。"},
                  {
                      "role": "user",
                      "content": message,
                  },
              ],
          )
          return res.choices[0].message.content


  wukong = Wukong()
  wukong.talk("如何检查一个 Python 对象是否是某个类的实例？")
  ```
