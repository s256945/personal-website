import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function TerminalPortfolio() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string>("");
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, string> = {
    help: "<span class='command-info'>Available commands:</span> <span class='command-info'>ls</span>, <span class='command-info'>about</span>, <span class='command-info'>projects</span>, <span class='command-info'>contact</span>, <span class='command-info'>clear</span>",
    ls: "<span class='command-blue'>about.txt</span>  <span class='command-blue'>projects/</span>  <span class='command-blue'>contact.txt</span>",
    about:
      "<span class='command-green'>I'm Amy Jordan, a software engineer specializing in React and Flask.</span>",
    projects:
      "<span class='command-teal'>Project 1:</span> Emergency Alert System | <span class='command-teal'>Project 2:</span> Brownies Website",
    contact:
      "<span class='command-orange'>Email:</span> amy@example.com | <span class='command-orange'>GitHub:</span> github.com/amyjordan",
    clear: "clear",
  };

  const handleCommand = (): void => {
    if (input.trim()) {
      setHistory([...history, input]);
      if (commands[input]) {
        if (input === "clear") {
          setOutput([]);
        } else {
          setOutput([
            ...output,
            `> <span class='command-line'>${input}</span>`,
            commands[input],
          ]);
        }
      } else {
        setOutput([
          ...output,
          `> <span class='command-line'>${input}</span>`,
          "<span class='command-error'>Command not found.</span> Type '<span class='command-info'>help</span>' for available commands.",
        ]);
      }
      setInput("");
      setSuggestion("");
    }
  };

  // Update suggestions when the input changes
  useEffect(() => {
    if (input.trim() === "") {
      setSuggestion("");
    } else {
      const filteredCommands = Object.keys(commands).filter((cmd) =>
        cmd.startsWith(input)
      );

      if (filteredCommands.length === 1) {
        setSuggestion(filteredCommands[0].slice(input.length));
      } else {
        setSuggestion("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // Update the suggestion's position based on the caret
  useEffect(() => {
    if (inputRef.current && suggestion) {
      const input = inputRef.current;
      const caretPosition = input.selectionStart;

      if (caretPosition !== null) {
        const span = document.createElement("span");
        span.style.visibility = "hidden";
        span.style.position = "absolute";
        span.style.whiteSpace = "pre";
        span.style.fontFamily = "Courier New, Courier, monospace";
        span.innerText = input.value.substring(0, caretPosition);
        document.body.appendChild(span);

        const spanRect = span.getBoundingClientRect();
        const leftPosition = spanRect.right;
        document.body.removeChild(span);

        // Position the suggestion correctly next to the input text
        const suggestionElement = input.nextElementSibling as HTMLElement;
        if (suggestionElement) {
          suggestionElement.style.left = `${leftPosition}px`;
        }
      }
    }
  }, [input, suggestion]);

  // Handle key events (Enter, Tab, ArrowUp, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCommand();
      } else if (e.key === "ArrowUp") {
        if (history.length) {
          setInput(history[history.length - 1]);
        }
      } else if (e.key === "Tab") {
        // Handle autocomplete when tab is pressed
        e.preventDefault(); // Prevent default tab behavior (switching focus)
        if (suggestion) {
          setInput(input + suggestion);
          setSuggestion("");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, output, history, suggestion]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="terminal-container">
      <div className="terminal-box">
        <p className="terminal-header">Welcome to Amy's Terminal Portfolio</p>
        <p className="terminal-subheader">
          Type 'help' for available commands.
        </p>
        <div className="terminal-output" ref={outputRef}>
          {output.map((line, index) => (
            <p
              key={index}
              className="terminal-line"
              dangerouslySetInnerHTML={{ __html: line }}
            ></p>
          ))}
        </div>
        <div className="terminal-input">
          <span>$</span>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            {suggestion && (
              <span className="suggestion-item">{suggestion}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
