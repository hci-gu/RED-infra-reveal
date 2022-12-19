#!/usr/bin/env python3

import asyncio
import queue
import json
import threading
import traceback
import sys
import struct
import os
import time
import websockets
import logging

websocket_host = os.getenv('WEBSOCKET_HOST', 'localhost')

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

    def response(self, flow):
        request = flow.request
        response = flow.response
        self.send_message({
            'client': {
                'id': flow.client_conn.id, # uuid from mitmproxy
                'peername': flow.client_conn.peername, # The remote's (ip, port) tuple for this connection.
                'sockname': flow.client_conn.sockname, # Our local (ip, port) tuple for this connection.
            },
            'method': request.method,
            'url': request.url,
            'scheme': request.scheme,
            'host': request.pretty_host,
            'ip': request.host,
            'timestamp': {
                'start': request.timestamp_start,
                'end': response.timestamp_end
            },
            'headers': list(request.headers.items(True)) + list(response.headers.items(True)),
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
            time.sleep(1)
            try:
                async with websockets.connect(f'ws://{websocket_host}:8765', max_size=None) as ws:
                    while True:
                        try:
                            msg = self.queue.get(timeout=1)
                            if msg is None:
                                break
                            try:
                                await asyncio.wait_for(ws.send(msg), 10)
                            except:
                                break
                        except queue.Empty:
                            pass
            except websockets.exceptions.ConnectionClosed:
                # disconnected from server
                continue
            except BrokenPipeError:
                # Connect failed
                continue
            except IOError:
                # disconnected from server mis-transfer
                continue
            except:
                logging.error(
                    "[mitmproxy-websocket] Unexpected error:")
                traceback.print_exc(file=sys.stdout)


addons = [
    WebSocketAdapter()
]
