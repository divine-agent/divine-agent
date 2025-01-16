import atexit

import divi


def finish():
    """Clean up the run."""
    run = divi.run
    if run is None:
        return

    # Clean up the hooks
    for hook in run.hooks:
        hook()
        atexit.unregister(hook)
