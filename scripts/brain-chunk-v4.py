#!/usr/bin/env python3
"""Brain V4 — Intelligent Chunking Pipeline
Splits long brain_context entries into semantic chunks,
embeds each chunk via local Qwen3-Embedding, stores in brain_chunks table.
"""

import json, time, re, subprocess, requests

BRAIN_REF = "tnsujchfrixxsdpodygu"
BRAIN_URL = f"https://{BRAIN_REF}.supabase.co/rest/v1"
EMBED_URL = "http://localhost:8000/embed_batch"
MIN_ENTRY_LEN = 2000  # Only chunk entries longer than this
CHUNK_TARGET = 800    # Target chunk size (chars)
CHUNK_MIN = 300       # Minimum chunk size
CHUNK_MAX = 1500      # Maximum chunk size
OVERLAP = 100         # Overlap between chunks for context continuity

# Auth from Keychain
result = subprocess.run(
    ["security", "find-generic-password", "-s", "likeone-brain-v2-service", "-a", "supabase", "-w"],
    capture_output=True, text=True
)
BRAIN_KEY = result.stdout.strip()
assert BRAIN_KEY, "No key in Keychain"

HEADERS = {
    "apikey": BRAIN_KEY,
    "Authorization": f"Bearer {BRAIN_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}


def smart_chunk(text, key, category):
    """Split text into semantic chunks at paragraph/section boundaries."""
    if len(text) <= MIN_ENTRY_LEN:
        return [text]

    # Try to split on double newlines (paragraphs) first
    paragraphs = re.split(r'\n\n+', text)

    chunks = []
    current = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        # If adding this paragraph keeps us under max, add it
        if len(current) + len(para) + 2 <= CHUNK_MAX:
            current = (current + "\n\n" + para).strip() if current else para
        else:
            # Current chunk is ready
            if len(current) >= CHUNK_MIN:
                chunks.append(current)
                # Start new chunk with overlap
                overlap_text = current[-OVERLAP:] if len(current) > OVERLAP else ""
                current = overlap_text + "\n\n" + para if overlap_text else para
            elif current:
                # Current too small, force merge
                current = (current + "\n\n" + para).strip()
            else:
                current = para

            # If single paragraph is too long, split on sentences
            if len(current) > CHUNK_MAX:
                sentences = re.split(r'(?<=[.!?])\s+', current)
                sub_chunk = ""
                for sent in sentences:
                    if len(sub_chunk) + len(sent) + 1 <= CHUNK_MAX:
                        sub_chunk = (sub_chunk + " " + sent).strip() if sub_chunk else sent
                    else:
                        if len(sub_chunk) >= CHUNK_MIN:
                            chunks.append(sub_chunk)
                        sub_chunk = sent
                current = sub_chunk

    # Don't forget the last chunk
    if current and len(current) >= CHUNK_MIN:
        chunks.append(current)
    elif current and chunks:
        # Merge tiny remainder into last chunk
        chunks[-1] = chunks[-1] + "\n\n" + current
    elif current:
        chunks.append(current)

    return chunks


def format_chunk_text(key, category, description, chunk_text, chunk_idx, total_chunks):
    """Format chunk for embedding with parent context."""
    return f"[{category}] {key} (chunk {chunk_idx+1}/{total_chunks})\n{description or 'No description'}\n---\n{chunk_text}"


def main():
    print("🧠 Brain V4 — Intelligent Chunking Pipeline")
    print("=" * 55)

    # 1. Fetch long entries
    print("\n📥 Fetching entries >2000 chars...")
    resp = requests.get(
        f"{BRAIN_URL}/brain_context?select=id,key,category,description,value"
        f"&order=key",
        headers={**HEADERS, "Prefer": ""},
    )
    assert resp.status_code == 200, f"Fetch failed: {resp.status_code}"
    all_entries = resp.json()

    long_entries = []
    for e in all_entries:
        val = e.get("value", "")
        if isinstance(val, (dict, list)):
            val_text = json.dumps(val, indent=2, ensure_ascii=False)
        else:
            val_text = str(val)
        if len(val_text) > MIN_ENTRY_LEN:
            e["_val_text"] = val_text
            long_entries.append(e)

    print(f"   {len(all_entries)} total entries, {len(long_entries)} need chunking")

    # 2. Check which already have chunks
    resp2 = requests.get(
        f"{BRAIN_URL}/brain_chunks?select=parent_id&limit=1000",
        headers={**HEADERS, "Prefer": ""},
    )
    existing_parents = set()
    if resp2.status_code == 200:
        existing_parents = {r["parent_id"] for r in resp2.json()}

    to_chunk = [e for e in long_entries if e["id"] not in existing_parents]
    print(f"   {len(existing_parents)} already chunked, {len(to_chunk)} to process")

    if not to_chunk:
        print("\n✅ Nothing to chunk!")
        return

    # 3. Chunk all entries
    print(f"\n✂️  Chunking {len(to_chunk)} entries...")
    all_chunks = []  # (parent_id, chunk_idx, chunk_text, embed_text)

    for e in to_chunk:
        chunks = smart_chunk(e["_val_text"], e["key"], e["category"])
        for i, chunk in enumerate(chunks):
            embed_text = format_chunk_text(
                e["key"], e["category"], e.get("description"),
                chunk, i, len(chunks)
            )
            all_chunks.append({
                "parent_id": e["id"],
                "key": e["key"],
                "chunk_index": i,
                "chunk_text": chunk,
                "embed_text": embed_text,
                "token_count": len(chunk.split())
            })
        print(f"   {e['key']}: {len(e['_val_text'])} chars → {len(chunks)} chunks")

    print(f"\n   Total: {len(all_chunks)} chunks from {len(to_chunk)} entries")

    # 4. Embed all chunks
    print(f"\n🚀 Embedding {len(all_chunks)} chunks...")
    start = time.time()

    texts = [c["embed_text"] for c in all_chunks]
    all_embeddings = []
    BATCH = 32

    for i in range(0, len(texts), BATCH):
        batch = texts[i:i+BATCH]
        r = requests.post(EMBED_URL, json={"texts": batch, "normalize": True}, timeout=120)
        if r.status_code != 200:
            print(f"  ❌ Batch {i//BATCH}: {r.status_code} {r.text[:100]}")
            # Fill with None to keep alignment
            all_embeddings.extend([None] * len(batch))
            continue
        data = r.json()
        all_embeddings.extend(data["embeddings"])
        print(f"  ✅ Batch {i//BATCH+1}/{(len(texts)+BATCH-1)//BATCH}: {len(batch)} chunks ({data.get('processing_time_ms', 0):.0f}ms)")

    embed_time = time.time() - start
    embedded_count = sum(1 for e in all_embeddings if e is not None)
    print(f"\n⏱️  Embed: {embed_time:.1f}s ({embedded_count}/{len(all_chunks)} vectors)")

    # 5. Insert into brain_chunks
    print(f"\n💾 Writing to brain_chunks...")
    ok, err = 0, 0

    for chunk, emb in zip(all_chunks, all_embeddings):
        if emb is None:
            err += 1
            continue

        row = {
            "parent_id": chunk["parent_id"],
            "chunk_index": chunk["chunk_index"],
            "chunk_text": chunk["chunk_text"],
            "embedding": emb,
            "token_count": chunk["token_count"]
        }

        r = requests.post(
            f"{BRAIN_URL}/brain_chunks",
            headers=HEADERS,
            json=row
        )
        if r.status_code in (200, 201, 204):
            ok += 1
        else:
            err += 1
            if err <= 5:
                print(f"  ❌ {chunk['key']}[{chunk['chunk_index']}]: {r.status_code} {r.text[:100]}")

        if (ok + err) % 50 == 0:
            print(f"  📊 {ok + err}/{len(all_chunks)} ({ok} ok, {err} err)")

    # 6. Update chunk_count on parent entries
    print(f"\n📊 Updating chunk counts...")
    for e in to_chunk:
        chunk_count = sum(1 for c in all_chunks if c["parent_id"] == e["id"])
        requests.patch(
            f"{BRAIN_URL}/brain_context?id=eq.{e['id']}",
            headers=HEADERS,
            json={"chunk_count": chunk_count}
        )

    total = time.time() - start
    print(f"\n✅ DONE: {ok} chunks written, {err} errors, {total:.1f}s total")
    print(f"   {len(to_chunk)} entries chunked → {ok} searchable chunks")


if __name__ == "__main__":
    main()
