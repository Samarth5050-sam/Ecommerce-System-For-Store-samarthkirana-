import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface ProductCatalog {
  id: string;
  name: string;
  nameHindi?: string;
  category: string;
  price: number;
  unit: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cartItems, productCatalog } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!cartItems || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ recommendations: [], reason: "Cart is empty" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a summary of cart items for the AI
    const cartSummary = cartItems.map((item: CartItem) => 
      `${item.name} (${item.category})`
    ).join(", ");

    // Create catalog summary (just names and categories for context)
    const catalogSummary = productCatalog.slice(0, 50).map((p: ProductCatalog) => 
      `${p.id}:${p.name}:${p.category}`
    ).join("|");

    const systemPrompt = `You are a helpful Indian grocery store assistant. Based on the customer's cart, recommend 3-4 complementary products that would go well with their purchase.

Rules:
- Recommend products that complement the cart items (e.g., if they have rice, suggest dal or ghee)
- Consider Indian cooking patterns (e.g., spices with grains, tea with biscuits)
- Only recommend products from the provided catalog
- Return ONLY product IDs, no explanations
- Focus on cross-category recommendations for variety

Product catalog format: id:name:category separated by |`;

    const userPrompt = `Customer cart: ${cartSummary}

Available products: ${catalogSummary}

Return exactly 3-4 product IDs that would complement this cart, as a JSON array of strings. Example: ["g1", "s5", "d2"]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later.", recommendations: [] }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits.", recommendations: [] }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse the AI response - extract JSON array from the response
    let recommendedIds: string[] = [];
    try {
      // Try to find a JSON array in the response
      const jsonMatch = content.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        recommendedIds = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback: extract quoted strings
      const matches = content.match(/"([^"]+)"/g);
      if (matches) {
        recommendedIds = matches.map((m: string) => m.replace(/"/g, ""));
      }
    }

    // Filter out items already in cart
    const cartIds = cartItems.map((item: CartItem) => item.id);
    recommendedIds = recommendedIds.filter((id: string) => !cartIds.includes(id));

    // Limit to 4 recommendations
    recommendedIds = recommendedIds.slice(0, 4);

    return new Response(
      JSON.stringify({ recommendations: recommendedIds }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Recommendation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error", 
        recommendations: [] 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
