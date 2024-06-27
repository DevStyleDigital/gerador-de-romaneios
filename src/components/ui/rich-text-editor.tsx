"use client";
import {
	type Editor,
	EditorContent,
	Node,
	NodeViewContent,
	NodeViewWrapper,
	ReactNodeViewRenderer,
	mergeAttributes,
	useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tag = (props: any) => {
	return (
		<NodeViewWrapper className="tag">
			<p
				className="rich-text-tag"
				id={props.node.attrs.id}
				contentEditable={false}
			>
				{props.node.attrs.name}
			</p>
			<NodeViewContent className="rich-text-content is-editable" />
		</NodeViewWrapper>
	);
};

const RichTextEditor = ({
	children,
	onChange,
	defaultValue,
	setEditor,
}: {
	children?: React.ReactNode;
	onChange: (content: any) => void;
	setEditor: (e: any | null) => void;
	defaultValue?: object;
}) => {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class:
					"min-h-[200px] max-h-[200px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
			},
		},
		extensions: [
			Node.create({
				name: "tag",
				group: "block",
				content: "inline*",
				parseHTML() {
					return [{ tag: "tag" }];
				},
				addAttributes() {
					return {
						id: {
							default: "",
						},
						name: {
							default: "",
						},
					};
				},
				addKeyboardShortcuts() {
					return {
						"Mod-Enter": () => {
							return this.editor
								.chain()
								.insertContentAt(this.editor.state.selection.head, {
									type: this.type.name,
								})
								.focus()
								.run();
						},
					};
				},
				renderHTML({ HTMLAttributes }) {
					return ["tag", mergeAttributes(HTMLAttributes), 0];
				},
				addNodeView() {
					return ReactNodeViewRenderer(Tag);
				},
			}),
			StarterKit.configure({
				blockquote: false,
				bold: false,
				bulletList: false,
				code: false,
				codeBlock: false,
				dropcursor: false,
				gapcursor: false,
				heading: false,
				history: false,
				horizontalRule: false,
				italic: false,
				listItem: false,
				orderedList: false,
				strike: false,
			}),
		],
		content: defaultValue || "",
		onCreate: ({ editor }) => {
			setEditor(editor);
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getJSON());
		},
	});

	return (
		<>
			<EditorContent editor={editor} />
			{editor ? (
				<RichTextEditorToolbar editor={editor}>
					{children}
				</RichTextEditorToolbar>
			) : null}
		</>
	);
};

const RichTextEditorToolbar = ({
	children,
}: {
	editor: Editor;
	children?: React.ReactNode;
}) => {
	return (
		<div className="border border-input bg-transparent rounded-br-md rounded-bl-md p-1 flex flex-row items-center gap-1">
			{/* <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle> */}
			{children}
		</div>
	);
};

export default RichTextEditor;
