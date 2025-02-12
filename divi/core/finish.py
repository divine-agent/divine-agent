import atexit

import divi


def finish():
    """Clean up the core."""
    core = divi._core
    if core is None:
        return

    # Clean up the hooks
    for hook in core.hooks:
        hook()
        atexit.unregister(hook)
