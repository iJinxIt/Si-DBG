import { useRef, useState } from 'react'
import CodeEditor from '../components/codeeditor'

function FlashPage() {
    const fileInput = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)

    return (
        <>
            <div>
                <input
                    ref={fileInput}
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <button onClick={() => fileInput.current?.click()}>
                    Image Upload
                </button>
                {file?.name}
            </div>
            <button disabled={!file} onClick={() => { /* TODO: flashen */ }}>
                Flash
            </button>
            <div style={{ height: '70vh' }}>
                <CodeEditor />
            </div>
        </>
    )
}

export default FlashPage
