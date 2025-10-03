"use client";
import { useState } from 'react';
import {runAi} from '@/app/actions/ai'
import {Button} from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Card ,CardHeader, CardContent} from '@/components/ui/card';
import { Divide } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
export default function Page(){
  const [response ,setresponse] = useState("");
  const [loading, setloading] = useState(false);
  const [query , setquery] = useState("")


  const handleclick = async (e:any)=>{
    e.preventDefault();
    setloading(true);
    try {
      const data = await runAi(query);
      setresponse(data);
    } catch (error) {
      console.error(error)
    }finally{
      setloading(false);
    }
  }
  return(
   <div className='m-5'>
    <form onSubmit={handleclick}>
     <Input className='mb-5' placeholder='Ask anything' value={query} onChange={(e) => setquery(e.target.value)}/>
     <Button>Generate with ai</Button>
     <Card className='mt-5'>
      <CardHeader>Ai Response

      </CardHeader>
      <CardContent>
        {loading ? <div>Loading..</div>: <ReactMarkdown>
        {response}
        </ReactMarkdown>}
        
      </CardContent>
     </Card>
    </form>
    </div>
  );
}

