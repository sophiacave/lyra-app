#!/bin/bash
# Like One Studio — Emergency Mode
# WRITTEN IN STONE 2026-03-29
#
# Activates full local stack when Claude subscription is unavailable.
# All capabilities preserved via Ollama on M3 Max 64GB.
#
# Usage: ./studio/emergency-mode.sh [status|activate|test]

set -euo pipefail

OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
REQUIRED_MODELS=("qwen2.5:32b" "llama3.1:8b")

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

status() {
    echo ""
    echo "  Like One Studio — Emergency Mode Status"
    echo "  ========================================"
    echo ""

    # Check Ollama
    if curl -sf "${OLLAMA_HOST}/api/tags" > /dev/null 2>&1; then
        echo -e "  Ollama:     ${GREEN}ONLINE${NC}"
        MODELS=$(curl -sf "${OLLAMA_HOST}/api/tags" | python3 -c "import sys,json; [print(f'    - {m[\"name\"]}') for m in json.load(sys.stdin).get('models',[])]" 2>/dev/null)
        echo "  Models:"
        echo "$MODELS"
    else
        echo -e "  Ollama:     ${RED}OFFLINE${NC}"
        echo "  Fix: ollama serve"
    fi
    echo ""

    # Check required models
    for model in "${REQUIRED_MODELS[@]}"; do
        model_base="${model%%:*}"
        if ollama list 2>/dev/null | grep -q "$model_base"; then
            echo -e "  ${model}: ${GREEN}READY${NC}"
        else
            echo -e "  ${model}: ${RED}MISSING${NC} (run: ollama pull ${model})"
        fi
    done
    echo ""

    # Check other infrastructure
    echo "  Infrastructure:"
    if command -v git &>/dev/null; then echo -e "    git:      ${GREEN}OK${NC}"; else echo -e "    git:      ${RED}MISSING${NC}"; fi
    if command -v node &>/dev/null; then echo -e "    node:     ${GREEN}OK${NC} ($(node --version))"; else echo -e "    node:     ${RED}MISSING${NC}"; fi
    if command -v ffmpeg &>/dev/null; then echo -e "    ffmpeg:   ${GREEN}OK${NC}"; else echo -e "    ffmpeg:   ${RED}MISSING${NC}"; fi
    if command -v python3 &>/dev/null; then echo -e "    python3:  ${GREEN}OK${NC}"; else echo -e "    python3:  ${RED}MISSING${NC}"; fi
    if command -v supabase &>/dev/null; then echo -e "    supabase: ${GREEN}OK${NC}"; else echo -e "    supabase: ${RED}MISSING${NC}"; fi
    echo ""

    # Check Vercel deploy (git push still works without Claude)
    if [ -d ~/lyra-app/.git ]; then
        echo -e "  Vercel deploy: ${GREEN}READY${NC} (git push triggers auto-deploy)"
    else
        echo -e "  Vercel deploy: ${RED}NO GIT REPO${NC}"
    fi
    echo ""

    # Studio pipeline
    if [ -f ~/lyra-app/studio/compose-v4.js ]; then
        echo -e "  Studio pipeline: ${GREEN}READY${NC} (compose-v4 + graphics-engine + QA gate)"
    else
        echo -e "  Studio pipeline: ${YELLOW}CHECK FILES${NC}"
    fi
    echo ""
}

activate() {
    echo ""
    echo "  Activating Emergency Mode..."
    echo "  ============================"
    echo ""

    # Ensure Ollama is running
    if ! curl -sf "${OLLAMA_HOST}/api/tags" > /dev/null 2>&1; then
        echo "  Starting Ollama..."
        ollama serve &>/dev/null &
        sleep 3
    fi

    # Pull missing models
    for model in "${REQUIRED_MODELS[@]}"; do
        model_base="${model%%:*}"
        if ! ollama list 2>/dev/null | grep -q "$model_base"; then
            echo "  Pulling ${model}..."
            ollama pull "$model"
        else
            echo -e "  ${model}: ${GREEN}already available${NC}"
        fi
    done

    echo ""
    echo -e "  ${GREEN}Emergency mode ACTIVE.${NC}"
    echo "  All studio commands now route to local Ollama."
    echo "  Screenplay: node studio/lib/screenplay-generator.js --provider ollama"
    echo "  Deploys: git push (Vercel auto-deploys)"
    echo "  Brain: supabase CLI (direct access)"
    echo ""
}

test_local() {
    echo ""
    echo "  Testing Local Pipeline..."
    echo "  ========================="
    echo ""

    # Test Ollama generation
    echo "  Testing qwen2.5:32b..."
    RESULT=$(curl -sf "${OLLAMA_HOST}/api/generate" \
        -d '{"model":"qwen2.5:32b","prompt":"In one sentence, what is AI?","stream":false,"options":{"temperature":0.3}}' \
        | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'  Response: {d[\"response\"][:150]}'); print(f'  Tokens/s: {d.get(\"eval_count\",0)/(d.get(\"eval_duration\",1)/1e9):.0f}')" 2>/dev/null)
    echo "$RESULT"
    echo ""

    # Test ollama-engine.js
    echo "  Testing ollama-engine.js..."
    cd ~/lyra-app && node studio/lib/ollama-engine.js
}

case "${1:-status}" in
    status)   status ;;
    activate) activate ;;
    test)     test_local ;;
    *)
        echo "Usage: $0 [status|activate|test]"
        exit 1
        ;;
esac
