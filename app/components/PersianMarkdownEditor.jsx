"use client";

import React, { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Code,
  Minus,
  RotateCcw,
  RotateCw,
  Link as LinkIcon,
} from "lucide-react";
import { htmlToMarkdown } from "@/app/lib/htmlToMarkdown";

export default function PersianMarkdownEditor({
  value = "",
  onChange,
  height = 300,
}) {
  const editorRef = useRef(null);
  const [active, setActive] = useState({});

  useEffect(() => {
    if (!editorRef.current) return;
    if (document.activeElement === editorRef.current) return;

    const htmlContent = value ? marked.parse(value) : "";

    if (editorRef.current.innerHTML !== htmlContent) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [value]);

  const updateActiveStates = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strike: document.queryCommandState("strikeThrough"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
    });
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveStates);
    return () =>
      document.removeEventListener("selectionchange", updateActiveStates);
  }, []);

  const triggerChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const markdown = htmlToMarkdown(html);
      onChange?.(markdown);
    }
  };

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current.focus();
    triggerChange();
  };

  const Btn = ({ title, active, onClick, children }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-2 rounded-md transition ${active ? "bg-[#0077C8] text-white" : "hover:bg-gray-200"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Btn title="H1" onClick={() => exec("formatBlock", "h1")}>
          <Heading1 size={16} />
        </Btn>
        <Btn title="H2" onClick={() => exec("formatBlock", "h2")}>
          <Heading2 size={16} />
        </Btn>
        <Btn title="Bold" active={active.bold} onClick={() => exec("bold")}>
          <Bold size={16} />
        </Btn>
        <Btn
          title="Italic"
          active={active.italic}
          onClick={() => exec("italic")}
        >
          <Italic size={16} />
        </Btn>
        <Btn
          title="Underline"
          active={active.underline}
          onClick={() => exec("underline")}
        >
          <Underline size={16} />
        </Btn>
        <Btn
          title="Strike"
          active={active.strike}
          onClick={() => exec("strikeThrough")}
        >
          <Strikethrough size={16} />
        </Btn>
        <Btn title="Quote" onClick={() => exec("formatBlock", "blockquote")}>
          <Quote size={16} />
        </Btn>
        <Btn title="Code" onClick={() => exec("formatBlock", "pre")}>
          <Code size={16} />
        </Btn>
        <Btn title="Divider" onClick={() => exec("insertHorizontalRule")}>
          <Minus size={16} />
        </Btn>
        <Btn
          title="UL"
          active={active.ul}
          onClick={() => exec("insertUnorderedList")}
        >
          <List size={16} />
        </Btn>
        <Btn
          title="OL"
          active={active.ol}
          onClick={() => exec("insertOrderedList")}
        >
          <ListOrdered size={16} />
        </Btn>
        <Btn title="Undo" onClick={() => exec("undo")}>
          <RotateCcw size={16} />
        </Btn>
        <Btn title="Redo" onClick={() => exec("redo")}>
          <RotateCw size={16} />
        </Btn>
        <Btn
          title="Link"
          onClick={() => exec("createLink", prompt("آدرس لینک:"))}
        >
          <LinkIcon size={16} />
        </Btn>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={triggerChange}
        className="p-4 outline-none text-sm min-h-[200px] overflow-y-auto max-w-none editor-content"
        style={{ height }}
        data-placeholder="متن را اینجا بنویسید..."
        suppressContentEditableWarning
      />

      <style jsx global>{`
        .editor-content,
        .editor-content * {
          direction: rtl !important;
          text-align: right !important;
          unicode-bidi: plaintext !important;
        }
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #999;
          pointer-events: none;
          display: block;
        }
        
        .editor-content h1 {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .editor-content h2 {
          font-size: 1.4rem;
          font-weight: bold;
          margin-bottom: 0.4rem;
        }
        .editor-content blockquote {
          border-right: 4px solid #ccc;
          padding-right: 1rem;
          margin: 1rem 0;
          color: #666;
        }
        .editor-content pre {
          background: #f4f4f4;
          padding: 1rem;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
