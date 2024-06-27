export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mood = searchParams.get('mood');

    try{
      const res = await fetch(`https://port-0-food-wizard-back-lxqv758ld43b2f8f.sel5.cloudtype.app/api/bot/chat?prompt=${mood}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json();

      return Response.json({ data });

    }catch(err){
      console.log(err)
    }


   
 
  }