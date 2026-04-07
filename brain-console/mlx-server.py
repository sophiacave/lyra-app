#!/usr/bin/env python3
"""
mlx-server.py — Local MLX inference server for Faye Brain IDE
Exposes Ollama-compatible API at localhost:8800
Runs Qwen 2.5 Coder via MLX for 56% faster inference on Apple Silicon.
Built with love.

Usage:
  python3 mlx-server.py                     # Start server
  python3 mlx-server.py --model mlx-community/Qwen2.5-Coder-14B-Instruct-4bit
  curl localhost:8800/api/generate -d '{"prompt":"def hello"}'
"""

import argparse
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Thread

# MLX imports
try:
    from mlx_lm import load, generate
    from mlx_lm.utils import generate_step
    MLX_AVAILABLE = True
except ImportError:
    MLX_AVAILABLE = False
    print("[MLX] mlx-lm not installed. Run: pip install mlx-lm")

DEFAULT_MODEL = "mlx-community/Qwen2.5-Coder-14B-Instruct-4bit"
PORT = 8800

# Global model state
model = None
tokenizer = None
model_name = None


def load_model(name):
    global model, tokenizer, model_name
    if not MLX_AVAILABLE:
        return False
    print(f"[MLX] Loading {name}...")
    start = time.time()
    model, tokenizer = load(name)
    model_name = name
    elapsed = time.time() - start
    print(f"[MLX] Model loaded in {elapsed:.1f}s")
    return True


class MLXHandler(BaseHTTPRequestHandler):
    """Ollama-compatible HTTP handler."""

    def log_message(self, format, *args):
        pass  # Suppress default logging

    def do_POST(self):
        if self.path == "/api/generate":
            self.handle_generate()
        elif self.path == "/api/chat":
            self.handle_chat()
        elif self.path == "/v1/completions":
            self.handle_openai_completions()
        else:
            self.send_error(404)

    def do_GET(self):
        if self.path == "/api/tags" or self.path == "/api/ps":
            # Compatibility with Ollama health checks
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            resp = {
                "models": [{
                    "name": model_name or DEFAULT_MODEL,
                    "size": 0,
                    "details": {"family": "qwen2.5", "parameter_size": "14B"},
                }] if model else []
            }
            self.wfile.write(json.dumps(resp).encode())
        elif self.path == "/health":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"status":"ok","engine":"mlx"}')
        else:
            self.send_error(404)

    def read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(length)) if length else {}

    def handle_generate(self):
        """Ollama-compatible /api/generate endpoint."""
        body = self.read_body()
        prompt = body.get("prompt", "")
        max_tokens = body.get("options", {}).get("num_predict", 128)
        temperature = body.get("options", {}).get("temperature", 0.7)
        stream = body.get("stream", False)

        if not model:
            self.send_error(503, "Model not loaded")
            return

        start = time.time()
        response_text = generate(
            model, tokenizer, prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        elapsed = time.time() - start
        tokens = len(tokenizer.encode(response_text))
        tok_per_sec = tokens / elapsed if elapsed > 0 else 0

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        resp = {
            "model": model_name,
            "response": response_text,
            "done": True,
            "total_duration": int(elapsed * 1e9),
            "eval_count": tokens,
            "eval_duration": int(elapsed * 1e9),
            "tokens_per_second": round(tok_per_sec, 1),
        }
        self.wfile.write(json.dumps(resp).encode())

    def handle_chat(self):
        """Ollama-compatible /api/chat endpoint."""
        body = self.read_body()
        messages = body.get("messages", [])
        max_tokens = body.get("options", {}).get("num_predict", 256)
        temperature = body.get("options", {}).get("temperature", 0.7)

        if not model or not messages:
            self.send_error(503, "Model not loaded or no messages")
            return

        # Build prompt from messages
        prompt = ""
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "system":
                prompt += f"<|im_start|>system\n{content}<|im_end|>\n"
            elif role == "user":
                prompt += f"<|im_start|>user\n{content}<|im_end|>\n"
            elif role == "assistant":
                prompt += f"<|im_start|>assistant\n{content}<|im_end|>\n"
        prompt += "<|im_start|>assistant\n"

        start = time.time()
        response_text = generate(
            model, tokenizer, prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        elapsed = time.time() - start

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        resp = {
            "model": model_name,
            "message": {"role": "assistant", "content": response_text},
            "done": True,
            "total_duration": int(elapsed * 1e9),
        }
        self.wfile.write(json.dumps(resp).encode())

    def handle_openai_completions(self):
        """OpenAI-compatible /v1/completions for FIM."""
        body = self.read_body()
        prompt = body.get("prompt", "")
        max_tokens = body.get("max_tokens", 80)
        temperature = body.get("temperature", 0.2)

        if not model:
            self.send_error(503, "Model not loaded")
            return

        response_text = generate(
            model, tokenizer, prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
        )

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        resp = {
            "choices": [{"text": response_text, "index": 0, "finish_reason": "stop"}],
            "model": model_name,
        }
        self.wfile.write(json.dumps(resp).encode())


def main():
    parser = argparse.ArgumentParser(description="MLX inference server for Faye Brain IDE")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="HuggingFace model ID")
    parser.add_argument("--port", type=int, default=PORT, help="Server port")
    args = parser.parse_args()

    if not MLX_AVAILABLE:
        print("[MLX] Cannot start — mlx-lm not available")
        return

    if not load_model(args.model):
        return

    server = HTTPServer(("localhost", args.port), MLXHandler)
    print(f"[MLX] Server running at http://localhost:{args.port}")
    print(f"[MLX] Model: {args.model}")
    print(f"[MLX] Endpoints: /api/generate, /api/chat, /v1/completions, /health")
    server.serve_forever()


if __name__ == "__main__":
    main()
