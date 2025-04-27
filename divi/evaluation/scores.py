from enum import Enum


class Score(str, Enum):
    """Enum for score types."""

    task_completion = "task_completion"
    instruction_adherence = "instruction_adherence"
