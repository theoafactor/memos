import { Dropdown, IconButton, Menu, MenuButton } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import useClickAway from "react-use/lib/useClickAway";
import Icon from "@/components/Icon";
import OverflowTip from "@/components/kit/OverflowTip";
import { useTagStore } from "@/store/module";
import { EditorRefActions } from "../Editor";

interface Props {
  editorRef: React.RefObject<EditorRefActions>;
}

const TagSelector = (props: Props) => {
  const { editorRef } = props;
  const tagStore = useTagStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tags = tagStore.state.tags;

  useEffect(() => {
    (async () => {
      try {
        await tagStore.fetchTags();
      } catch (error) {
        // do nothing.
      }
    })();
  }, []);

  useClickAway(containerRef, () => {
    setOpen(false);
  });

  const handleTagClick = (tag: string) => {
    editorRef.current?.insertText(`#${tag} `);
  };

  return (
    <Dropdown open={open} onOpenChange={(_, isOpen) => setOpen(isOpen)}>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            size: "sm",
          },
        }}
      >
        <Icon.Hash className="w-5 h-5 mx-auto" />
      </MenuButton>
      <Menu className="relative text-sm" component="div" size="sm" placement="bottom-start">
        <div ref={containerRef}>
          {tags.length > 0 ? (
            <div className="flex-row justify-start items-start flex-wrap px-1 max-w-[12rem] h-auto max-h-48 overflow-y-auto font-mono">
              {tags.map((tag) => {
                return (
                  <div
                    key={tag}
                    className="inline-flex w-auto max-w-full cursor-pointer rounded text-sm leading-5 px-1 text-gray-500 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => handleTagClick(tag)}
                  >
                    <OverflowTip>#{tag}</OverflowTip>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="italic mx-2" onClick={(e) => e.stopPropagation()}>
              No tag found
            </p>
          )}
        </div>
      </Menu>
    </Dropdown>
  );
};

export default TagSelector;
