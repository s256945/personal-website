import { useState, useEffect } from "react";

export default function TerminalPortfolio() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const commands: Record<string, string> = {
    help: "Available commands: ls, about, projects, contact, clear",
    ls: "about.txt  projects/  contact.txt",
    about:
      "I'm Amy Jordan, a software engineer specializing in React and Flask.",
    projects: "Project 1: Emergency Alert System | Project 2: Brownies Website",
    contact: "Email: amy@example.com | GitHub: github.com/amyjordan",
    clear: "clear",
  };

  const handleCommand = (): void => {
    if (input.trim()) {
      setHistory([...history, input]);
      if (commands[input]) {
        if (input === "clear") {
          setOutput([]);
        } else {
          setOutput([...output, `> ${input}`, commands[input]]);
        }
      } else {
        setOutput([
          ...output,
          `> ${input}`,
          "Command not found. Type 'help' for available commands.",
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

  return (
    <div className="h-screen bg-black text-green-400 font-mono p-4">
      <div className="max-w-2xl mx-auto">
        <p>Welcome to Amy's Terminal Portfolio. Type 'help' for commands.</p>
        <div className="mt-2">
          {output.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className="flex">
          <span className="mr-2">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-black text-green-400 outline-none w-full"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
