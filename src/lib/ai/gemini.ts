//TODO:for now turned of ,may delete it next time 

// export async function generateRecipeSuggestions(ingredients: string[], prompt: string) {
//     console.log("🚀 ~ generateRecipeSuggestions ~ prompt:", prompt)
//     const parts = [{text:'answer in the lenguge of the user'},{text:` ${prompt}`}, {text: `${ingredients.join(', ')}`}]
  
//     const res = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [{ parts}],
//         }),
//       }
//     )
  
//     const data = await res.json()
//     const text = data.candidates?.[0]?.content?.parts?.[0]?.text
//     return text || 'Sorry, I could not generate a recipe.'
//   }