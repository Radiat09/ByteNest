"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaHeading,
  FaParagraph,
  FaLink,
  FaUndo,
  FaRedo,
  FaQuoteLeft,
  FaCode,
  FaMinus,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaMagic,
} from "react-icons/fa";
import { Highlighter } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const ALLOWED_TAGS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "a",
  "blockquote",
  "pre",
  "code",
  "hr",
  "mark",
  "br",
  "span",
]);

function cleanHtml(html: string): string {
  if (!html || !html.trim()) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const container = doc.querySelector("div");
  if (!container) return html;

  function cleanNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.trim() ? node.cloneNode(true) : null;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tag)) {
      const fragment = document.createDocumentFragment();
      el.childNodes.forEach((child) => {
        const cleaned = cleanNode(child);
        if (cleaned) fragment.appendChild(cleaned);
      });
      return fragment.childNodes.length > 0 ? fragment : null;
    }

    const clone = document.createElement(tag);

    if (tag === "a") {
      clone.setAttribute("href", el.getAttribute("href") || "");
    }

    el.childNodes.forEach((child) => {
      const cleaned = cleanNode(child);
      if (cleaned) clone.appendChild(cleaned);
    });

    if (!clone.textContent?.trim() && clone.tagName !== "BR" && clone.tagName !== "HR") {
      return null;
    }

    if (
      ["div", "span", "section", "article", "header", "footer", "main", "aside"].includes(tag)
    ) {
      const p = document.createElement("p");
      clone.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE && !child.textContent?.trim()) return;
        p.appendChild(child.cloneNode(true));
      });
      return p.textContent?.trim() ? p : null;
    }

    return clone;
  }

  const cleaned = document.createElement("div");
  Array.from(container.childNodes).forEach((child) => {
    const result = cleanNode(child);
    if (result) {
      cleaned.appendChild(result.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? result.cloneNode(true) : result);
    }
  });

  return cleaned.innerHTML;
}

function ToolbarButton({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 text-xs transition-colors",
        isActive
          ? "bg-brand/10 text-brand"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    if (linkOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [linkOpen]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand underline underline-offset-2",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[160px] p-3 outline-none focus:outline-none",
      },
      handlePaste: (view, event) => {
        const html = event.clipboardData?.getData("text/html");
        if (html) {
          event.preventDefault();
          const cleaned = cleanHtml(html);
          editor.commands.insertContent(cleaned);
          onChange(cleaned);
          return true;
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleAutoFormat = () => {
    const html = editor.getHTML();
    const cleaned = cleanHtml(html);
    editor.commands.setContent(cleaned);
    onChange(cleaned);
  };

  return (
    <div className={cn("rounded-lg border border-gray-200 overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          title="Undo"
        >
          <FaUndo />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          title="Redo"
        >
          <FaRedo />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <FaBold />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <FaItalic />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <FaUnderline />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <FaListUl />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <FaListOl />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading"
        >
          <FaHeading />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <FaParagraph />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <FaAlignLeft />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <FaAlignCenter />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <FaAlignRight />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="Align Justify"
        >
          <FaAlignJustify />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <FaQuoteLeft />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <FaCode />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          title="Divider"
        >
          <FaMinus />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive("link")}
          title="Link"
        >
          <FaLink />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter className="size-3.5" />
        </ToolbarButton>

        <div className="relative">
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            value={editor.getAttributes("textStyle").color || "#000000"}
            className="absolute inset-0 opacity-0 cursor-pointer w-6 h-6"
            title="Text Color"
          />
          <span
            className="inline-flex items-center justify-center rounded-md p-1.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            style={{ color: editor.getAttributes("textStyle").color || "#000000" }}
          >
            A
          </span>
        </div>

        <ToolbarButton
          onClick={() => {
            setLinkOpen(true);
            setLinkUrl(editor.getAttributes("link").href || "");
          }}
          isActive={editor.isActive("link")}
          title="Link"
        >
          <FaLink />
        </ToolbarButton>

        {linkOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => { setLinkOpen(false); setLinkUrl(""); }}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-base font-semibold mb-4">Insert Link</h3>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="input-modern mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (linkUrl.trim()) {
                      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
                    }
                    setLinkOpen(false);
                    setLinkUrl("");
                  }
                  if (e.key === "Escape") {
                    setLinkOpen(false);
                    setLinkUrl("");
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    toast.success("Link removed");
                    setLinkOpen(false);
                    setLinkUrl("");
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Remove Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkOpen(false);
                    setLinkUrl("");
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (linkUrl.trim()) {
                      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
                      toast.success("Link applied");
                    }
                    setLinkOpen(false);
                    setLinkUrl("");
                  }}
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        <ToolbarButton
          onClick={handleAutoFormat}
          isActive={false}
          title="Auto Format"
        >
          <FaMagic />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
