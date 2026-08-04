import pdf from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(file) {
    const type = file.mimetype;

    if (type === "application/pdf") {
        const data = await pdf(file.buffer);
        return data.text;
    }

    if (
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        const data = await mammoth.extractRawText({
            buffer: file.buffer,
        });

        return data.value;
    }

    if (type === "text/plain") {
        return file.buffer.toString();
    }

    throw new Error("Unsupported File");
}

