import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";

// Extension -> Monaco-Sprach-ID
const LANGS: Record<string, string> = {
  c: "c", h: "c", cpp: "cpp", hpp: "cpp", cc: "cpp", ino: "cpp",
  py: "python", js: "javascript", ts: "typescript",
  rs: "rust", s: "asm", asm: "asm", json: "json", txt: "plaintext",
};

function langFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return LANGS[ext] ?? "plaintext";
}

type CodeEditorProps = {
  onBreakpointsChange?: (lines: number[]) => void;
};

export default function CodeEditor({ onBreakpointsChange }: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  // { id: decorationId }  -- die echte Zeile lesen wir immer live aus dem Model
  const bpRef = useRef<{ id: string }[]>([]);

  // Der Callback steckt in einer Ref, damit die Monaco-Listener (die nur einmal
  // in onMount registriert werden) immer die aktuelle Version aufrufen.
  const callbackRef = useRef(onBreakpointsChange);
  useEffect(() => {
    callbackRef.current = onBreakpointsChange;
  }, [onBreakpointsChange]);

  const [file, setFile] = useState({ name: "untitled.c", text: "" });
  const [lines, setLines] = useState<number[]>([]);

  // Decoration-IDs -> aktuelle Zeilennummern. Monaco verschiebt die
  // Decorations beim Editieren automatisch mit, deshalb nie Zeilen cachen.
  const syncBreakpoints = useCallback(() => {
    const model = editorRef.current?.getModel();
    if (!model) return;
    const alive: { id: string }[] = [];
    const current: number[] = [];
    for (const bp of bpRef.current) {
      const range = model.getDecorationRange(bp.id);
      if (!range) continue; // Zeile wurde gelöscht
      alive.push(bp);
      current.push(range.startLineNumber);
    }
    bpRef.current = alive;
    const sorted = [...new Set(current)].sort((a, b) => a - b);
    setLines(sorted);
    callbackRef.current?.(sorted);
  }, []);

  const toggleBreakpoint = useCallback((line: number) => {
    const model = editorRef.current?.getModel();
    const monaco = monacoRef.current;
    if (!model || !monaco) return;

    const existing = bpRef.current.find(
      (bp) => model.getDecorationRange(bp.id)?.startLineNumber === line
    );

    if (existing) {
      model.deltaDecorations([existing.id], []);
      bpRef.current = bpRef.current.filter((bp) => bp !== existing);
    } else {
      const [id] = model.deltaDecorations([], [{
        range: new monaco.Range(line, 1, line, 1),
        options: {
          glyphMarginClassName: "bp-glyph",
          glyphMarginHoverMessage: { value: `Breakpoint Zeile ${line}` },
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      }]);
      bpRef.current.push({ id });
    }
    syncBreakpoints();
  }, [syncBreakpoints]);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Klick in die Glyph-Margin (der schmale Streifen links der Zeilennummern)
    editor.onMouseDown((e) => {
      if (e.target.type !== monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) return;
      const line = e.target.position?.lineNumber;
      if (line) toggleBreakpoint(line);
    });

    // F9 wie in VS Code
    editor.addCommand(monaco.KeyCode.F9, () => {
      const line = editor.getPosition()?.lineNumber;
      if (line) toggleBreakpoint(line);
    });

    // Zeilen nachziehen, wenn oberhalb eingefügt/gelöscht wird
    editor.onDidChangeModelContent(() => syncBreakpoints());
  }, [toggleBreakpoint, syncBreakpoints]);

  const loadFile = useCallback(async (f: File | null | undefined) => {
    if (!f) return;
    // Erst die Decorations vom aktuellen Model entfernen, sonst bleiben die
    // roten Punkte dort hängen (z.B. wenn dieselbe Datei erneut geladen wird).
    const model = editorRef.current?.getModel();
    if (model) model.deltaDecorations(bpRef.current.map((bp) => bp.id), []);
    bpRef.current = [];
    setLines([]);
    callbackRef.current?.([]);
    setFile({ name: f.name, text: await f.text() });
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); }}
    >
      <style>{`
        .bp-glyph::after {
          content: "";
          display: block;
          width: 12px; height: 12px;
          margin: 3px 0 0 3px;
          border-radius: 50%;
          background: #e51400;
        }
        .monaco-editor .margin-view-overlays .cgmr { cursor: pointer; }
      `}</style>

      <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 8 }}>
        <input type="file" onChange={(e) => loadFile(e.target.files?.[0])} />
        <span style={{ fontFamily: "monospace" }}>{file.name}</span>
        <span style={{ marginLeft: "auto" }}>
          Breakpoints: {lines.join(", ") || "—"}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          theme="vs-dark"
          path={file.name}             /* eigenes Model pro Datei */
          language={langFor(file.name)}
          value={file.text}
          onMount={handleMount}
          options={{
            glyphMargin: true,         /* ohne das gibt es keinen Platz fuer den Punkt */
            lineNumbersMinChars: 3,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
