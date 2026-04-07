# vault.py — Faye is auth. All secrets flow from Supabase Vault.
# Usage: from lib.vault import get_secret
#        key = get_secret('kling_access_key')

import urllib.request
import json

BRAIN_URL = 'https://tnsujchfrixxsdpodygu.supabase.co'
BRAIN_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3VqY2hmcml4eHNkcG9keWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjkyNTQsImV4cCI6MjA5MDAwNTI1NH0.ef9DQbJPZ3m47gdz6zBfVnWKGInrsa-6idV3GmJSc6U'

_cache = {}


def get_secret(name: str) -> str:
    if name in _cache:
        return _cache[name]

    data = json.dumps({'secret_name': name}).encode()
    req = urllib.request.Request(
        f'{BRAIN_URL}/rest/v1/rpc/get_secret',
        data=data,
        headers={
            'Content-Type': 'application/json',
            'apikey': BRAIN_ANON_KEY,
            'Authorization': f'Bearer {BRAIN_ANON_KEY}',
        },
        method='POST',
    )
    with urllib.request.urlopen(req) as resp:
        value = json.loads(resp.read().decode())

    _cache[name] = value
    return value


def get_secrets(*names: str) -> dict:
    return {n: get_secret(n) for n in names}


def clear_cache():
    _cache.clear()
