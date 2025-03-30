"use client";
import { useCallback } from "react";

import { Toggle } from "@radix-ui/react-toggle";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  MessageSquareQuote,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link,
  Unlink,
  CornerDownLeft,
} from "lucide-react";

type Props = {
  editor: Editor | null;
};

export const ArticleEditorToolbar: React.FC<Props> = ({ editor }) => {
  const iconSize = 18;

  const setLink = useCallback(() => {
    const previousLink = editor?.getAttributes("link").href;
    const url = window.prompt("Paste link here", previousLink);

    // Cancelled
    if (!url) return;

    // Empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Update link
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-group">
        {/* Heading 2 */}
        <Toggle
          className={
            editor.isActive("heading", { level: 2 })
              ? "btn-toggle-active"
              : "btn-toggle"
          }
          pressed={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={iconSize} />
        </Toggle>
        {/* Heading 3 */}
        <Toggle
          className={
            editor.isActive("heading", { level: 3 })
              ? "btn-toggle-active"
              : "btn-toggle"
          }
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={iconSize} />
        </Toggle>
      </div>

      <div className="editor-toolbar-group">
        {/* Bold */}
        <Toggle
          className={
            editor.isActive("bold") ? "btn-toggle-active" : "btn-toggle"
          }
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={iconSize} />
        </Toggle>
        {/* Strike */}
        <Toggle
          className={
            editor.isActive("strike") ? "btn-toggle-active" : "btn-toggle"
          }
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={iconSize} />
        </Toggle>
        {/* Italic */}
        <Toggle
          className={
            editor.isActive("italic") ? "btn-toggle-active" : "btn-toggle"
          }
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={iconSize} />
        </Toggle>
        {/* Blockquote */}
        <Toggle
          className={
            editor.isActive("block") ? "btn-toggle-active" : "btn-toggle"
          }
          pressed={editor.isActive("block")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <MessageSquareQuote size={iconSize} />
        </Toggle>
      </div>
      {/* Link & unlink */}
      <div className="editor-toolbar-group">
        <Toggle
          onClick={setLink}
          className={
            editor.isActive("link") ? "btn-toggle-active" : "btn-toggle"
          }
        >
          <Link size={iconSize} />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={
            editor.isActive("link") ? "btn-toggle-active" : "btn-toggle"
          }
          disabled={!editor.isActive("link")}
        >
          <Unlink size={iconSize} />
        </Toggle>

        <Toggle
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={
            editor.isActive("hardBreak") ? "btn-toggle-active" : "btn-toggle"
          }
        >
          <CornerDownLeft size={iconSize} />
        </Toggle>
      </div>

      {/* ----- */}
      {/* Lists */}
      {/* ----- */}
      <div className="editor-toolbar-group">
        <Toggle
          className={
            editor.isActive("list") ? "btn-toggle-active" : "btn-toggle"
          }
          pressed={editor.isActive("list")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List size={18} />
        </Toggle>
        <Toggle
          className={
            editor.isActive("list") ? "btn-toggle-active" : "btn-toggle"
          }
          pressed={editor.isActive("list")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered size={18} />
        </Toggle>
      </div>
    </div>
  );
};
