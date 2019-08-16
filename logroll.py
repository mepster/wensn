import os

class LogRoll():
    def __init__(self, logdir):
        try:
            os.stat(logdir)
        except:
            os.mkdir(logdir)
        self.logdir = logdir
        self.oldlogname = None
        self.fp = None

    def open_or_reopen(self, logname):
        # this reopens a new file whenever the name changes
        if (logname != self.oldlogname):
            self.oldlogname = logname
            if self.fp and not self.fp.closed:
                self.fp.close()
            self.fp = open(self.logdir + "/" + logname, "a+")
