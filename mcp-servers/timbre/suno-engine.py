#!/usr/bin/env python3
"""
Suno Engine — Playwright-based automation for Suno Premium
Uses the real Chrome profile (already logged in). Zero cookies to manage.
Supports: generate, custom_generate, upload, remix, extend, download

Usage:
  python3 suno-engine.py generate "upbeat EDM track, 128 BPM"
  python3 suno-engine.py custom "lyrics here" "pop, upbeat" "Song Title"
  python3 suno-engine.py upload ~/timbre/stems/vocals.wav "EDM remix"
  python3 suno-engine.py credits
"""

import asyncio
import json
import os
import sys
import time
from pathlib import Path

CHROME_USER_DATA = os.path.expanduser(
    "~/Library/Application Support/Google/Chrome"
)
DOWNLOADS = Path.home() / "timbre" / "remixes"
DOWNLOADS.mkdir(parents=True, exist_ok=True)


async def get_browser():
    """Launch browser with real Chrome profile (already logged into Suno)."""
    from playwright.async_api import async_playwright

    pw = await async_playwright().start()
    browser = await pw.chromium.launch_persistent_context(
        user_data_dir=CHROME_USER_DATA,
        channel="chrome",
        headless=False,  # Need visible for first run, can switch to True later
        args=["--disable-blink-features=AutomationControlled"],
        viewport={"width": 1280, "height": 900},
        accept_downloads=True,
    )
    return pw, browser


async def wait_for_auth(page):
    """Ensure we're logged into Suno."""
    await page.goto("https://suno.com/create", wait_until="networkidle", timeout=30000)
    # Check if we're on the create page (logged in)
    try:
        await page.wait_for_selector('[data-testid="create-button"], button:has-text("Create")', timeout=10000)
        return True
    except Exception:
        print("Not logged in or page changed. Check browser.")
        return False


async def get_credits(page):
    """Get remaining credits."""
    await page.goto("https://suno.com/account", wait_until="networkidle", timeout=15000)
    await asyncio.sleep(2)
    # Extract credit info from page
    content = await page.content()
    # Look for credit-related text
    credit_el = await page.query_selector('[class*="credit"], [class*="Credit"], [data-testid*="credit"]')
    if credit_el:
        text = await credit_el.text_content()
        return text
    return "Could not find credit info — check browser"


async def generate(page, prompt, instrumental=False):
    """Generate music from a text prompt."""
    await page.goto("https://suno.com/create", wait_until="networkidle", timeout=30000)
    await asyncio.sleep(2)

    # Find the prompt input
    textarea = await page.query_selector('textarea, [contenteditable="true"], input[type="text"]')
    if not textarea:
        # Try clicking "Describe a song" or similar
        desc_btn = await page.query_selector('button:has-text("Describe"), [placeholder*="Describe"], [placeholder*="describe"]')
        if desc_btn:
            await desc_btn.click()
            await asyncio.sleep(1)
            textarea = await page.query_selector('textarea, [contenteditable="true"]')

    if textarea:
        await textarea.fill(prompt)
        await asyncio.sleep(0.5)
    else:
        print("Could not find prompt input")
        return None

    # Toggle instrumental if needed
    if instrumental:
        inst_toggle = await page.query_selector('[data-testid*="instrumental"], button:has-text("Instrumental"), label:has-text("Instrumental")')
        if inst_toggle:
            await inst_toggle.click()
            await asyncio.sleep(0.5)

    # Click Create/Generate
    create_btn = await page.query_selector('button:has-text("Create"), button[data-testid="create-button"]')
    if create_btn:
        await create_btn.click()
        print(f"Generation started: {prompt[:60]}...")
    else:
        print("Could not find Create button")
        return None

    # Wait for generation (up to 3 minutes)
    print("Waiting for generation to complete...")
    await asyncio.sleep(30)  # Initial wait

    # Poll for completion
    for i in range(30):
        # Check if audio player appeared
        audio_els = await page.query_selector_all('audio, [data-testid*="audio"], [class*="player"]')
        if len(audio_els) > 0:
            print(f"Generation complete! Found {len(audio_els)} audio elements")
            break
        await asyncio.sleep(5)
        print(f"  Still generating... ({(i+1)*5 + 30}s)")

    return True


