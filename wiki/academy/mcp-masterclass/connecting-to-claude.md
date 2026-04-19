# Connecting to Claude

**Course:** MCP & AI Tool Integration
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 7 of 10


  # Connecting to Claude

  Walk through the four phases of connecting an MCP server to Claude Desktop or Claude Code -- from installation to live tool usage. Click each phase tab below to walk through the process step by step.



      ## Phase 1: Install Your MCP Server

      In this phase, you get the MCP server code onto your machine. MCP servers are typically Node.js packages published to npm, or standalone scripts you run locally. Installation is straightforward:


        &#x1F4E6;

          ### Option A: Install from npm

          Most community MCP servers are published as npm packages. Install globally or use npx:



        Terminalbash
        # Install a community MCP server globally
npm install -g @modelcontextprotocol/server-filesystem

# Or use npx to run without installing
npx @modelcontextprotocol/server-filesystem /path/to/allowed/dir



        &#x1F4BB;

          ### Option B: Run your own server

          If you built a custom server (like in Lesson 4), you can run it directly with Node or compile it first:



        Terminalbash
        # Run a TypeScript server with tsx
npx tsx my-server.ts

# Or compile and run
tsc my-server.ts && node my-server.js





      ## Phase 2: Configure in Claude

      In this phase, you tell Claude where to find your server by editing a config file. This JSON file maps server names to the commands that launch them.


        &#x1F4C4;

          ### Claude Desktop Config Location

          macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

          Windows: `%APPDATA%\Claude\claude_desktop_config.json`




        claude_desktop_config.jsonJSON
        {
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/projects"
      ]
    },
    "database": {
      "command": "node",
      "args": ["./my-db-server.js"],
      "env": {
        "DB_URL": "postgresql://localhost/mydb"
      }
    }
  }
}



        &#x1F527;

          ### Key Config Fields

          `command` — The program to run (node, npx, python, etc.). This is what launches your server.

          `args` — Extra information passed to the command, like which directory to access or which server package to use.

          `env` — Secret values the server needs to work, like API keys or database connection strings. These stay on your machine.






      ## Phase 3: Claude Discovers Tools

      In this phase, Claude automatically connects to your server and asks "what can you do?" This handshake happens every time Claude starts. Here is what happens under the hood:


        1

          ### Initialize Connection

          Claude sends an `initialize` request with its protocol version and capabilities. The server responds with its own capabilities.



        2

          ### List Available Tools

          Claude sends `tools/list`. The server returns all available tool definitions — names, descriptions, and input schemas.



        3

          ### Ready to Use

          Claude now knows every tool available across all connected servers. It can decide autonomously when to invoke them based on user requests.






      ## Phase 4: Claude Uses Tools

      Now the connection is live. When a user asks a question that needs external data or action, Claude automatically selects and invokes the right tool from your server:


        &#x1F464;

          ### User: "What files are in my src directory?"

          The user asks a question that requires filesystem access.



        &#x1F9E0;

          ### Claude decides to use list_directory

          Claude reads the tool definitions, identifies that `list_directory` from the filesystem server matches the need, and generates the call.




        Tool Call (JSON-RPC)JSON
        {
  "method": "tools/call",
  "params": {
    "name": "list_directory",
    "arguments": {
      "path": "/Users/you/projects/src"
    }
  }
}



        &#x2705;

          ### Server returns file listing, Claude responds

          The filesystem server reads the directory and returns the results. Claude uses this real data to give an accurate, helpful response.





    ## Claude Code Configuration

    Claude Code (the CLI tool) uses a different config location. MCP servers are configured in your project's `.mcp.json` file or in the global settings:


      .mcp.json (project root)JSON
      {
  "mcpServers": {
    "notes": {
      "command": "npx",
      "args": ["tsx", "./my-notes-server/server.ts"]
    }
  }
}


    You can also add MCP servers interactively via `/mcp` in Claude Code. The format is the same — command, args, and optional env.



    ## Troubleshooting

    When your MCP server is not connecting, check these common issues in order:



        **Server not appearing in Claude**
        **Fix:** Restart Claude Desktop after editing config. Check that your JSON is valid (a missing comma or bracket breaks everything). Use `npx jsonlint claude_desktop_config.json` to validate.


        **Tools show but calls fail silently**
        **Fix:** Your server crashes during handler execution. Run it manually in a terminal to see errors: `npx tsx server.ts`. Check stderr output. Common cause: missing environment variables (the `env` field is not set in config).


        **"npx: command not found" in Claude**
        **Fix:** Claude Desktop does not inherit your shell's PATH. Use the full absolute path: `/usr/local/bin/npx` or `/opt/homebrew/bin/npx` (find it with `which npx` in your terminal).


        **Server works locally but not in Claude**
        **Fix:** Most likely a relative path issue. Claude launches servers from a different working directory. Always use absolute paths for file arguments, e.g. `/Users/you/project/server.ts` not `./server.ts`.


        **Multiple servers — some work, some do not**
        **Fix:** Each server is independent. If one fails, check its config entry specifically. Look at Claude Desktop's developer tools (View → Developer → Developer Tools) for MCP connection errors in the console.





### Quiz

**Q1: Where do you configure MCP servers for Claude Desktop on macOS?**
    A. In the Claude Desktop UI settings panel
  ✓ B. In claude_desktop_config.json in ~/Library/Application Support/Claude/
    C. In the server package.json file
    D. In a .env file at the project root
  *MCP servers are configured in claude_desktop_config.json, located at ~/Library/Application Support/Claude/ on macOS or %APPDATA%\Claude\ on Windows.*

**Q2: What happens during the MCP capability negotiation phase when Claude starts?**
    A. The user manually selects which tools to enable
  ✓ B. Claude sends initialize then tools/list to discover available tools
    C. The server pushes notifications to Claude automatically
    D. The client uploads all local data to the server
  *During negotiation, Claude sends an initialize request with its protocol version, the server responds with capabilities, then Claude sends tools/list to discover all available tool definitions.*

**Q3: Your MCP server works when you run it manually in the terminal, but Claude Desktop says no tools are available. What is the most likely cause?**
    A. The server needs to be rewritten in Python
  ✓ B. The command path in config is relative instead of absolute
    C. Claude Desktop does not support custom servers
    D. The server needs a paid license
  *Claude Desktop launches servers from its own working directory, not your project directory. Relative paths like ./server.ts will not resolve. Always use absolute paths like /Users/you/project/server.ts.*


### Config File Fields

**Card 1:**
Front: command field in claude_desktop_config.json
Back: The program that launches your server — e.g. node, npx, or python. This is the executable Claude runs to start the MCP server.

**Card 2:**
Front: args field in claude_desktop_config.json
Back: Array of arguments passed to the command. Used to specify which server package to load, which directory to allow access to, etc.

**Card 3:**
Front: env field in claude_desktop_config.json
Back: Key-value pairs for environment variables. Use this for secrets like API keys or DB connection strings. They stay on your machine and never leave.

**Card 4:**
Front: initialize (MCP message)
Back: The first message Claude sends when connecting. Includes protocol version and capabilities. Server responds with its own capabilities.

**Card 5:**
Front: tools/list (MCP message)
Back: Sent by Claude after initialize. The server returns all available tool definitions. Claude stores these to know what it can call.
