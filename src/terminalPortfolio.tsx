import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function TerminalPortfolio() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const outputRef = useRef<HTMLDivElement>(null);

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
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCommand();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, output, history]);

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
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