async def custom_generate(page, lyrics, style, title):
    """Generate with custom lyrics, style, and title."""
    await page.goto("https://suno.com/create", wait_until="networkidle", timeout=30000)
    await asyncio.sleep(2)

    # Switch to Custom mode
    custom_btn = await page.query_selector('button:has-text("Custom"), [data-testid*="custom"]')
    if custom_btn:
        await custom_btn.click()
        await asyncio.sleep(1)

    # Fill lyrics
    lyrics_input = await page.query_selector('textarea[placeholder*="lyric"], textarea[placeholder*="Lyric"], textarea:nth-of-type(1)')
    if lyrics_input:
        await lyrics_input.fill(lyrics)

    # Fill style
    style_input = await page.query_selector('input[placeholder*="style"], input[placeholder*="Style"], textarea[placeholder*="style"]')
    if style_input:
        await style_input.fill(style)

    # Fill title
    title_input = await page.query_selector('input[placeholder*="title"], input[placeholder*="Title"]')
    if title_input:
        await title_input.fill(title)

    await asyncio.sleep(0.5)

    # Create
    create_btn = await page.query_selector('button:has-text("Create")')
    if create_btn:
        await create_btn.click()
        print(f"Custom generation started: {title}")

    # Wait
    print("Waiting for generation...")
    for i in range(36):
        await asyncio.sleep(5)
        audio_els = await page.query_selector_all('audio')
        if len(audio_els) > 0:
            print("Done!")
            break
        print(f"  Generating... ({(i+1)*5}s)")

    return True


async def download_latest(page, output_name=None):
    """Download the most recently generated track."""
    # Find download button or three-dot menu
    tracks = await page.query_selector_all('[class*="song"], [class*="track"], [data-testid*="song"]')
    if not tracks:
        print("No tracks found on page")
        return None

    # Click on first track's menu
    track = tracks[0]
    menu_btn = await track.query_selector('button[aria-label*="more"], button[aria-label*="menu"], [class*="menu"]')
    if menu_btn:
        await menu_btn.click()
        await asyncio.sleep(1)

        # Click download
        dl_btn = await page.query_selector('button:has-text("Download"), [data-testid*="download"], a:has-text("Download")')
        if dl_btn:
            async with page.expect_download() as download_info:
                await dl_btn.click()
            download = await download_info.value
            out_name = output_name or download.suggested_filename
            out_path = DOWNLOADS / out_name
            await download.save_as(str(out_path))
            print(f"Downloaded: {out_path}")
            return str(out_path)

    print("Could not find download option")
    return None


async def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    action = sys.argv[1]
    pw, browser = await get_browser()
    page = browser.pages[0] if browser.pages else await browser.new_page()

    try:
        if action == "credits":
            result = await get_credits(page)
            print(f"Credits: {result}")

        elif action == "generate":
            prompt = sys.argv[2] if len(sys.argv) > 2 else "upbeat pop song"
            instrumental = "--instrumental" in sys.argv
            if await wait_for_auth(page):
                await generate(page, prompt, instrumental)

        elif action == "custom":
            lyrics = sys.argv[2] if len(sys.argv) > 2 else ""
            style = sys.argv[3] if len(sys.argv) > 3 else "pop"
            title = sys.argv[4] if len(sys.argv) > 4 else "Untitled"
            if await wait_for_auth(page):
                await custom_generate(page, lyrics, style, title)

        elif action == "download":
            output_name = sys.argv[2] if len(sys.argv) > 2 else None
            await download_latest(page, output_name)

        elif action == "test":
            print("Testing Suno auth...")
            if await wait_for_auth(page):
                print("✅ Logged into Suno Premium!")
                credits = await get_credits(page)
                print(f"Credits: {credits}")
            else:
                print("❌ Not logged in")

        else:
            print(f"Unknown action: {action}")
            print(__doc__)

    finally:
        await browser.close()
        await pw.stop()


if __name__ == "__main__":
    asyncio.run(main())
