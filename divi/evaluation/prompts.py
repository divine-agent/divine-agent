PROMPT_TEMPLATE = (
    "The *requirements* of the evaluation task is: {requirements}\n\n"
    "Below is the *context* of the conversation (for reference only):\n"
    "{conversation}\n\n"
    "Now, in view of both the requirements and the context, evaluate the assistant’s response:\n"
    "{target}\n\n"
    "Please perform step-by-step reasoning to reach your judgment.\n\n"
    "Strictly output your answer in the following JSON format:\n"
    "{{\n"
    '  "judgment": bool,        # true if the response meets all requirements\n'
    '  "reasoning": "string"    # concise explanation, hitting only the key points\n'
    "}}\n"
    "Do not output anything else."
)

PRESET_PROMPT = {
    "task_completion": "Assess whether the assistant response fulfills the user's task requirements.",
    "instruction_adherence": "Assess whether the assistant response strictly follows every instruction given by the user, without omissions, deviations, or hallucinations.",
}
