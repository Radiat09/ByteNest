"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaHeading,
  FaParagraph,
} from "react-icons/fa";
import { Highlighter } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
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
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[120px] p-3 outline-none focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("rounded-lg border border-gray-200 overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
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
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
