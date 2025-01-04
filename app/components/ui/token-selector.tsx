import { Dialog } from "@/app/components/ui/dialog";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Input } from "@/app/components/ui/input";
import { useState, useEffect, useRef } from "react";

export type Token = {
  symbol: string;
  name: string;
};

type TokenSelectorProps = {
  value: Token;
  onChange: (token: Token) => void;
  tokens: Token[];
};

export function TokenSelector({ value, onChange, tokens }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredTokens.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTokens[selectedIndex]) {
        onChange(filteredTokens[selectedIndex]);
        setIsOpen(false);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700"
      >
        <span>{value.symbol}</span>
        <ChevronDownIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </button>

      <Dialog open={isOpen} onClose={handleClose}>
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Select Token
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose a token from the list below
            </p>
          </div>

          <Input
            ref={inputRef}
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="mb-4"
          />

          <div className="space-y-2">
            {filteredTokens.map((token, index) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onChange(token);
                  handleClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                  index === selectedIndex ? "bg-zinc-100 dark:bg-zinc-700" : ""
                }`}
              >
                <span className="text-zinc-900 dark:text-white">
                  {token.symbol}
                </span>
                {token.symbol === value.symbol && (
                  <CheckIcon className="h-4 w-4 text-zinc-900 dark:text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
}
