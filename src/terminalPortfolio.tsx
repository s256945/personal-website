/* eslint-disable no-useless-escape */
import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function TerminalPortfolio() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string>("");
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, string> = {
    help: `
        <span class='command-text'>Available commands:</span><br/>
        <span class='command-text'>• ls</span> — list available directories<br/>
        <span class='command-text'>• about</span> — learn who I am<br/>
        <span class='command-text'>• projects</span> — view recent builds<br/>
        <span class='command-text'>• contact</span> — send me a signal<br/>
        <span class='command-text'>• cv</span> — grab a copy of my CV<br/>
        <span class='command-text'>• clear</span> — wipe the screen, stay sharp
      `,

    ls: `
        <span class='command-text'>📁 ./about</span>&nbsp;&nbsp;
        <span class='command-text'>📁 ./projects</span>&nbsp;&nbsp;
        <span class='command-text'>📁 ./contact</span>&nbsp;&nbsp;
        <span class='command-text'>📄 ./cv</span>
      `,

    about: `
        <pre class='command-ascii'>
   _____ ___.                  __   
  /  _  \\_ |__   ____  __ ___/  |_ 
 /  /_\  \| __ \ /  _ \|  |  \   __\
/    |    \ \_\ (  <_> )  |  /|  |  
\____|__  /___  /\____/|____/ |__|  
        \/    \/                    
        </pre>
        <span class='command-text'>[system boot: complete]</span><br/>
        <span class='command-text'>User: Amy Jordan</span><br/>
        <span class='command-text'>Role: Software Engineer Degree Apprentice (Front-End)</span><br/>
        <span class='command-text'>Stack: React | JavaScript | TypeScript | Styled Components</span><br/>
        <span class='command-text'>Studying: Digital & Technology Solutions: Software</span><br/>
        <span class='command-text'>Interests: photography 📸 | hiking 🥾 | good books 📚</span><br/>
        <span class='command-text'>Type 'projects' to explore my work, or 'contact' to get in touch.</span>
      `,

    projects: `
      <span class='command-text'>📂 Project 1:</span> <a href='https://github.com/s256945/emergency-alert-system' target='_blank' class='command-link'>Emergency Alert System</a><br/>
      <span class='project-desc'>An MQTT-based alert system for emergencies and disaster response.</span><br/>
      <span class='project-tags'>Tech: Python · Flask · Mosquitto · MQTT</span><br/><br/>
    
      <span class='command-text'>📂 Project 2:</span> <a href='https://github.com/s256945/5thsmrktbrownies' target='_blank' class='command-link'>Brownies Website</a><br/>
      <span class='project-desc'>A playful website for a Brownie unit with secure parent area and resources.</span><br/>
      <span class='project-tags'>Tech: React · Styled Components · HTML/CSS</span><br/><br/>
    
      <span class='command-text'>📂 Project 3:</span> <a href='https://github.com/s256945/reallyreallygoodreads' target='_blank' class='command-link'>Book Review Website</a><br/>
      <span class='project-desc'>A book discovery and review platform for readers.</span><br/>
      <span class='project-tags'>Tech: React · TypeScript · Firebase</span>
    `,

    cv: `
        <span class='command-text'>📝 Would you like to download my CV? (y/n)</span>
      `,

    contact: `
        <span class='command-text'>📫 Email:</span> <a href='mailto:amyj5165@gmail.com' class='command-link'>amyj5165@gmail.com</a><br/>
        <span class='command-text'>🔗 GitHub:</span> <a href='https://github.com/s256945' target='_blank' class='command-link'>github.com/s256945</a><br/>
        <span class='command-text'>Say hi. I won’t bite 🤖</span>
      `,

    easteregg: `<span class='command-text'>🐣 You found a secret command. Congrats, you're officially cool.</span>`,

    sudo: `<span class='command-text'>🛑 Nice try. You’re not root.</span>`,

    hack: `<span class='command-text'>💻 Initiating hack.exe... just kidding 😉</span>`,
    
    matrix: `<span class='command-text'>☠️ Welcome to the Matrix... follow the white rabbit.</span>`,

    cat: `<pre class='command-ascii'>
  /\_/\  
 ( o.o ) 
  > ^ <
</pre>`,
    fortune: `<span class='command-text'>🔮 Fortune says: "Code is like humor. When you have to explain it, it’s bad."</span>`,

    clear: "clear",
  };

  const handleCommand = (): void => {
    if (input.trim()) {
      setHistory([...history, input]);

      if (awaitingConfirmation) {
        if (input.toLowerCase() === "y") {
          window.open("/cv.pdf", "_blank");
          setOutput([
            ...output,
            "> <span class='command-line user-command'>y</span>",
            "<span class='command-text'>Downloading CV...</span>",
          ]);
        } else {
          setOutput([
            ...output,
            "> <span class='command-line user-command'>n</span>",
            "<span class='command-text'>Download cancelled.</span>",
          ]);
        }
        setAwaitingConfirmation(false);
      } else if (commands[input]) {
        if (input === "clear") {
          setOutput([]);
        } else if (input === "cv") {
          setAwaitingConfirmation(true);
          setOutput([
            ...output,
            `> <span class='command-line user-command'>${input}</span>`,
            commands[input],
          ]);
        } else {
          setOutput([
            ...output,
            `> <span class='command-line user-command'>${input}</span>`,
            commands[input],
          ]);
        }
      } else {
        setOutput([
          ...output,
          `> <span class='command-line user-command'>${input}</span>`,
          "<span class='command-error'>Command not found.</span> Type '<span class='command-info'>help</span>' for available commands.",
        ]);
        outputRef.current?.classList.add("terminal-shake");
        setTimeout(() => {
          outputRef.current?.classList.remove("terminal-shake");
        }, 400);
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
        <div className="terminal-controls">
          <span className="circle red"></span>
          <span className="circle yellow"></span>
          <span className="circle green"></span>
        </div>
        <p className="terminal-header">Welcome to Amy's website</p>
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

// (y/n) to download cv
// projects open in new tab
// fix colours to white
// about me
// ls?
