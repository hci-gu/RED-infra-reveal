from mitmproxy import ctx


class Counter:
    def __init__(self):
        self.num = 0

    def request(self, flow):
        self.num = self.num + 1
        ctx.log.error("We've seen %d flows" % self.num)


addons = [
    Counter()
]
