# Tool Definitions

**Course:** MCP & AI Tool Integration
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 5 of 10


  # Tool Definitions

  The tool definition is how Claude knows what your tool does, what inputs it needs, and when to use it. A great definition means Claude calls your tool correctly without any prompt engineering. A bad one means it guesses wrong or ignores your tool entirely.



    ## What Claude Sees

    When Claude connects to your MCP server, it calls `tools/list` and receives a JSON array of tool definitions. Each definition has three parts Claude uses to decide when and how to call your tool:



        name
        Unique identifier Claude uses to invoke the tool. Convention: `snake_case`.


        description
        Plain English explanation of WHEN to use this tool and WHAT it does. This is the most important field.


        inputSchema
        JSON Schema defining parameter names, types, descriptions, and which are required.





    ## Good vs Bad Descriptions

    The **description** field is what Claude reads to decide whether to use your tool. It is more important than the tool name. Here are real examples showing the difference:



        **&#x274C; Bad Description**

          "Searches stuff"

        Too vague. Claude does not know what "stuff" means, when to use it instead of other search tools, or what kind of results to expect.


        **&#x2705; Good Description**

          "Search through the project's documentation files by keyword. Returns matching file names and a preview of the matching paragraph. Use this when the user asks about how something works in the project."

        Tells Claude exactly what it searches, what it returns, and when to use it.





        **&#x274C; Bad Parameter Description**

          query: z.string()

        No `.describe()`. Claude has to guess what format the query should be in.


        **&#x2705; Good Parameter Description**

          query: z.string().describe(
  "Search keyword or phrase. Case-insensitive. Partial matches work."
)

        Claude knows the format, case behavior, and matching strategy.





    ## Zod Schema Patterns

    Zod is the schema library MCP uses. Here are the patterns you will use most often when defining tool inputs:


      Common Zod PatternsTypeScript
      // ── Basic Types ──────────────────────────────────────────
z.string().describe("The user's full name")
z.number().describe("Maximum number of results to return")
z.boolean().describe("Include archived items in results")

// ── Constrained Types ────────────────────────────────────
z.string().min(1).max(200).describe("Search query, 1-200 characters")
z.number().int().min(1).max(100).describe("Page size, 1-100")

// ── Enums — give Claude a fixed set of choices ──────────
z.enum(["asc", "desc"]).describe("Sort order: ascending or descending")
z.enum(["title", "date", "relevance"]).describe("Sort field")

// ── Optional Parameters ──────────────────────────────────
// Optional params let Claude omit them when not needed
z.number().optional().describe("Max results. Defaults to 10 if not provided.")
z.string().optional().describe("Filter by category. Omit for all categories.")

// ── Defaults ─────────────────────────────────────────────
z.number().default(10).describe("Max results (default: 10)")
z.boolean().default(false).describe("Include deleted items (default: false)")

// ── Arrays ───────────────────────────────────────────────
z.array(z.string()).describe("List of tag names to filter by")

