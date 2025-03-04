from typing import Optional, TypedDict


class Run(TypedDict, total=False):
    """Run information"""

    run_name: Optional[str]
    """Name of the Run"""
    run_id: Optional[str]
    """Run ID"""


class RunExtra(TypedDict, total=False):
    """Extra information for Run"""

    trace_id: Optional[str]
    """Trace ID"""
    parent_span_id: Optional[str]
    """Parent Span ID"""
