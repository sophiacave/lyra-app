#!/usr/bin/env python3
"""
Suno Direct — Extract JWT from Chrome session and call Suno's internal API directly.
No third parties. No cookies to manage. Uses Clerk JWT from browser session.

This script:
1. Launches Chrome with your real profile
2. Intercepts the Clerk JWT token from network requests
3. Uses that token to call Suno's API directly
4. Returns results as JSON

Usage:
  python3 suno-direct.py auth          # Get and save JWT token
  python3 suno-direct.py generate "prompt"  # Generate music
  python3 suno-direct.py credits       # Check credits
"""

import asyncio
import json
import os
import sys
import aiohttp
from pathlib import Path

TOKEN_FILE = Path.home() / ".fractal_brain" / "suno_token.json"
SUNO_API = "https://studio-api.suno.ai"
DOWNLOADS = Path.home() / "timbre" / "remixes"


async def extract_token():
    """Launch Chrome, intercept Clerk JWT from Suno's API calls."""
    from playwright.async_api import async_playwright

    token = None

    pw = await async_playwright().start()
    browser = await pw.chromium.launch_persistent_context(
        user_data_dir=os.path.expanduser("~/Library/Application Support/Google/Chrome"),
        channel="chrome",
        headless=False,
        args=["--disable-blink-features=AutomationControlled"],
    )

    page = browser.pages[0] if browser.pages else await browser.new_page()

    # Intercept API requests to capture the JWT
    async def handle_request(request):
        nonlocal token
        auth = request.headers.get("authorization", "")
        if auth.startswith("Bearer ") and "suno" in request.url:
            token = auth.replace("Bearer ", "")

    page.on("request", handle_request)

    # Navigate to create page — this triggers API calls with the JWT
    await page.goto("https://suno.com/create", wait_until="networkidle", timeout=30000)
    await asyncio.sleep(5)

    # Scroll or click to trigger more API calls if needed
    await page.evaluate("window.scrollTo(0, 100)")
    await asyncio.sleep(3)

    await browser.close()
    await pw.stop()

    if token:
        # Save token
        TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
        TOKEN_FILE.write_text(json.dumps({
            "token": token,
            "timestamp": __import__("time").time(),
        }))
        print(f"✅ JWT captured and saved ({len(token)} chars)")
        return token
    else:
        print("❌ Could not capture JWT. Try again.")
        return None


def load_token():
    """Load saved JWT token."""
    if TOKEN_FILE.exists():
        data = json.loads(TOKEN_FILE.read_text())
        age = __import__("time").time() - data.get("timestamp", 0)
        if age < 3600:  # Tokens valid for ~1 hour
            return data["token"]
        print("Token expired, re-authenticating...")
    return None


async def suno_request(method, endpoint, token, data=None):
    """Make authenticated request to Suno API."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    }
    url = f"{SUNO_API}{endpoint}"

    async with aiohttp.ClientSession() as session:
        if method == "GET":
            async with session.get(url, headers=headers) as resp:
                return await resp.json()
        elif method == "POST":
            async with session.post(url, headers=headers, json=data) as resp:
                return await resp.json()


async def get_credits(token):
    """Check remaining credits."""
    result = await suno_request("GET", "/api/billing/info/", token)
    return result


async def generate(token, prompt, model="chirp-v4", instrumental=False):
    """Generate music."""
    data = {
        "gpt_description_prompt": prompt,
        "make_instrumental": instrumental,
        "mv": model,
    }
    result = await suno_request("POST", "/api/generate/v2/", token, data)
    return result


async def custom_generate(token, lyrics, style, title, model="chirp-v4"):
    """Generate with custom lyrics."""
    data = {
        "prompt": lyrics,
        "tags": style,
        "title": title,
        "make_instrumental": False,
        "mv": model,
    }
    result = await suno_request("POST", "/api/generate/v2/", token, data)
    return result


async def get_feed(token, page=0):
    """Get generated songs feed."""
    result = await suno_request("GET", f"/api/feed/?page={page}", token)
    return result


async def download_track(token, clip_id, output_path=None):
    """Download a specific track by clip ID."""
    feed = await suno_request("GET", f"/api/clip/{clip_id}", token)
    if feed and "audio_url" in feed:
        url = feed["audio_url"]
        out = output_path or str(DOWNLOADS / f"{clip_id}.mp3")

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                with open(out, "wb") as f:
                    f.write(await resp.read())
        print(f"Downloaded: {out}")
        return out
    return None


async def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    action = sys.argv[1]

    if action == "auth":
        await extract_token()
        return

    # All other actions need a token
    token = load_token()
    if not token:
        print("No valid token. Running auth first...")
        token = await extract_token()
        if not token:
            return

    if action == "credits":
        result = await get_credits(token)
        print(json.dumps(result, indent=2))

    elif action == "generate":
        prompt = sys.argv[2] if len(sys.argv) > 2 else "upbeat pop song"
        instrumental = "--instrumental" in sys.argv
        result = await generate(token, prompt, instrumental=instrumental)
        print(json.dumps(result, indent=2))

    elif action == "custom":
        lyrics = sys.argv[2] if len(sys.argv) > 2 else ""
        style = sys.argv[3] if len(sys.argv) > 3 else "pop"
        title = sys.argv[4] if len(sys.argv) > 4 else "Untitled"
        result = await custom_generate(token, lyrics, style, title)
        print(json.dumps(result, indent=2))

    elif action == "feed":
        result = await get_feed(token)
        if isinstance(result, list):
            for clip in result[:5]:
                print(f"  {clip.get('title', 'Untitled')} — {clip.get('status', '?')} — {clip.get('id', '')}")
        else:
            print(json.dumps(result, indent=2))

    elif action == "download":
        clip_id = sys.argv[2] if len(sys.argv) > 2 else None
        if not clip_id:
            print("Usage: suno-direct.py download <clip_id>")
            return
        await download_track(token, clip_id)

    else:
        print(f"Unknown action: {action}")


if __name__ == "__main__":
    asyncio.run(main())
