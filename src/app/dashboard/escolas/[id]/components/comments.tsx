"use client";
import { Combobox } from "@/components/comboboxes";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Separator } from "@/components/ui/separator";
import type { Cooperative } from "@/types/cooperative";
import type { Editor } from "@tiptap/react";
import React from "react";

export function Comments({
  cooperatives,
  comments,
}: {
  cooperatives: Cooperative[];
  comments: object; // Ajustado para string
}) {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const [comment, setComment] = React.useState<object>(comments);
  const [editor, setEditor] = React.useState<Editor | null>(null);

  // Função para adicionar fornecedora ao comentário ou mover o cursor para a fornecedora existente
  const handleCooperativeChange = (cooperative: string) => {
    if (!cooperative) return;

    const name = cooperatives.find(({ id }) => id.toString() === cooperative)?.name;
    setValue(undefined);
    if (!JSON.stringify(comment)?.includes(`cooperative-${cooperative}`)) {
      editor?.commands.insertContent(
        `<tag id="cooperative-${cooperative}" name="${name}"></tag>`
      );
    }
  };

  React.useEffect(() => {
    if (value) handleCooperativeChange(value);
  }, [value, handleCooperativeChange]);

  return (
    <div className="grid gap-1">
      <input
        type="text"
        value={JSON.stringify(comment)}
        hidden
        readOnly
        id="comments"
        name="comments"
        form="upsert"
      />
      <Label>Observações</Label>
      <RichTextEditor
        setEditor={setEditor}
        defaultValue={comments}
        onChange={(content) => {
          setComment(content);
        }}
      >
        <Separator orientation="vertical" className="w-[1px] h-8" />
        <Combobox
          data={cooperatives.map(({ id, name }) => ({ id: id.toString(), name }))}
          id="cityhall_id"
          align="end"
          label="fornecedora"
          setValue={setValue}
          value={value}
        />
      </RichTextEditor>
    </div>
  );
}
