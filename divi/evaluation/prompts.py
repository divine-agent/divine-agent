PROMPT_TEMPLATE = (
    "Your evaluation task is: {requirements}\n\n"
    "Please perform step-by-step reasoning to reach your judgment.\n\n"
    "Strictly output your answer in the following JSON format:\n"
    '{{"judgment": bool, "reasoning": "string"}}\n\n'
    "Do not output anything else.\n\n"
    "Here is the conversation to evaluate:\n"
    "{conversation}"
)

PRESET_PROMPT = {
    "task_completion": "Evaluate whether the model's output completely fulfills the user's task requirements.",
    "instruction_adherence": "Evaluate whether the model's output strictly follows the user's instructions without omissions, deviations, or hallucinations.",
}