// ── Nested Objects ───────────────────────────────────────
z.object({
  lat: z.number().describe("Latitude"),
  lng: z.number().describe("Longitude"),
}).describe("Geographic coordinates")




    ## Complete Example: A Well-Defined Tool

    Here is a production-quality tool definition that demonstrates all the patterns together:


      server.tsTypeScript
      server.tool(
  "search_documents",
  // Schema: every parameter has a type, constraint, and description
  {
    query: z.string().min(1).max(500).describe(
      "Search query. Supports keywords and phrases. Case-insensitive."
    ),
    max_results: z.number().int().min(1).max(50).default(10).describe(
      "Maximum number of documents to return (default: 10)"
    ),
    file_type: z.enum(["all", "markdown", "code", "pdf"]).default("all").describe(
      "Filter by file type. Use 'all' to search everything."
    ),
    include_preview: z.boolean().default(true).describe(
      "Include a text preview of each matching document (default: true)"
    ),
  },
  // Handler: receives validated args, returns structured content
  async ({ query, max_results, file_type, include_preview }) => {
    const results = await searchIndex(query, { max_results, file_type });

    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `No documents found matching "${query}".` }],
      };
    }

    const formatted = results.map(doc => {
      let line = `• ${doc.title} (${doc.type}, ${doc.score}% match)`;
      if (include_preview) line += `\n  ${doc.preview}`;
      return line;
    }).join("\n\n");

    return {
      content: [{
        type: "text",
        text: `Found ${results.length} document(s):\n\n${formatted}`,
      }],
    };
  }
);




    ## How Claude Decides Which Tool to Call

    When Claude receives a user message, it evaluates all available tool definitions through this decision process:



        1
        **Read all descriptions** — Claude reads the description field of every available tool to understand what each one does and when it should be used.


        2
        **Match intent to tool** — Based on the user's request and the tool descriptions, Claude selects the best tool (or decides no tool is needed).


        3
        **Generate arguments** — Claude reads each parameter's `.describe()` text, type, and constraints to generate correct values. Enums are particularly helpful — Claude picks from your list instead of guessing.


        4
        **Call the tool** — Claude sends a `tools/call` message with the generated arguments. The MCP SDK validates them against your Zod schema before your handler runs.




      **Key insight:** If Claude is not using your tool when it should, the problem is almost always the **description**. Make it more specific about WHEN to use the tool. If Claude is passing wrong values, improve the parameter `.describe()` strings.




    ## What the JSON Schema Looks Like

    Your Zod schema is automatically converted to JSON Schema and sent to Claude. Here is what the `search_documents` tool above looks like from Claude's perspective:


      tools/list response (simplified)JSON
      {
  "name": "search_documents",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "minLength": 1,
        "maxLength": 500,
        "description": "Search query. Supports keywords and phrases. Case-insensitive."
      },
      "max_results": {
        "type": "integer",
        "minimum": 1,
        "maximum": 50,
        "default": 10,
        "description": "Maximum number of documents to return (default: 10)"
      },
      "file_type": {
        "type": "string",
        "enum": ["all", "markdown", "code", "pdf"],
        "default": "all",
        "description": "Filter by file type. Use 'all' to search everything."
      },
      "include_preview": {
        "type": "boolean",
        "default": true,
        "description": "Include a text preview of each matching document (default: true)"
      }
    },
    "required": ["query"]
  }
}


    Notice: `query` is in the `required` array because it has no `.default()` or `.optional()`. The other parameters are optional — Claude can omit them and the defaults kick in. This is the Zod-to-JSON-Schema translation happening automatically.



    ## Building Your Own Tool Definitions

    When building a tool definition, start with these three questions: (1) What should the tool be called? Use `snake_case` and make it descriptive. (2) When should Claude use it? Write a clear description. (3) What inputs does it need? Define each parameter with type, constraints, and a `.describe()` string. The complete example above (`search_documents`) demonstrates all of these elements working together.



### Quiz

**Q1: Which field in a tool definition is most important for Claude to decide WHEN to use the tool?**
    A. The tool name
  ✓ B. The description field
    C. The required parameters list
    D. The return type
  *The description field is what Claude reads to decide when to invoke a tool. A clear, specific description means Claude calls your tool at exactly the right moment without extra prompt engineering.*

**Q2: In JSON Schema, what does the required array inside inputSchema specify?**
    A. Which parameters are strings
  ✓ B. Which parameters Claude must provide — if absent the call fails
    C. Which parameters have default values
    D. Which parameters are read-only
  *The required array lists parameter names that must be provided in every tool call. If Claude omits a required parameter, the MCP protocol rejects the call before it reaches your handler.*

**Q3: How do you make a parameter optional in a Zod schema?**
  ✓ A. Add .optional() or .default(value) to the chain
    B. Set required: false in the JSON Schema
    C. Pass null as the default in server.tool()
    D. Optional parameters are not supported in MCP
  *Use .optional() to let Claude omit the parameter entirely, or .default(value) to provide a fallback. Both result in the parameter being excluded from the JSON Schema required array.*

**Q4: If Claude is calling your tool with wrong argument values, what should you fix first?**
    A. The tool name
    B. The handler logic
  ✓ C. The .describe() strings on each parameter
    D. The transport configuration
  *Claude generates argument values by reading the .describe() text on each parameter. If the descriptions are vague or ambiguous, Claude will guess wrong. Make descriptions specific about format, range, and meaning.*



### Tool Definition Concepts

**Card 1:**
Front: inputSchema
Back: The JSON Schema object inside a tool definition. Has type: "object", a properties map, and a required array. Claude uses this to know what to pass.

**Card 2:**
Front: properties
Back: A map of parameter name to type definition. Each entry specifies type (string/number/boolean/enum), constraints, and a description Claude reads.

**Card 3:**
Front: required array
Back: Lists which parameter names are mandatory. Parameters with .default() or .optional() in Zod are excluded from required. If Claude omits a required param, the call is rejected.

**Card 4:**
Front: z.enum()
Back: Defines a fixed set of allowed values. Claude picks from your list instead of guessing. Example: z.enum(["asc", "desc"]) constrains to exactly two valid values.

**Card 5:**
Front: z.string().describe()
Back: Defines a string parameter with a description. Claude reads the description to know what value to generate. Always include .describe() — without it, Claude is guessing blind.

**Card 6:**
Front: Description vs Name
Back: The description is MORE important than the name. Claude reads descriptions to decide WHEN to use a tool. A descriptive name helps, but the description drives the decision.

**Card 7:**
Front: Zod-to-JSON-Schema
Back: The MCP SDK automatically converts your Zod schema to JSON Schema for the tools/list response. You write Zod, Claude receives JSON Schema. The conversion is transparent.
