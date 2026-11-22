const ALLOWED="https://YOUR-NAME.github.io";
export default{async fetch(req,env){
 const cors={"Access-Control-Allow-Origin":ALLOWED,"Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST"};
 if(req.method==="OPTIONS")return new Response(null,{headers:cors});
 const{message,context}=await req.json();
 const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
  body:JSON.stringify({model:"claude-haiku-5-5",max_tokens:400,system:"You are the guide of BMWorld, a BMW fan site. Answer briefly about BMW cars and history. Use the site data below when relevant; if a value says TBD, say it is not verified. Do not invent specs.\n"+JSON.stringify(context||{}),messages:[{role:"user",content:String(message).slice(0,500)}]})});
 const d=await r.json();return new Response(JSON.stringify({reply:(d.content&&d.content[0]&&d.content[0].text)||"Sorry, no answer."}),{headers:{...cors,"content-type":"application/json"}})}};
