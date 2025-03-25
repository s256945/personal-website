/* eslint-disable no-useless-escape */
import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function TerminalPortfolio() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string>("");
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const keySoundRef = useRef<HTMLAudioElement>(null);
  const enterSoundRef = useRef<HTMLAudioElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, string> = {
    help: `
      <span class='command-section-title'>Available commands:</span>
      <ul class='command-list'>
        <li><span class='command-text'>ls</span> — list available directories</li>
        <li><span class='command-text'>about</span> — learn who I am</li>
        <li><span class='command-text'>projects</span> — view recent builds</li>
        <li><span class='command-text'>contact</span> — send me a message</li>
        <li><span class='command-text'>cv</span> — grab a copy of my CV</li>
        <li><span class='command-text'>clear</span> — wipe the screen, stay sharp</li>
      </ul>
    `,

    ls: `
      <span class='command-text'>📁 ./about</span>&nbsp;&nbsp;
      <span class='command-text'>📁 ./projects</span>&nbsp;&nbsp;
      <span class='command-text'>📁 ./contact</span>&nbsp;&nbsp;
      <span class='command-text'>📄 ./cv</span>
    `,

    about: `
      <span class='command-section-title'>👩🏻‍💻 Amy Jordan</span>
      <ul class='about-list'>
        <li>🖥️ Software Engineer Degree Apprentice (Front-End)</li>
        <li>🌐 React · JavaScript · TypeScript · NodeJS</li>
        <li>🎓 Digital & Technology Solutions: Software</li>
        <li>🤍 Photography · Hiking · Books</li>
      </ul>
      <span class='command-desc'>Type 'projects' to explore my work, or 'contact' to get in touch.</span>
    `,

    projects: `
      <span class='command-section-title'>📂 Emergency Alert System</span>
      <a href='https://github.com/s256945/emergency-alert-system' target='_blank' class='command-link'>GitHub Repo</a>
      <div class='project-desc'>An MQTT pub-sub alert system for emergencies and disaster response.</div>
      <div class='project-tags'>Tech: Python · Flask · Mosquitto</div>
      <div class='terminal-divider'></div>
  
      <span class='command-section-title'>📂 Brownies Website</span>
      <a href='https://github.com/s256945/5thsmrktbrownies' target='_blank' class='command-link'>GitHub Repo</a>
      <div class='project-desc'>Website for my Brownies unit with resources and secure parent area.</div>
      <div class='project-tags'>Tech: React · Styled Components · HTML/CSS</div>
      <div class='terminal-divider'></div>
  
      <span class='command-section-title'>📂 Book Review Website</span>
      <a href='https://github.com/s256945/reallyreallygoodreads' target='_blank' class='command-link'>GitHub Repo</a>
      <div class='project-desc'>A book discovery and review platform for readers.</div>
      <div class='project-tags'>Tech: React · JavaScript · NodeJS</div>
    `,

    cv: `
      <span class='command-text'>📝 Would you like to download my CV? (y/n)</span>
    `,

    contact: `
      <span class='command-section-title'>📫 Contact Details</span>
      <span class='command-text'>Email:</span> <a href='mailto:amyj5165@gmail.com' class='command-link'>amyj5165@gmail.com</a><br/>
      <span class='command-text'>GitHub:</span> <a href='https://github.com/s256945' target='_blank' class='command-link'>github.com/s256945</a><br/>
      <span class='command-desc'>Say hi. I won’t bite 🤖</span>
    `,

    easteregg: `<span class='command-text'>🐣 You found a secret command. Congrats, you're officially cool.</span>`,

    sudo: `
  <div class='sudo-warning'>
    <pre class='command-ascii'>
     █████████████████████████
     █ 🔒 ACCESS DENIED █
     █████████████████████████
    </pre>
    <span class='command-section-title'>🛑 Unauthorized command attempt detected.</span>
    <span class='command-desc'>You are not root. This incident will be reported 😉</span>
    <span class='command-desc'>Try 'help' instead. It's safer.</span>
  </div>
`,

    hack: `
  <div class='hack-sequence'>
    <span class='command-section-title'>💻 Initiating hack.exe...</span>
    <div class='hack-progress'>
      <span>▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌█▌</span>
    </div>
    <span class='command-desc'>Accessing encrypted ports... spoofing MAC address... injecting packets...</span>
    <span class='command-desc'>Just kidding 😉</span>
  </div>
`,

    matrix: `<span class='command-text'>☠️ Welcome to the Matrix... follow the white rabbit.</span>`,

    cat: `
  <div class='cat-summon'>
    <span class='command-section-title'>🐾 Summoning cat.exe...</span>
    <pre class='command-ascii cat-ascii'>
      /\\_/\\  
     ( o.o ) 
      > ^ <
    </pre>
    <span class='command-desc'>Here, kitty kitty... 🐈</span>
  </div>
`,

    fortune: `<span class='command-text'>🔮 Fortune says: "Code is like humor. When you have to explain it, it’s bad."</span>`,

    clear: "clear",

    welcome: `
    <div>
    <pre class='command-ascii'>
    _                          _ 
   / \\   _ __ ___  _   _      | |
  / _ \\ | '_ \` _ \\| | | |  _  | |
 / ___ \\| | | | | | |_| | | |_| |
/_/   \\_\\_| |_| |_|\\__, |  \\___/ 
                   |___/         
    </pre>
    <span class='command-desc'>
      Welcome to my terminal portfolio!
    </span>
    <span class='command-desc'>
       Type '<span class="command-text">help</span>' to get started.
    </span>
  </div>`,
  };

  const handleCommand = (): void => {
    if (input.trim()) {
      setHistory([...history, input]);

      const newUserCommand = `> <span class='command-line user-command'>${input}</span>`;

      if (awaitingConfirmation) {
        if (input.toLowerCase() === "y") {
          window.open("/cv.pdf", "_blank");
          setOutput([
            ...output,
            newUserCommand,
            "<span class='command-text'>Downloading CV...</span>",
          ]);
        } else {
          setOutput([
            ...output,
            newUserCommand,
            "<span class='command-text'>Download cancelled.</span>",
          ]);
        }
        setAwaitingConfirmation(false);
      } else if (commands[input]) {
        if (input === "clear") {
          setOutput([]);
        } else if (input === "cv") {
          setAwaitingConfirmation(true);
          setOutput([...output, newUserCommand, commands[input]]);
        } else {
          const newOutput = [...output, newUserCommand, commands[input]];
          setOutput(newOutput);

          // Trigger matrix effect
          if (input === "matrix") {
            startMatrixEffect();
          }

          if (input === "hack") {
            const terminalBox = document.querySelector(".terminal-box");
            terminalBox?.classList.add("sudo-glitch"); // reuse sudo-glitch class
            setTimeout(() => {
              terminalBox?.classList.remove("sudo-glitch");
            }, 1500);
          }

          // Trigger sudo glitch
          if (input === "sudo") {
            const terminalBox = document.querySelector(".terminal-box");
            terminalBox?.classList.add("sudo-glitch");
            setTimeout(() => {
              terminalBox?.classList.remove("sudo-glitch");
            }, 2000);
          }
        }
      } else {
        setOutput([
          ...output,
          newUserCommand,
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
        setHistoryIndex(null);
      } else if (e.key === "ArrowUp") {
        if (history.length > 0) {
          e.preventDefault();
          const newIndex =
            historyIndex === null
              ? history.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        if (historyIndex !== null) {
          e.preventDefault();
          const newIndex = Math.min(history.length - 1, historyIndex + 1);
          setHistoryIndex(newIndex);
          setInput(history[newIndex] || "");
          if (newIndex >= history.length - 1) {
            setHistoryIndex(null);
          } else {
            setHistoryIndex(newIndex);
          }
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
  }, [input, suggestion, history, historyIndex]);

  const playTypingSound = () => {
    const keySound = keySoundRef.current;
    if (keySound && keySound.paused) {
      keySound.currentTime = 0;
      keySound.play().catch(() => {});
    } else if (keySound && !keySound.paused) {
      keySound.pause();
      keySound.currentTime = 0;
      keySound.play().catch(() => {});
    }
  };

  const playEnterSound = () => {
    const enterSound = enterSoundRef.current;
    if (enterSound) {
      enterSound.currentTime = 0;
      enterSound.play().catch(() => {});
    }
  };

  useEffect(() => {
    const handleTypingSound = (e: KeyboardEvent) => {
      const isTypingKey = /^[a-zA-Z0-9 .,'"!?@#$%^&*()_+\-=/\\[\]{}]$/.test(
        e.key
      );
      if (isTypingKey) playTypingSound();
    };

    const handleEnterSound = (e: KeyboardEvent) => {
      if (e.key === "Enter") playEnterSound();
    };

    window.addEventListener("keydown", handleTypingSound);
    window.addEventListener("keydown", handleEnterSound);

    return () => {
      window.removeEventListener("keydown", handleTypingSound);
      window.removeEventListener("keydown", handleEnterSound);
    };
  }, []);
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const startMatrixEffect = () => {
    const canvas = document.getElementById("matrixCanvas") as HTMLCanvasElement;
    const terminalBox = document.querySelector(".terminal-box");
    if (!canvas || !terminalBox) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const characters = "アカサタナハマヤラ0123456789".split("");

    let animationFrameId: number;
    let fadeOut = false;
    let fadeOpacity = 0.05;

    const draw = () => {
      if (!ctx) return;

      // Reduce opacity slowly for fadeout phase
      const fadeFill = fadeOut
        ? `rgba(0, 0, 0, ${fadeOpacity})`
        : "rgba(0, 0, 0, 0.05)";
      ctx.fillStyle = fadeFill;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (!fadeOut) {
          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      if (fadeOut) {
        fadeOpacity += 0.01;
        if (fadeOpacity >= 0.2) {
          // stop completely when it's faded out enough
          cancelAnimationFrame(animationFrameId);
          const ctxClear = canvas.getContext("2d");
          ctxClear?.clearRect(0, 0, width, height);
          document.body.classList.remove("matrix-active");
          terminalBox.classList.remove("matrix-glitch");
          return;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    document.body.classList.add("matrix-active");
    terminalBox.classList.add("matrix-glitch");

    draw();

    setTimeout(() => {
      fadeOut = true;
    }, 5000);
  };

  const hasRunOnce = useRef(false);

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    const defaultCommand = "welcome";
    setTimeout(() => {
      setHistory((prev) => [...prev, defaultCommand]);
      setOutput((prev) => [
        ...prev,
        `> <span class='command-line user-command'>${defaultCommand}</span>`,
        commands[defaultCommand],
      ]);
    }, 300);
  }, []);

  return (
    <div className="terminal-container">
      <div className="terminal-box">
        <div className="terminal-controls">
          <span className="circle red"></span>
          <span className="circle yellow"></span>
          <span className="circle green"></span>
          <span className="terminal-title">terminal — amy@portfolio</span>
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
        <canvas id="matrixCanvas" className="matrix-canvas"></canvas>
        <div className="terminal-input">
          <span>amy@portfolio:~$</span>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setHistoryIndex(null);
              }}
              autoFocus
            />
            {suggestion && (
              <span className="suggestion-item">{suggestion}</span>
            )}
          </div>
        </div>
      </div>
      <audio ref={keySoundRef} src="/key.wav" preload="auto" />
      <audio ref={enterSoundRef} src="/enter.wav" preload="auto" />
    </div>
  );
}
