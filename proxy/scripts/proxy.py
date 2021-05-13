#!/usr/bin/env python3

import asyncio
import queue
import json
import threading
import traceback
import sys
import struct
import websockets
from mitmproxy import ctx


def convert_body_to_bytes(body):
    if body is None:
        return bytes()
    else:
        return body


class WebSocketAdapter:
    def websocket_thread(self):
        self.worker_event_loop = asyncio.new_event_loop()
        self.worker_event_loop.run_until_complete(self.websocket_loop())

    def __init__(self):
        self.queue = queue.Queue()
        self.finished = False
        # Start websocket thread
        threading.Thread(target=self.websocket_thread).start()

    def send_message(self, metadata):
        metadata_bytes = bytes(json.dumps(metadata), 'utf8')
        metadata_size = len(metadata_bytes)
        msg = struct.pack("<I" + str(metadata_size) + "s",
                          metadata_size, metadata_bytes)
        self.queue.put(msg)

    def request(self, flow):
        request = flow.request
        self.send_message({
            'method': request.method,
            'url': request.url,
            'scheme': request.scheme,
            'host': request.host,
            'headers': list(request.headers.items(True))
        })
        return

    def done(self):
        self.finished = True
        self.queue.put(None)
        return

    async def websocket_loop(self):
        """
        Processes messages from self.queue until mitmproxy shuts us down.
        """
        while not self.finished:
            try:
                async with websockets.connect('ws://api:8765', max_size=None) as websocket:
                    while True:
                        # Make sure connection is still live.
                        await websocket.ping()
                        try:
                            msg = self.queue.get(timeout=1)
                            if msg is None:
                                break
                            try:
                                await websocket.send(msg)
                            except:
                                pass
                        except queue.Empty:
                            pass
            except websockets.exceptions.ConnectionClosed:
                # disconnected from server
                pass
            except BrokenPipeError:
                # Connect failed
                pass
            except IOError:
                # disconnected from server mis-transfer
                pass
            except:
                ctx.log.error(
                    "[mitmproxy-websocket] Unexpected error:")
                traceback.print_exc(file=sys.stdout)


addons = [
    WebSocketAdapter()
]
