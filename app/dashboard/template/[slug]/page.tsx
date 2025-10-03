"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import template from "@/utilis/template";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { runAi } from "@/app/actions/ai";
import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from "next/dynamic"; // Import dynamic for client-only imports
import toast from "react-hot-toast"
import { saveQuery } from "@/app/actions/ai";
import { useUser } from "@clerk/nextjs";
import { Template } from "@/utilis/types";
import { useUsage } from "@/context/usage";

const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), { ssr: false });


export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [query, setQuery] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);

  const editorRef = React.useRef<any>(null);
  const {fetchUsage} = useUsage();
  const { user } = useUser(); 
    // console.log("useuser() in slug", user);
  const email = user?.primaryEmailAddress?.emailAddress ||""; 

  React.useEffect(()=>{
if (content){
 const editorInstance = editorRef.current.getInstance();
  editorInstance.setMarkdown(content);
}
  },[content])

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  const t = slug ? template.find((item) => item.slug === slug) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!t) return;

    try {
      const data = await runAi(t.aiPrompt + query);
      setContent(data);
      await saveQuery(t, email, query, data);
      fetchUsage();
    } catch (err) {
      setContent("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!t) {
    return <div>Loading...</div>;
  }
  const handleCopy = async() => {
  const editorInstance = editorRef.current.getInstance();
  const c = editorInstance.getMarkdown();

  try {
    await navigator.clipboard.writeText(c);
  } catch (error) {
    toast.error("an error occurred. Please try again.");
  }
  };

  return (
    <div>
      <div className="justify-between mx-5 mb-2 flex">
        <Link href="/dashboard">
        <Button>
          <ArrowLeft/> <span className="ml-2">Back</span>
        </Button>
        </Link>
        <Button onClick={handleCopy}>
          <Copy/> <span className="ml-2">Copy</span>
        </Button>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5">
      <div className="col-span-1 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
        <div className="flex flex-col gap-3">
          <Image src={t.icon} alt={t.name} width={50} height={50} />
          <h2 className="font-medium text-lg">{t.name}</h2>
          <p className="text-grey-500">{t.desc}</p>
        </div>
        <form className="mt-6" onSubmit={handleSubmit}>
          {t.form.map((item) => (
            <div key={item.name} className="my-2 flex flex-col gap-2 mb-7">
              <label className="font-bold pb-5">{item.label}</label>
              {item.field === "input" ? (
                <Input
                  name={item.name}
                  onChange={(e) => setQuery(e.target.value)}
                  required={item.required}
                />
              ) : (
                <Textarea
                  name={item.name}
                  onChange={(e) => setQuery(e.target.value)}
                  required={item.required}
                />
              )}
            </div>
          ))}
          <Button type="submit" className="w-full py-6" disabled={loading}>
            {loading ? (
              <Loader2Icon className="animate-spin mr-2" />
            ) : (
              "Generate Content"
            )}
          </Button>
        </form>
      </div>
      <div className="col-span-2">
        <Editor
         ref={editorRef} 
        initialValue="Generated Content will Appear here"
         previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        // onChange={()=> setContent(editorRef.current.getInstance().getMarkdown())}
        />
      </div>
    </div>
    </div>
  );
}
